"""
Notifications API routes
Handles notifications, reminders, and meetings
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime
from models import User, Notification, Reminder, Meeting
from schemas import NotificationResponse, ReminderResponse, MeetingResponse, ReminderCreate, MeetingCreate, MeetingUpdate
from auth import get_current_user, get_db
from services.email_service import email_service
from services.scheduler_service import scheduler_service
import crud

router = APIRouter(prefix="/notifications", tags=["notifications"])


# ============ NOTIFICATION ENDPOINTS ============

@router.get("", response_model=list[NotificationResponse])
def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all notifications for current user"""
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()
    
    return notifications


@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark notification as read"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    notification.read = True
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    return notification


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a notification"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    db.delete(notification)
    db.commit()
    
    return None


# ============ REMINDER ENDPOINTS ============

@router.post("/reminders", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
def create_reminder(
    reminder: ReminderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new reminder"""
    db_reminder = Reminder(
        user_id=current_user.id,
        title=reminder.title,
        description=reminder.description,
        reminder_type=reminder.reminder_type,
        scheduled_time=reminder.scheduled_time
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    
    # Schedule the reminder
    scheduler_service.schedule_reminder(db_reminder.id, reminder.scheduled_time)
    
    return db_reminder


@router.get("/reminders", response_model=list[ReminderResponse])
def get_reminders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all reminders for current user"""
    reminders = db.query(Reminder).filter(
        Reminder.user_id == current_user.id
    ).order_by(Reminder.scheduled_time).all()
    
    return reminders


@router.delete("/reminders/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(
    reminder_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a reminder"""
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == current_user.id
    ).first()
    
    if not reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found"
        )
    
    # Remove from scheduler
    scheduler_service.remove_job(f"reminder_{reminder_id}")
    
    db.delete(reminder)
    db.commit()
    
    return None


# ============ MEETING ENDPOINTS ============

@router.post("/meetings", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
def create_meeting(
    meeting: MeetingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new meeting"""
    db_meeting = Meeting(
        user_id=current_user.id,
        title=meeting.title,
        description=meeting.description,
        start_time=meeting.start_time,
        end_time=meeting.end_time,
        location=meeting.location,
        attendees=meeting.attendees
    )
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    
    # Schedule meeting reminder (15 minutes before)
    scheduler_service.schedule_meeting_reminder(db_meeting.id, meeting.start_time, reminder_minutes_before=15)
    
    return db_meeting


@router.get("/meetings", response_model=list[MeetingResponse])
def get_meetings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all meetings for current user"""
    meetings = db.query(Meeting).filter(
        Meeting.user_id == current_user.id
    ).order_by(Meeting.start_time).all()
    
    return meetings


@router.get("/meetings/{meeting_id}", response_model=MeetingResponse)
def get_meeting(
    meeting_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific meeting"""
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.user_id == current_user.id
    ).first()
    
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting not found"
        )
    
    return meeting


@router.put("/meetings/{meeting_id}", response_model=MeetingResponse)
def update_meeting(
    meeting_id: int,
    meeting_update: MeetingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a meeting"""
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.user_id == current_user.id
    ).first()
    
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting not found"
        )
    
    update_data = meeting_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(meeting, field, value)
    
    meeting.updated_at = datetime.utcnow()
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    
    # Reschedule reminder if start_time changed
    if "start_time" in update_data:
        scheduler_service.remove_job(f"meeting_{meeting_id}")
        scheduler_service.schedule_meeting_reminder(meeting_id, meeting.start_time, reminder_minutes_before=15)
    
    return meeting


@router.delete("/meetings/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(
    meeting_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a meeting"""
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.user_id == current_user.id
    ).first()
    
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting not found"
        )
    
    # Remove from scheduler
    scheduler_service.remove_job(f"meeting_{meeting_id}")
    
    db.delete(meeting)
    db.commit()
    
    return None
