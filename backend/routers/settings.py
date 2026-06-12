"""
Settings API routes - Production Grade
Comprehensive settings, preferences, profile, and account management
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime
from pathlib import Path
import os
import uuid

from models import User, UserSettings
from schemas import (
    UserSettingsResponse,
    UserSettingsUpdate,
    ProfileUpdate,
    AppearanceUpdate,
    NotificationPreferencesUpdate,
    EmailPreferencesUpdate,
    SecurityUpdate,
    PasswordChange,
    DeleteAccountRequest,
    UserResponse
)
from auth import get_current_user, get_db, verify_password, hash_password
from services.email_service import email_service

router = APIRouter(prefix="/settings", tags=["settings"])

# ============ UTILITY FUNCTIONS ============

def get_or_create_settings(user_id: int, db: Session) -> UserSettings:
    """Get or create user settings"""
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    if not settings:
        settings = UserSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def validate_time_format(time_str: str) -> bool:
    """Validate time format HH:MM"""
    try:
        parts = time_str.split(":")
        if len(parts) != 2:
            return False
        hour = int(parts[0])
        minute = int(parts[1])
        return 0 <= hour < 24 and 0 <= minute < 60
    except:
        return False


# ============ PROFILE ENDPOINTS ============

@router.get("/profile", response_model=UserResponse)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user profile information"""
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_update: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    if profile_update.full_name:
        current_user.full_name = profile_update.full_name
    
    settings = get_or_create_settings(current_user.id, db)
    
    if profile_update.bio is not None:
        if len(profile_update.bio) > 500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bio must be less than 500 characters"
            )
        settings.bio = profile_update.bio
    
    if profile_update.profile_picture_url:
        settings.profile_picture_url = profile_update.profile_picture_url
    
    settings.updated_at = datetime.utcnow()
    db.add(current_user)
    db.add(settings)
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.post("/profile/upload-picture")
def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload profile picture"""
    # Validate file
    allowed_extensions = {"jpg", "jpeg", "png", "gif", "webp"}
    file_extension = file.filename.split(".")[-1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed: jpg, jpeg, png, gif, webp"
        )
    
    if file.size > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size must not exceed 5MB"
        )
    
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = Path("static/uploads/profiles")
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate unique filename
        unique_filename = f"{current_user.id}_{uuid.uuid4()}.{file_extension}"
        file_path = upload_dir / unique_filename
        
        # Save file
        with open(file_path, "wb") as f:
            content = file.file.read()
            f.write(content)
        
        # Update settings
        settings = get_or_create_settings(current_user.id, db)
        settings.profile_picture_url = f"/static/uploads/profiles/{unique_filename}"
        settings.updated_at = datetime.utcnow()
        db.add(settings)
        db.commit()
        db.refresh(settings)
        
        return {
            "message": "Profile picture uploaded successfully",
            "url": settings.profile_picture_url
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload profile picture: {str(e)}"
        )


# ============ APPEARANCE ENDPOINTS ============

@router.get("/appearance", response_model=dict)
def get_appearance_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get appearance settings"""
    settings = get_or_create_settings(current_user.id, db)
    return {
        "theme": settings.theme,
        "accent_color": settings.accent_color
    }


