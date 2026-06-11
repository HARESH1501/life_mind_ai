# Email Notification System - Complete Implementation Guide

## Overview

The LifeMind AI platform now includes a production-grade email notification system with background task scheduling. This system automatically sends emails for:

- **Welcome emails** - When users register
- **Habit reminders** - When it's time to complete a habit
- **Task reminders** - When tasks are due
- **Meeting reminders** - 15 minutes before meetings
- **Daily summaries** - Productivity summary at 9 PM daily

## Architecture

### Components

1. **Email Service** (`backend/services/email_service.py`)
   - Handles all email sending operations
   - Implements retry logic for failed emails
   - Supports multiple email templates
   - Graceful error handling

2. **Scheduler Service** (`backend/services/scheduler_service.py`)
   - APScheduler-based background task manager
   - Manages reminder scheduling
   - Handles periodic tasks (daily summaries)
   - Automatic job management

3. **Configuration** (`backend/config.py`)
   - SMTP settings
   - Email feature toggles
   - Scheduler configuration

4. **Database Models** (`backend/models/__init__.py`)
   - `Notification` - In-app notifications
   - `Reminder` - Scheduled reminders
   - `Meeting` - Meeting scheduling
   - `UserSettings` - User preferences

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Required packages:
- `fastapi-mail` - Email sending
- `apscheduler` - Background task scheduling
- `pytz` - Timezone support
- `argon2-cffi` - Password hashing

### 2. Configure Email Settings

Edit `backend/.env`:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@lifemind.ai
SMTP_FROM_NAME=LifeMind AI

# Email Features
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_HABIT_REMINDERS=true
ENABLE_TASK_REMINDERS=true
ENABLE_MEETING_REMINDERS=true
ENABLE_DAILY_SUMMARY=true

# Scheduler
SCHEDULER_ENABLED=true
SCHEDULER_TIMEZONE=UTC
```

### 3. Gmail Setup (Recommended)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated password
3. Use this password in `SMTP_PASSWORD`

### 4. Alternative Email Providers

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key
```

**AWS SES:**
```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-username
SMTP_PASSWORD=your-ses-password
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
```

## API Endpoints

### Reminders

**Create Reminder**
```
POST /api/v1/notifications/reminders
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Team Meeting",
  "description": "Weekly sync with team",
  "reminder_type": "meeting",
  "scheduled_time": "2024-05-25T14:00:00"
}
```

**Get Reminders**
```
GET /api/v1/notifications/reminders
Authorization: Bearer {token}
```

**Delete Reminder**
```
DELETE /api/v1/notifications/reminders/{reminder_id}
Authorization: Bearer {token}
```

### Meetings

**Create Meeting**
```
POST /api/v1/notifications/meetings
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Client Presentation",
  "description": "Q2 Results Presentation",
  "start_time": "2024-05-25T14:00:00",
  "end_time": "2024-05-25T15:00:00",
  "location": "Conference Room A",
  "attendees": "john@example.com,jane@example.com"
}
```

**Get Meetings**
```
GET /api/v1/notifications/meetings
Authorization: Bearer {token}
```

**Update Meeting**
```
PUT /api/v1/notifications/meetings/{meeting_id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Updated Title",
  "start_time": "2024-05-25T15:00:00"
}
```

**Delete Meeting**
```
DELETE /api/v1/notifications/meetings/{meeting_id}
Authorization: Bearer {token}
```

### Notifications

**Get Notifications**
```
GET /api/v1/notifications?skip=0&limit=20
Authorization: Bearer {token}
```

**Mark as Read**
```
PUT /api/v1/notifications/{notification_id}/read
Authorization: Bearer {token}
```

**Delete Notification**
```
DELETE /api/v1/notifications/{notification_id}
Authorization: Bearer {token}
```

## Email Templates

### 1. Welcome Email
Sent when user registers. Includes:
- Welcome message
- Getting started guide
- Feature overview

### 2. Habit Reminder
Sent when habit reminder is due. Includes:
- Habit name
- Encouragement message
- Consistency reminder

### 3. Task Reminder
Sent when task is due. Includes:
- Task title
- Due date/time
- Priority indicator

### 4. Meeting Reminder
Sent 15 minutes before meeting. Includes:
- Meeting title
- Start time
- Location
- Attendees

### 5. Daily Summary
Sent at 9 PM daily. Includes:
- Habits completed
- Tasks completed
- Mood entries logged
- Total expenses

## How It Works

### Reminder Scheduling Flow

```
1. User creates reminder/meeting via API
   ↓
2. Reminder stored in database
   ↓
3. Scheduler adds job to APScheduler
   ↓
4. At scheduled time, scheduler triggers email send
   ↓
5. Email service sends email with retry logic
   ↓
6. Reminder marked as sent in database
```

### Daily Summary Flow

```
1. Scheduler runs at 9 PM daily
   ↓
2. Query all active users with daily summary enabled
   ↓
3. For each user:
   - Count habits completed today
   - Count tasks completed today
   - Count mood entries today
   - Sum expenses today
   ↓
4. Send summary email with statistics
```

### Background Task Lifecycle

