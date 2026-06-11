# Email Notification System - Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Configure Gmail (Recommended)

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Copy the generated 16-character password

### Step 3: Update .env File

Edit `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM_EMAIL=noreply@lifemind.ai
SMTP_FROM_NAME=LifeMind AI
ENABLE_EMAIL_NOTIFICATIONS=true
SCHEDULER_ENABLED=true
```

### Step 4: Start Backend

```bash
cd backend
python -m uvicorn main:app --reload
```

You should see:
```
INFO:     Scheduler started (timezone: UTC)
```

### Step 5: Test Email

Register a new user at http://localhost:5173/register

You should receive a welcome email!

## Testing Reminders

### Create a Reminder

```bash
curl -X POST http://localhost:8000/api/v1/notifications/reminders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Reminder",
    "description": "This is a test",
    "reminder_type": "custom",
    "scheduled_time": "2024-05-25T14:30:00"
  }'
```

### Create a Meeting

```bash
curl -X POST http://localhost:8000/api/v1/notifications/meetings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Meeting",
    "description": "Weekly sync",
    "start_time": "2024-05-25T14:00:00",
    "end_time": "2024-05-25T15:00:00",
    "location": "Conference Room A"
  }'
```

## Development Mode

In development, emails are logged instead of sent:

```
[DEV MODE] Email would be sent to user@example.com: Welcome to LifeMind AI!
```

To actually send emails, set `DEBUG=false` in `.env`.

## Troubleshooting

### "SMTP authentication failed"

- Check `SMTP_USER` and `SMTP_PASSWORD` are correct
- For Gmail, use app-specific password (not your regular password)
- Ensure 2FA is enabled on Gmail account

### "Scheduler not running"

- Check `SCHEDULER_ENABLED=true` in `.env`
- Check application logs for errors
- Restart the backend server

### "Emails not sending"

- Check `ENABLE_EMAIL_NOTIFICATIONS=true` in `.env`
- Check user settings have email notifications enabled
- Check `DEBUG=false` to actually send (not just log)

## What's Included

✅ Email service with retry logic
✅ APScheduler background tasks
✅ Reminder scheduling
✅ Meeting reminders (15 min before)
✅ Daily productivity summaries
✅ Welcome emails on registration
✅ User preference enforcement
✅ Error handling and logging
✅ Development mode support
✅ Production-ready configuration

## Next Steps

1. Configure your email provider
2. Test email sending
3. Create reminders and meetings
4. Monitor scheduler in logs
5. Deploy to production

## Email Features

- **Welcome Email** - Sent on registration
- **Habit Reminders** - When habit is due
- **Task Reminders** - When task deadline approaches
- **Meeting Reminders** - 15 minutes before meeting
- **Daily Summary** - At 9 PM with productivity stats

## Production Deployment

For production:

1. Set `ENVIRONMENT=production`
2. Set `DEBUG=false`
3. Use production email credentials
4. Enable all notification features
5. Monitor scheduler and email delivery
6. Set up error alerting

## Support

Check `EMAIL_NOTIFICATION_SYSTEM.md` for detailed documentation.