@router.put("/appearance", response_model=UserSettingsResponse)
def update_appearance(
    appearance: AppearanceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update appearance settings"""
    valid_themes = ["light", "dark", "system"]
    valid_colors = ["blue", "purple", "green", "red", "pink", "orange", "amber", "cyan", "indigo", "violet"]
    
    if appearance.theme not in valid_themes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid theme. Must be one of: {', '.join(valid_themes)}"
        )
    
    if appearance.accent_color not in valid_colors:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid accent color. Must be one of: {', '.join(valid_colors)}"
        )
    
    settings = get_or_create_settings(current_user.id, db)
    settings.theme = appearance.theme
    settings.accent_color = appearance.accent_color
    settings.updated_at = datetime.utcnow()
    
    db.add(settings)
    db.commit()
    db.refresh(settings)
    
    return settings


# ============ NOTIFICATION ENDPOINTS ============

@router.get("/notifications", response_model=dict)
def get_notification_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get notification preferences"""
    settings = get_or_create_settings(current_user.id, db)
    return {
        "notifications_enabled": settings.notifications_enabled,
        "email_notifications": settings.email_notifications,
        "browser_notifications": settings.browser_notifications,
        "in_app_notifications": settings.in_app_notifications,
        "push_notifications": settings.push_notifications,
        "habit_reminders": settings.habit_reminders,
        "task_reminders": settings.task_reminders,
        "meeting_reminders": settings.meeting_reminders,
        "reminder_time": settings.reminder_time
    }


@router.put("/notifications", response_model=UserSettingsResponse)
def update_notification_preferences(
    preferences: NotificationPreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update notification preferences"""
    settings = get_or_create_settings(current_user.id, db)
    
    # Update notification settings
    if preferences.notifications_enabled is not None:
        settings.notifications_enabled = preferences.notifications_enabled
    
    if preferences.email_notifications is not None:
        settings.email_notifications = preferences.email_notifications
    
    if preferences.browser_notifications is not None:
        settings.browser_notifications = preferences.browser_notifications
    
    if preferences.in_app_notifications is not None:
        settings.in_app_notifications = preferences.in_app_notifications
    
    if preferences.push_notifications is not None:
        settings.push_notifications = preferences.push_notifications
    
    if preferences.habit_reminders is not None:
        settings.habit_reminders = preferences.habit_reminders
    
    if preferences.task_reminders is not None:
        settings.task_reminders = preferences.task_reminders
    
    if preferences.meeting_reminders is not None:
        settings.meeting_reminders = preferences.meeting_reminders
    
    if preferences.reminder_time is not None:
        if not validate_time_format(preferences.reminder_time):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reminder time format. Use HH:MM (24-hour format)"
            )
        settings.reminder_time = preferences.reminder_time
    
    settings.updated_at = datetime.utcnow()
    db.add(settings)
    db.commit()
    db.refresh(settings)
    
    return settings


# ============ EMAIL PREFERENCES ENDPOINTS ============

@router.get("/email-preferences", response_model=dict)
def get_email_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get email notification preferences"""
    settings = get_or_create_settings(current_user.id, db)
    return {
        "email_habit_reminders": settings.email_habit_reminders,
        "email_task_reminders": settings.email_task_reminders,
        "email_meeting_reminders": settings.email_meeting_reminders,
        "daily_summary": settings.daily_summary,
        "daily_summary_time": settings.daily_summary_time
    }


@router.put("/email-preferences", response_model=UserSettingsResponse)
def update_email_preferences(
    preferences: EmailPreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update email notification preferences"""
    settings = get_or_create_settings(current_user.id, db)
    
    if preferences.email_habit_reminders is not None:
        settings.email_habit_reminders = preferences.email_habit_reminders
    
    if preferences.email_task_reminders is not None:
        settings.email_task_reminders = preferences.email_task_reminders
    
    if preferences.email_meeting_reminders is not None:
        settings.email_meeting_reminders = preferences.email_meeting_reminders
    
    if preferences.daily_summary is not None:
        settings.daily_summary = preferences.daily_summary
    
    if preferences.daily_summary_email is not None:
        settings.daily_summary_email = preferences.daily_summary_email
    
    if preferences.welcome_email is not None:
        settings.welcome_email = preferences.welcome_email
    
    if preferences.daily_summary_time is not None:
        if not validate_time_format(preferences.daily_summary_time):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid daily summary time format. Use HH:MM (24-hour format)"
            )
        settings.daily_summary_time = preferences.daily_summary_time
    
    settings.updated_at = datetime.utcnow()
    db.add(settings)
    db.commit()
    db.refresh(settings)
    
    return settings


@router.post("/test-email", status_code=status.HTTP_200_OK)
def test_email_connection(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a test email to verify SMTP connection"""
    try:
        success = email_service.send_email(
            to_email=current_user.email,
            subject="Test Email - LifeMind AI Connection Verification",
            html_content=f"""
            <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #4CAF50; margin-top: 0;">✓ Connection Successful!</h2>
                        <p>Hi <strong>{current_user.full_name or current_user.username}</strong>,</p>
                        <p>This is a test email from LifeMind AI to verify that your email settings are configured correctly.</p>
                        <p style="padding: 15px; background-color: #f0f9ff; border-left: 4px solid #4CAF50; border-radius: 4px;">
                            If you received this email, it means your email notifications are working perfectly!
                        </p>
                        <p style="color: #666; font-size: 12px; margin-top: 30px;">
                            This is an automated message from LifeMind AI. You can manage email preferences in your settings.
                        </p>
                    </div>
                </body>
            </html>
            """,
            text_content=f"Hello {current_user.full_name or current_user.username},\n\nYour email connection to LifeMind AI is working correctly!"
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send test email. Please check your SMTP settings."
            )
        
        return {"message": "Test email sent successfully", "status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send test email: {str(e)}"
        )


# ============ SECURITY ENDPOINTS ============

@router.get("/security", response_model=dict)
def get_security_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get security settings"""
    settings = get_or_create_settings(current_user.id, db)
    return {
        "two_factor_enabled": settings.two_factor_enabled,
        "session_timeout": settings.session_timeout,
        "last_login": settings.last_login,
        "last_password_change": settings.last_password_change
    }


@router.put("/security", response_model=UserSettingsResponse)
def update_security_settings(
    security: SecurityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update security settings"""
    settings = get_or_create_settings(current_user.id, db)
    
    if security.two_factor_enabled is not None:
        settings.two_factor_enabled = security.two_factor_enabled
    
    if security.session_timeout is not None:
        if security.session_timeout < 5 or security.session_timeout > 1440:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Session timeout must be between 5 and 1440 minutes"
            )
        settings.session_timeout = security.session_timeout
    
    settings.updated_at = datetime.utcnow()
    db.add(settings)
    db.commit()
    db.refresh(settings)
    
    return settings


@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    password_change: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password with validation"""
    # Verify current password
    if not verify_password(password_change.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if len(password_change.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters"
        )
    
    # Check password strength
    has_upper = any(c.isupper() for c in password_change.new_password)
    has_lower = any(c.islower() for c in password_change.new_password)
    has_digit = any(c.isdigit() for c in password_change.new_password)
    
    if not (has_upper and has_lower and has_digit):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain uppercase, lowercase, and digits"
        )
    
    # Check new password is not same as current
    if verify_password(password_change.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password cannot be the same as current password"
        )
    
    # Verify password confirmation
    if password_change.new_password != password_change.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    # Update password
    current_user.hashed_password = hash_password(password_change.new_password)
    
    # Update password change timestamp
    settings = get_or_create_settings(current_user.id, db)
    settings.last_password_change = datetime.utcnow()
    settings.updated_at = datetime.utcnow()
    
    db.add(current_user)
    db.add(settings)
    db.commit()
    
    return {"message": "Password changed successfully", "status": "success"}


# ============ GENERAL SETTINGS ENDPOINTS ============

@router.get("", response_model=UserSettingsResponse)
def get_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all user settings"""
    settings = get_or_create_settings(current_user.id, db)
    return settings


@router.put("", response_model=UserSettingsResponse)
def update_settings(
    settings_update: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update multiple settings at once"""
    settings = get_or_create_settings(current_user.id, db)
    
    # Update only provided fields
    update_data = settings_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        # Validate specific fields
        if field == "reminder_time" and value and not validate_time_format(value):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reminder time format. Use HH:MM (24-hour format)"
            )
        if field == "daily_summary_time" and value and not validate_time_format(value):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid daily summary time format. Use HH:MM (24-hour format)"
            )
        setattr(settings, field, value)
    
    settings.updated_at = datetime.utcnow()
    db.add(settings)
    db.commit()
    db.refresh(settings)
    
    return settings


@router.put("/preferences", response_model=UserSettingsResponse)
def update_preferences(
    preferences: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update language and timezone preferences"""
    settings = get_or_create_settings(current_user.id, db)
    
    valid_languages = ["en", "es", "fr", "de", "it", "pt", "ja", "zh", "ko"]
    valid_timezones = ["UTC", "EST", "CST", "MST", "PST", "GMT", "IST", "JST", "AEST"]
    
    if "language" in preferences:
        if preferences["language"] not in valid_languages:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid language. Must be one of: {', '.join(valid_languages)}"
            )
        settings.language = preferences["language"]
    
    if "timezone" in preferences:
        if preferences["timezone"] not in valid_timezones:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid timezone. Must be one of: {', '.join(valid_timezones)}"
            )
        settings.timezone = preferences["timezone"]
    
    settings.updated_at = datetime.utcnow()
    db.add(settings)
    db.commit()
    db.refresh(settings)
    
    return settings


# ============ ACCOUNT ENDPOINTS ============

@router.get("/account-info", response_model=dict)
def get_account_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get account information"""
    settings = get_or_create_settings(current_user.id, db)
    return {
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "created_at": current_user.created_at,
        "is_active": current_user.is_active,
        "last_login": settings.last_login,
        "last_password_change": settings.last_password_change
    }


@router.post("/logout-all-devices", status_code=status.HTTP_200_OK)
def logout_all_devices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Logout from all devices (placeholder - implement with token blacklist)"""
    settings = get_or_create_settings(current_user.id, db)
    settings.last_login = datetime.utcnow()
    settings.updated_at = datetime.utcnow()
    db.add(settings)
    db.commit()
    
    return {"message": "Logged out from all devices", "status": "success"}


@router.post("/export-data", status_code=status.HTTP_200_OK)
def export_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate export of user data (placeholder)"""
    return {
        "message": "Data export initiated. Check your email for download link.",
        "status": "processing"
    }


@router.delete("/account", status_code=status.HTTP_200_OK)
def delete_account(
    delete_request: DeleteAccountRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user account with password verification"""
    # Verify password
    if not verify_password(delete_request.password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Account deletion cancelled."
        )
    
    # Require explicit confirmation
    if not delete_request.confirmation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please confirm account deletion"
        )
    
    try:
        # Delete user and all related data (cascaded)
        db.delete(current_user)
        db.commit()
        
        return {"message": "Account deleted successfully", "status": "success"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete account: {str(e)}"
        )
