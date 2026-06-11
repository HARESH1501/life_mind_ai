"""
Authentication API routes
Handles user registration and login
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from models import User, UserSettings
from schemas import UserCreate, UserResponse, TokenResponse, LoginRequest
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, get_db, ACCESS_TOKEN_EXPIRE_MINUTES
)
from services.email_service import email_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create default settings for user
    default_settings = UserSettings(
        user_id=db_user.id,
        theme="light",
        dark_mode=False,
        email_notifications=True,
        in_app_notifications=True,
        habit_reminders=True,
        task_reminders=True,
        meeting_reminders=True,
        daily_summary=True,
        language="en",
        timezone="UTC"
    )
    db.add(default_settings)
    db.commit()
    
    # Send welcome email
    try:
        email_service.send_welcome_email(
            db_user.email,
            db_user.username
        )
    except Exception as e:
        # Log error but don't fail registration
        print(f"Error sending welcome email: {str(e)}")
    
    return db_user


@router.post("/login", response_model=TokenResponse)
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):
    """Login user and return access token"""
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=access_token_expires
    )
    
    token_response = TokenResponse(
        access_token=access_token,
        token_type='bearer',
        user=UserResponse.from_orm(user)
    )

    # Send login notification email (non-blocking)
    try:
        login_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        email_service.send_login_alert(user.email, user.username, login_time)
    except Exception as e:
        print(f"Login alert email failed (non-critical): {str(e)}")

    return token_response


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information"""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_user(
    user_update: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user information"""
    if "full_name" in user_update:
        current_user.full_name = user_update["full_name"]
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    return current_user
