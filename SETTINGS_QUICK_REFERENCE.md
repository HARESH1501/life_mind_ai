# Settings Module - Quick Reference Guide

## 🚀 Quick Start

### Start Backend
```bash
cd backend
python main.py
# API available at http://localhost:8000/api/v1
```

### Start Frontend
```bash
cd frontend
npm run dev
# App available at http://localhost:5173
```

### Navigate to Settings
```
http://localhost:5173/settings
```

---

## 📡 API Quick Reference

### Authentication
All endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### Profile
```
GET    /settings/profile                    # Get profile
PUT    /settings/profile                    # Update profile
POST   /settings/profile/upload-picture     # Upload picture
```

### Appearance
```
GET    /settings/appearance                 # Get theme/color
PUT    /settings/appearance                 # Update theme/color
```

### Notifications
```
GET    /settings/notifications              # Get notifications
PUT    /settings/notifications              # Update notifications
```

### Email
```
GET    /settings/email-preferences          # Get email prefs
PUT    /settings/email-preferences          # Update email prefs
POST   /settings/test-email                 # Send test email
```

### Security
```
GET    /settings/security                   # Get security
PUT    /settings/security                   # Update security
POST   /settings/change-password            # Change password
```

### Account
```
GET    /settings/account-info               # Get account info
POST   /settings/logout-all-devices         # Logout devices
POST   /settings/export-data                # Export data
DELETE /settings/account                    # Delete account
```

### General
```
GET    /settings                            # Get all settings
PUT    /settings                            # Update settings
PUT    /settings/preferences                # Update language/timezone
```

---

## 🔧 Common Operations

### Change Theme
```bash
curl -X PUT http://localhost:8000/api/v1/settings/appearance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "accent_color": "purple"
  }'
```

### Update Notifications
```bash
curl -X PUT http://localhost:8000/api/v1/settings/notifications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notifications_enabled": true,
    "email_notifications": true,
    "reminder_time": "09:00"
  }'
```

### Change Password
```bash
curl -X POST http://localhost:8000/api/v1/settings/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "OldPass123",
    "new_password": "NewPass123",
    "confirm_password": "NewPass123"
  }'
```

### Send Test Email
```bash
curl -X POST http://localhost:8000/api/v1/settings/test-email \
  -H "Authorization: Bearer $TOKEN"
```

### Delete Account
```bash
curl -X DELETE http://localhost:8000/api/v1/settings/account \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "UserPassword123",
    "confirmation": true
  }'
```

---

## 💻 Frontend Components

### Using SettingsService
```javascript
import settingsService from '../services/settingsService';

// Get all settings
const settings = await settingsService.getSettings();

// Update profile
await settingsService.updateProfile({
  full_name: "John Doe",
  bio: "I'm awesome"
});

// Upload picture
const response = await settingsService.uploadProfilePicture(file);

// Change appearance
await settingsService.updateAppearance({
  theme: "dark",
  accent_color: "blue"
});

// Update notifications
await settingsService.updateNotifications({
  notifications_enabled: true,
  reminder_time: "09:00"
});

// Update email preferences
await settingsService.updateEmailPreferences({
  email_habit_reminders: true,
  daily_summary: true
});

// Change password
await settingsService.changePassword({
  current_password: "old",
  new_password: "new",
  confirm_password: "new"
});

// Test email
await settingsService.testEmail();

// Export data
await settingsService.exportData();

// Delete account
await settingsService.deleteAccount({
  password: "password",
  confirmation: true
});
```

---

## 🎨 Theme & Accent Colors

### Available Themes
- `light` - Light mode
- `dark` - Dark mode
- `system` - Follow system preference

