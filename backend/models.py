"""
SQLAlchemy Models for LifeMind AI
Defines database schema for all entities
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base


class User(Base):
    """User model for authentication and profile management"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    expenses = relationship("Expense", back_populates="user", cascade="all, delete-orphan")
    habits = relationship("Habit", back_populates="user", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    mood_entries = relationship("MoodEntry", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", cascade="all, delete-orphan", uselist=False)
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    reminders = relationship("Reminder", back_populates="user", cascade="all, delete-orphan")
    meetings = relationship("Meeting", back_populates="user", cascade="all, delete-orphan")


class Expense(Base):
    """Expense model for tracking user spending"""
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    amount = Column(Float)
    category = Column(String, index=True)
    date = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="expenses")


class Habit(Base):
    """Habit model for tracking daily habits"""
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    frequency = Column(String)  # daily, weekly, monthly
    status = Column(String, default="active")
    streak = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="habits")
    logs = relationship("HabitLog", back_populates="habit", cascade="all, delete-orphan")


class HabitLog(Base):
    """Habit log model for tracking habit completion"""
    __tablename__ = "habit_logs"

    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), index=True)
    date = Column(DateTime, default=datetime.utcnow, index=True)
    completed = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    habit = relationship("Habit", back_populates="logs")


class Task(Base):
    """Task model for productivity management"""
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    priority = Column(String, default="medium")
    status = Column(String, default="todo")
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="tasks")


class MoodEntry(Base):
    """Mood entry model for wellness tracking"""
    __tablename__ = "mood_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    mood = Column(String)  # happy, sad, neutral, anxious, excited, etc.
    energy_level = Column(Integer)  # 1-10
    stress_level = Column(Integer)  # 1-10
    notes = Column(Text, nullable=True)
    date = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="mood_entries")


class UserSettings(Base):
    """User settings and preferences"""
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)
    
    # Profile settings
    bio = Column(String, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    
    # Appearance settings
    theme = Column(String, default="system")  # light, dark, system
    accent_color = Column(String, default="blue")  # blue, purple, green, red, etc.
    font_size = Column(String, default="medium")  # small, medium, large
    ui_density = Column(String, default="comfortable")  # compact, comfortable, spacious
    
    # Notification settings
    notifications_enabled = Column(Boolean, default=True)
    email_notifications = Column(Boolean, default=True)
    browser_notifications = Column(Boolean, default=True)
    in_app_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    sound_notifications = Column(Boolean, default=True)
    
    # Reminder settings
    habit_reminders = Column(Boolean, default=True)
    task_reminders = Column(Boolean, default=True)
    meeting_reminders = Column(Boolean, default=True)
    reminder_time = Column(String, default="09:00")  # Format: HH:MM
    
    # Email preferences
    email_habit_reminders = Column(Boolean, default=True)
    email_task_reminders = Column(Boolean, default=True)
    email_meeting_reminders = Column(Boolean, default=True)
    welcome_email = Column(Boolean, default=True)
    daily_summary = Column(Boolean, default=True)
    daily_summary_time = Column(String, default="08:00")  # Format: HH:MM
    daily_summary_email = Column(Boolean, default=True)
    
    # Meeting alerts
    meeting_alert_before = Column(Integer, default=15)  # minutes before meeting
    
    # AI Coach settings
    ai_coach_enabled = Column(Boolean, default=True)
    daily_ai_insights = Column(Boolean, default=True)
    expense_analysis = Column(Boolean, default=True)
    productivity_suggestions = Column(Boolean, default=True)
    wellness_recommendations = Column(Boolean, default=True)
    
    # Preferences
    language = Column(String, default="en")
    timezone = Column(String, default="UTC")
    
    # Security settings
    two_factor_enabled = Column(Boolean, default=False)
    session_timeout = Column(Integer, default=30)  # minutes
    
    # Account settings
    last_login = Column(DateTime, nullable=True)
    last_password_change = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="settings")


class Notification(Base):
    """Notification model for user notifications"""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String)
    message = Column(Text)
    type = Column(String)  # habit, task, meeting, reminder, summary
    read = Column(Boolean, default=False)
    data = Column(Text, nullable=True)  # JSON data
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="notifications")


class Reminder(Base):
    """Reminder model for scheduled reminders"""
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    reminder_type = Column(String)  # habit, task, meeting, custom
    scheduled_time = Column(DateTime, index=True)
    sent = Column(Boolean, default=False)
    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="reminders")


class Meeting(Base):
    """Meeting model for scheduling meetings"""
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime, index=True)
    end_time = Column(DateTime, nullable=True)
    location = Column(String, nullable=True)
    attendees = Column(Text, nullable=True)  # JSON list
    reminder_sent = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="meetings")
