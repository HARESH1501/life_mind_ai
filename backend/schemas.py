"""
Pydantic schemas for LifeMind AI
Request/response validation models for all API endpoints
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ============ AUTH SCHEMAS ============

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ============ EXPENSE SCHEMAS ============

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    description: Optional[str] = None


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    user_id: int
    title: str
    amount: float
    category: str
    description: Optional[str] = None
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class ExpenseListResponse(BaseModel):
    total: int
    items: List[ExpenseResponse]
    skip: int
    limit: int


# ============ HABIT SCHEMAS ============

class HabitCreate(BaseModel):
    name: str
    frequency: str  # daily, weekly, monthly
    description: Optional[str] = None


class HabitUpdate(BaseModel):
    name: Optional[str] = None
    frequency: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class HabitResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = None
    frequency: str
    status: str
    streak: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============ TASK SCHEMAS ============

class TaskCreate(BaseModel):
    title: str
    priority: Optional[str] = "medium"
    description: Optional[str] = None
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None


class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    priority: str
    status: str
    due_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ============ MOOD SCHEMAS ============

class MoodEntryCreate(BaseModel):
    mood: str
    energy_level: int
    stress_level: int
    notes: Optional[str] = None


class MoodEntryResponse(BaseModel):
    id: int
    user_id: int
    mood: str
    energy_level: int
    stress_level: int
    notes: Optional[str] = None
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# ============ SETTINGS SCHEMAS ============

class UserSettingsResponse(BaseModel):
    id: int
    user_id: int
    
    # Profile
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    
    # Appearance
    theme: str = "system"
    accent_color: str = "blue"
    font_size: str = "medium"
    ui_density: str = "comfortable"
    
    # Notifications
    notifications_enabled: bool
    email_notifications: bool
    browser_notifications: bool
    in_app_notifications: bool
    push_notifications: bool
    sound_notifications: bool
    
    # Reminders
    habit_reminders: bool
    task_reminders: bool
    meeting_reminders: bool
    reminder_time: str
    
    # Email preferences
    email_habit_reminders: bool
    email_task_reminders: bool
    email_meeting_reminders: bool
    welcome_email: bool
    daily_summary: bool
    daily_summary_time: str
    daily_summary_email: bool
    
    # Meeting alerts
    meeting_alert_before: int
    
    # AI Coach
    ai_coach_enabled: bool
    daily_ai_insights: bool
    expense_analysis: bool
    productivity_suggestions: bool
    wellness_recommendations: bool
    
    # Preferences
    language: str = "en"
    timezone: str = "UTC"
    
    # Security
    two_factor_enabled: bool
    session_timeout: int
    last_login: Optional[datetime] = None
    last_password_change: Optional[datetime] = None
    
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserSettingsUpdate(BaseModel):
    # Profile
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    
    # Appearance
    theme: Optional[str] = None
    accent_color: Optional[str] = None
    font_size: Optional[str] = None
    ui_density: Optional[str] = None
    
    # Notifications
    notifications_enabled: Optional[bool] = None
    email_notifications: Optional[bool] = None
    browser_notifications: Optional[bool] = None
    in_app_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    sound_notifications: Optional[bool] = None
    
    # Reminders
    habit_reminders: Optional[bool] = None
    task_reminders: Optional[bool] = None
    meeting_reminders: Optional[bool] = None
    reminder_time: Optional[str] = None
    
    # Email preferences
    email_habit_reminders: Optional[bool] = None
    email_task_reminders: Optional[bool] = None
    email_meeting_reminders: Optional[bool] = None
    welcome_email: Optional[bool] = None
    daily_summary: Optional[bool] = None
    daily_summary_time: Optional[str] = None
    daily_summary_email: Optional[bool] = None
    
    # Meeting alerts
    meeting_alert_before: Optional[int] = None
    
    # AI Coach
    ai_coach_enabled: Optional[bool] = None
    daily_ai_insights: Optional[bool] = None
    expense_analysis: Optional[bool] = None
    productivity_suggestions: Optional[bool] = None
    wellness_recommendations: Optional[bool] = None
    
    # Preferences
    language: Optional[str] = None
    timezone: Optional[str] = None
    
    # Security
    two_factor_enabled: Optional[bool] = None
    session_timeout: Optional[int] = None


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None


class AppearanceUpdate(BaseModel):
    theme: str
    accent_color: str


class NotificationPreferencesUpdate(BaseModel):
    notifications_enabled: Optional[bool] = None
    email_notifications: Optional[bool] = None
    browser_notifications: Optional[bool] = None
    in_app_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    habit_reminders: Optional[bool] = None
    task_reminders: Optional[bool] = None
    meeting_reminders: Optional[bool] = None
    reminder_time: Optional[str] = None


class EmailPreferencesUpdate(BaseModel):
    email_habit_reminders: Optional[bool] = None
    email_task_reminders: Optional[bool] = None
    email_meeting_reminders: Optional[bool] = None
    daily_summary: Optional[bool] = None
    daily_summary_time: Optional[str] = None
    daily_summary_email: Optional[bool] = None
    welcome_email: Optional[bool] = None


class SecurityUpdate(BaseModel):
    two_factor_enabled: Optional[bool] = None
    session_timeout: Optional[int] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str


class DeleteAccountRequest(BaseModel):
    password: str
    confirmation: bool = False


# ============ NOTIFICATION SCHEMAS ============

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    read: bool
    data: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ReminderCreate(BaseModel):
    title: str
    description: Optional[str] = None
    reminder_type: str
    scheduled_time: datetime


class ReminderResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    reminder_type: str
    scheduled_time: datetime
    sent: bool
    created_at: datetime

    class Config:
        from_attributes = True


class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    attendees: Optional[str] = None  # JSON-encoded list


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    attendees: Optional[str] = None


class MeetingResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    attendees: Optional[str] = None
    reminder_sent: bool
    created_at: datetime

    class Config:
        from_attributes = True