### Available Accent Colors
- `blue` (#3B82F6)
- `purple` (#A855F7)
- `green` (#10B981)
- `red` (#EF4444)
- `pink` (#EC4899)
- `orange` (#F97316)
- `amber` (#FBBF24)
- `cyan` (#06B6D4)

### Example
```javascript
// Update to dark theme with purple accent
await settingsService.updateAppearance({
  theme: "dark",
  accent_color: "purple"
});
```

---

## 📋 Notification Types

### Channels
- `email_notifications` - Email
- `browser_notifications` - Browser
- `in_app_notifications` - In-app
- `push_notifications` - Push

### Reminders
- `habit_reminders` - Habits
- `task_reminders` - Tasks
- `meeting_reminders` - Meetings

### Email
- `email_habit_reminders` - Habit emails
- `email_task_reminders` - Task emails
- `email_meeting_reminders` - Meeting emails
- `daily_summary` - Daily summary
- `daily_summary_time` - Time to send (HH:MM)

---

## 🔐 Security

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number

### Session Timeout
- Range: 5-1440 minutes
- Default: 30 minutes

### Two-Factor Authentication
- Toggle: `two_factor_enabled`
- Boolean value

---

## 📁 File Locations

### Backend
```
backend/
├── models.py                    # UserSettings model
├── schemas.py                   # Validation schemas
└── routers/settings.py          # API endpoints
```

### Frontend
```
frontend/src/
├── components/SettingsComponents/
│   ├── ProfileTab.jsx
│   ├── AppearanceTab.jsx
│   ├── NotificationsTab.jsx
│   ├── EmailPreferencesTab.jsx
│   ├── SecurityTab.jsx
│   └── AccountTab.jsx
├── services/settingsService.js
├── pages/SettingsPage.jsx
└── styles/SettingsPage.css
```

---

## 🐛 Debugging

### Enable Verbose Logging
```bash
# Backend
export LOG_LEVEL=DEBUG
python main.py

# Frontend - Open DevTools Console
# Check Network tab for API requests
```

### Check Settings in Database
```python
from models import UserSettings
from database import SessionLocal

db = SessionLocal()
user_settings = db.query(UserSettings).filter(UserSettings.user_id == 1).first()
print(user_settings.__dict__)
```

### Check API Response
```bash
# Get current settings
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/settings | jq
```

---

## ✅ Testing Checklist

### Profile Tab
- [ ] Update full name
- [ ] Update bio
- [ ] Upload profile picture
- [ ] Verify changes persist on refresh

### Appearance Tab
- [ ] Change to light theme
- [ ] Change to dark theme
- [ ] Change to system theme
- [ ] Try each accent color
- [ ] Verify theme persists on refresh

### Notifications Tab
- [ ] Toggle master notifications
- [ ] Toggle each channel
- [ ] Toggle each reminder type
- [ ] Change reminder time
- [ ] Verify all settings save

### Email Preferences Tab
- [ ] Toggle email notifications
- [ ] Toggle daily summary
- [ ] Change summary time
- [ ] Send test email
- [ ] Check email inbox

### Security Tab
- [ ] Change password with weak password (should fail)
- [ ] Change password with valid password
- [ ] Try to logout all devices
- [ ] Toggle 2FA (if implemented)
- [ ] Verify last password change updated

### Account Tab
- [ ] View account info
- [ ] Click export data
- [ ] Try delete account (cancel)
- [ ] Try delete with wrong password (should fail)
- [ ] Delete account with confirmation

---

## 📊 Database Schema

### UserSettings Table
```sql
CREATE TABLE user_settings (
  id INTEGER PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,
  bio VARCHAR,
  profile_picture_url VARCHAR,
  theme VARCHAR DEFAULT 'system',
  accent_color VARCHAR DEFAULT 'blue',
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  browser_notifications BOOLEAN DEFAULT true,
  in_app_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  habit_reminders BOOLEAN DEFAULT true,
  task_reminders BOOLEAN DEFAULT true,
  meeting_reminders BOOLEAN DEFAULT true,
  reminder_time VARCHAR DEFAULT '09:00',
  email_habit_reminders BOOLEAN DEFAULT true,
  email_task_reminders BOOLEAN DEFAULT true,
  email_meeting_reminders BOOLEAN DEFAULT true,
  daily_summary BOOLEAN DEFAULT true,
  daily_summary_time VARCHAR DEFAULT '08:00',
  language VARCHAR DEFAULT 'en',
  timezone VARCHAR DEFAULT 'UTC',
  two_factor_enabled BOOLEAN DEFAULT false,
  session_timeout INTEGER DEFAULT 30,
  last_login TIMESTAMP,
  last_password_change TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🚨 Common Issues & Solutions

### Settings not saving
**Problem:** Changes disappear on refresh
**Solution:** 
- Check network tab for 401/403 errors
- Verify JWT token is valid
- Check backend logs
- Verify database connection

### Profile picture not uploading
**Problem:** Upload fails or shows error
**Solution:**
- Check file size (max 5MB)
- Check file format (JPG, PNG, GIF, WebP)
- Verify `static/uploads/profiles` directory exists
- Check file permissions

### Email not sending
**Problem:** Test email fails
**Solution:**
- Verify SMTP credentials in `.env`
- Check email service is enabled
- Verify sender email is correct
- Check backend logs for SMTP errors

### Theme not applying
**Problem:** Theme change doesn't apply
**Solution:**
- Clear browser cache
- Check CSS is loaded
- Verify theme CSS variables exist
- Check localStorage for conflicts

### Password change fails
**Problem:** Password change rejected
**Solution:**
- Check current password is correct
- Verify new password meets requirements
- Ensure passwords match
- Check minimum length (8 chars)

---

## 📚 Additional Resources

### Documentation
- See `SETTINGS_MODULE_COMPLETE.md` for full documentation
- See `SETTINGS_IMPLEMENTATION_SUMMARY.txt` for overview
- See individual component files for code comments

### Related Endpoints
- Authentication: `/auth/login`, `/auth/register`
- User Profile: `/users/me`
- Habits: `/habits`
- Tasks: `/tasks`
- Notifications: `/notifications`

---

## 🎯 Next Features (Future)

- Advanced 2FA (SMS, Authenticator)
- Session management UI
- Settings history/changelog
- Device management
- API key management
- Scheduled tasks
- Backup scheduling
- Preference sharing
- Advanced email scheduling

---

**Last Updated:** January 2026  
**For Full Docs:** See `SETTINGS_MODULE_COMPLETE.md`
