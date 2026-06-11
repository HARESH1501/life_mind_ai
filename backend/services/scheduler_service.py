"""
Scheduler Service Layer
Manages background tasks and scheduled reminders using APScheduler
"""

import logging
from datetime import datetime, timedelta
from typing import Optional, Callable
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.date import DateTrigger
from pytz import timezone
from config import SCHEDULER_TIMEZONE, SCHEDULER_ENABLED
from database import SessionLocal
from models import Reminder, Meeting, User, UserSettings
from services.email_service import email_service

logger = logging.getLogger(__name__)


class SchedulerService:
    """Background scheduler for reminders and notifications"""
    
    def __init__(self):
        self.scheduler = BackgroundScheduler(timezone=SCHEDULER_TIMEZONE)
        self.enabled = SCHEDULER_ENABLED
        self.running = False
    
    def start(self):
        """Start the scheduler"""
        if not self.enabled:
            logger.info("Scheduler is disabled in configuration")
            return
        
        if self.running:
            logger.warning("Scheduler is already running")
            return
        
        try:
            self.scheduler.start()
            self.running = True
            logger.info(f"Scheduler started (timezone: {SCHEDULER_TIMEZONE})")
            
            # Schedule periodic tasks
            self._schedule_periodic_tasks()
            
        except Exception as e:
            logger.error(f"Failed to start scheduler: {str(e)}")
    
    def stop(self):
        """Stop the scheduler"""
        if not self.running:
            return
        
        try:
            self.scheduler.shutdown()
            self.running = False
            logger.info("Scheduler stopped")
        except Exception as e:
            logger.error(f"Error stopping scheduler: {str(e)}")
    
    def _schedule_periodic_tasks(self):
        """Schedule periodic background tasks"""
        try:
            # Check reminders every minute
            self.scheduler.add_job(
                self._check_and_send_reminders,
                CronTrigger(minute="*"),
                id="check_reminders",
                name="Check and send reminders",
                replace_existing=True
            )
            logger.info("Scheduled reminder check job")
            
            # Send daily summary at 9 PM
            self.scheduler.add_job(
                self._send_daily_summaries,
                CronTrigger(hour=21, minute=0),
                id="daily_summary",
                name="Send daily summaries",
                replace_existing=True
            )
            logger.info("Scheduled daily summary job")
            
        except Exception as e:
            logger.error(f"Error scheduling periodic tasks: {str(e)}")
    
    def _check_and_send_reminders(self):
        """Check for due reminders and send notifications"""
        try:
            db = SessionLocal()
            now = datetime.utcnow()
            
            # Find reminders that are due (within 5 minutes)
            due_reminders = db.query(Reminder).filter(
                Reminder.sent == False,
                Reminder.scheduled_time <= now + timedelta(minutes=5),
                Reminder.scheduled_time > now - timedelta(minutes=1)
            ).all()
            
            for reminder in due_reminders:
                try:
                    user = db.query(User).filter(User.id == reminder.user_id).first()
                    if not user:
                        continue
                    
                    # Check user settings
                    settings = db.query(UserSettings).filter(
                        UserSettings.user_id == user.id
                    ).first()
                    
                    if not settings or not settings.email_notifications:
                        continue
                    
                    # Send email based on reminder type
                    if reminder.reminder_type == "habit":
                        email_service.send_habit_reminder(user.email, reminder.title)
                    elif reminder.reminder_type == "task":
                        email_service.send_task_reminder(
                            user.email,
                            reminder.title,
                            reminder.scheduled_time.strftime("%Y-%m-%d %H:%M")
                        )
                    elif reminder.reminder_type == "meeting":
                        email_service.send_meeting_reminder(
                            user.email,
                            reminder.title,
                            reminder.scheduled_time.strftime("%Y-%m-%d %H:%M")
                        )
                    else:
                        # Generic reminder
                        email_service.send_email(
                            user.email,
                            f"Reminder: {reminder.title}",
                            f"<p>{reminder.description or reminder.title}</p>",
                            reminder.description or reminder.title
                        )
                    
                    # Mark as sent
                    reminder.sent = True
                    reminder.sent_at = now
                    db.add(reminder)
                    db.commit()
                    logger.info(f"Sent reminder {reminder.id} to {user.email}")
                    
                except Exception as e:
                    logger.error(f"Error sending reminder {reminder.id}: {str(e)}")
                    db.rollback()
            
            db.close()
            
        except Exception as e:
            logger.error(f"Error in reminder check: {str(e)}")
    
    def _send_daily_summaries(self):
        """Send daily productivity summaries to all users"""
        try:
            db = SessionLocal()
            
            # Get all active users with daily summary enabled
            users = db.query(User).filter(User.is_active == True).all()
            
            for user in users:
                try:
                    settings = db.query(UserSettings).filter(
                        UserSettings.user_id == user.id
                    ).first()
                    
                    if not settings or not settings.daily_summary or not settings.email_notifications:
                        continue
                    
                    # Get today's stats
                    today = datetime.utcnow().date()
                    
                    # Count completed habits
                    habits_completed = db.query(Habit).filter(
                        Habit.user_id == user.id,
                        Habit.updated_at >= datetime.combine(today, datetime.min.time())
                    ).count()
                    
                    # Count completed tasks
                    tasks_completed = db.query(Task).filter(
                        Task.user_id == user.id,
                        Task.status == "completed",
                        Task.updated_at >= datetime.combine(today, datetime.min.time())
                    ).count()
                    
                    # Count mood entries
                    mood_entries = db.query(MoodEntry).filter(
                        MoodEntry.user_id == user.id,
                        MoodEntry.date >= datetime.combine(today, datetime.min.time())
                    ).count()
                    
                    # Sum expenses
                    from sqlalchemy import func
                    expenses_result = db.query(func.sum(Expense.amount)).filter(
                        Expense.user_id == user.id,
                        Expense.date >= datetime.combine(today, datetime.min.time())
                    ).scalar()
                    expenses_total = float(expenses_result) if expenses_result else 0.0
                    
                    # Send summary
                    email_service.send_daily_summary(
                        user.email,
                        habits_completed,
                        tasks_completed,
                        mood_entries,
                        expenses_total
                    )
                    logger.info(f"Sent daily summary to {user.email}")
                    
                except Exception as e:
                    logger.error(f"Error sending summary to user {user.id}: {str(e)}")
            
            db.close()
            
        except Exception as e:
            logger.error(f"Error in daily summary task: {str(e)}")
    
    def schedule_reminder(
        self,
        reminder_id: int,
        scheduled_time: datetime,
        callback: Optional[Callable] = None
    ):
        """Schedule a specific reminder"""
        try:
            job_id = f"reminder_{reminder_id}"
            
            self.scheduler.add_job(
                callback or self._check_and_send_reminders,
                DateTrigger(run_date=scheduled_time),
                id=job_id,
                name=f"Reminder {reminder_id}",
                replace_existing=True
            )
            logger.info(f"Scheduled reminder {reminder_id} for {scheduled_time}")
            
        except Exception as e:
            logger.error(f"Error scheduling reminder {reminder_id}: {str(e)}")
    
    def schedule_meeting_reminder(
        self,
        meeting_id: int,
        meeting_time: datetime,
        reminder_minutes_before: int = 15
    ):
        """Schedule a meeting reminder"""
        try:
            reminder_time = meeting_time - timedelta(minutes=reminder_minutes_before)
            job_id = f"meeting_{meeting_id}"
            
            self.scheduler.add_job(
                self._send_meeting_reminder,
                DateTrigger(run_date=reminder_time),
                args=[meeting_id],
                id=job_id,
                name=f"Meeting reminder {meeting_id}",
                replace_existing=True
            )
            logger.info(f"Scheduled meeting reminder {meeting_id} for {reminder_time}")
            
        except Exception as e:
            logger.error(f"Error scheduling meeting reminder {meeting_id}: {str(e)}")
    
    def _send_meeting_reminder(self, meeting_id: int):
        """Send meeting reminder"""
        try:
            db = SessionLocal()
            meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
            
            if not meeting:
                return
            
            user = db.query(User).filter(User.id == meeting.user_id).first()
            if not user:
                return
            
            settings = db.query(UserSettings).filter(
                UserSettings.user_id == user.id
            ).first()
            
            if not settings or not settings.meeting_reminders or not settings.email_notifications:
                return
            
            email_service.send_meeting_reminder(
                user.email,
                meeting.title,
                meeting.start_time.strftime("%Y-%m-%d %H:%M"),
                meeting.location
            )
            
            meeting.reminder_sent = True
            db.add(meeting)
            db.commit()
            logger.info(f"Sent meeting reminder for meeting {meeting_id}")
            
            db.close()
            
        except Exception as e:
            logger.error(f"Error sending meeting reminder {meeting_id}: {str(e)}")
    
    def remove_job(self, job_id: str):
        """Remove a scheduled job"""
        try:
            self.scheduler.remove_job(job_id)
            logger.info(f"Removed job {job_id}")
        except Exception as e:
            logger.error(f"Error removing job {job_id}: {str(e)}")
    
    def get_jobs(self):
        """Get all scheduled jobs"""
        return self.scheduler.get_jobs()


# Global scheduler instance
scheduler_service = SchedulerService()


# Import models here to avoid circular imports
from models import Habit, Task, MoodEntry, Expense