```
Application Start
   ↓
Scheduler initialized and started
   ↓
Periodic tasks scheduled:
   - Check reminders every minute
   - Send daily summary at 9 PM
   ↓
Application Running
   ↓
Application Shutdown
   ↓
Scheduler gracefully stopped
```

## Development Mode

In development mode (`DEBUG=true`), emails are logged instead of sent:

```
[DEV MODE] Email would be sent to user@example.com: Welcome to LifeMind AI!
```

This allows testing without actual email sending.

## Production Deployment

### Environment Variables

```env
ENVIRONMENT=production
DEBUG=false
SCHEDULER_ENABLED=true
ENABLE_EMAIL_NOTIFICATIONS=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=production-email@gmail.com
SMTP_PASSWORD=production-app-password
```

### Monitoring

Monitor scheduler health:
```python
from services.scheduler_service import scheduler_service

# Check if scheduler is running
if scheduler_service.running:
    print("Scheduler is active")

# Get all scheduled jobs
jobs = scheduler_service.get_jobs()
for job in jobs:
    print(f"Job: {job.name}, Next run: {job.next_run_time}")
```

### Error Handling

The system includes:
- Automatic retry logic (3 attempts)
- Graceful error logging
- User notification preferences enforcement
- Database transaction management

## Testing

### Test Email Sending

```python
from services.email_service import email_service

# Send test email
success = email_service.send_email(
    to_email="test@example.com",
    subject="Test Email",
    html_content="<p>This is a test</p>",
    text_content="This is a test"
)

print(f"Email sent: {success}")
```

### Test Scheduler

```python
from services.scheduler_service import scheduler_service
from datetime import datetime, timedelta

# Start scheduler
scheduler_service.start()

# Schedule test reminder
future_time = datetime.utcnow() + timedelta(minutes=1)
scheduler_service.schedule_reminder(1, future_time)

# Check jobs
jobs = scheduler_service.get_jobs()
print(f"Scheduled jobs: {len(jobs)}")

# Stop scheduler
scheduler_service.stop()
```

## Troubleshooting

### Emails Not Sending

1. **Check SMTP Configuration**
   ```bash
   # Test SMTP connection
   python -c "
   import smtplib
   server = smtplib.SMTP('smtp.gmail.com', 587)
   server.starttls()
   server.login('your-email@gmail.com', 'your-app-password')
   print('SMTP connection successful')
   server.quit()
   "
   ```

2. **Check Email Settings**
   - Verify `SMTP_USER` and `SMTP_PASSWORD` in `.env`
   - Ensure `ENABLE_EMAIL_NOTIFICATIONS=true`
   - Check `DEBUG` mode (development logs instead of sending)

3. **Check Scheduler**
   - Verify `SCHEDULER_ENABLED=true`
   - Check application logs for scheduler startup messages
   - Ensure no exceptions in scheduler service

### Reminders Not Triggering

1. **Check Database**
   ```sql
   SELECT * FROM reminders WHERE user_id = 1;
   ```

2. **Check Scheduler Jobs**
   ```python
   from services.scheduler_service import scheduler_service
   jobs = scheduler_service.get_jobs()
   for job in jobs:
       print(f"{job.id}: {job.next_run_time}")
   ```

3. **Check User Settings**
   ```sql
   SELECT * FROM user_settings WHERE user_id = 1;
   ```

### High Email Volume

For production with many users:

1. **Use Email Queue**
   - Implement Celery for async email sending
   - Use Redis for job queue

2. **Rate Limiting**
   - Implement rate limiting in email service
   - Batch email sending

3. **Monitoring**
   - Track email delivery rates
   - Monitor scheduler performance
   - Log all email operations

## Security Considerations

1. **SMTP Credentials**
   - Store in environment variables only
   - Never commit `.env` to version control
   - Use app-specific passwords (Gmail)

2. **Email Content**
   - Sanitize user input in email templates
   - Validate email addresses
   - Implement rate limiting

3. **Database**
   - Encrypt sensitive data
   - Implement access controls
   - Regular backups

## Performance Optimization

1. **Batch Operations**
   - Send daily summaries in batches
   - Use database indexes on reminder queries

2. **Caching**
   - Cache user settings
   - Cache email templates

3. **Async Processing**
   - Use Celery for async email sending
   - Implement job queues

## Future Enhancements

1. **SMS Notifications**
   - Integrate Twilio for SMS
   - Add SMS reminder option

2. **Push Notifications**
   - Browser push notifications
   - Mobile app push notifications

3. **Advanced Scheduling**
   - Recurring reminders
   - Conditional reminders
   - Smart scheduling

4. **Email Analytics**
   - Track email opens
   - Track click-through rates
   - Delivery reports

## Support

For issues or questions:
1. Check logs: `backend/logs/`
2. Review configuration: `backend/.env`
3. Test SMTP connection
4. Check database for data integrity

## References

- [APScheduler Documentation](https://apscheduler.readthedocs.io/)
- [FastAPI-Mail Documentation](https://sabuhish.github.io/fastapi-mail/)
- [SMTP Protocol](https://tools.ietf.org/html/rfc5321)
- [Email Best Practices](https://www.mailgun.com/blog/email/email-best-practices/)
