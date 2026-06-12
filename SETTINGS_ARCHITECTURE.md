# Settings Feature - Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                  (React + Vite + Zustand)                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/REST
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                              │
│                    (FastAPI + SQLAlchemy)                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ ORM
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE                                 │
│                    (SQLite / PostgreSQL)                         │
│                                                                  │
│  Tables: users, user_settings                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Structure

```
SettingsPage.jsx (Main Component)
├── State Management
│   ├── formState (local form data)
│   ├── loading (page load state)
│   ├── saving (save operation state)
│   ├── toast (notification state)
│   ├── passwordForm (password change form)
│   ├── deletePassword (delete account form)
│   └── hasChanges (unsaved changes flag)
│
├── Effects
│   └── useEffect → loadSettings() on mount
│
├── Handlers
│   ├── handleInputChange() - Update form field
│   ├── handleToggle() - Toggle boolean field
│   ├── handleSaveProfile() - Save profile data
│   ├── handleSaveSettings() - Save general settings
│   ├── handleChangePassword() - Change password
│   ├── handleLogoutAllDevices() - Logout all sessions
│   ├── handleSendTestEmail() - Send test email
│   ├── handleExportData() - Export user data
│   └── handleDeleteAccount() - Delete account
│
├── UI Sections
│   ├── Profile Section
│   ├── Appearance Section
│   ├── Notifications Section
│   ├── Email Section
│   ├── Reminders Section
│   ├── AI Coach Section
│   ├── Security Section
│   └── Data Management Section
│
└── Helper Components
    ├── SectionHeader
    ├── Toggle
    └── PasswordField
```

## Data Flow Diagram

### 1. Page Load Flow

```
User opens Settings Page
        │
        ▼
Component mounts
        │
        ▼
useEffect triggers
        │
        ▼
loadSettings() called
        │
        ├─────────────────┐
        │                 │
        ▼                 ▼
API: GET /settings/profile   API: GET /settings
        │                 │
        ▼                 ▼
Profile Data          Settings Data
        │                 │
        └─────────┬───────┘
                  │
                  ▼
        setFormState() updates UI
                  │
                  ▼
        User sees populated form
```

### 2. Profile Update Flow

```
User edits profile fields
        │
        ▼
handleInputChange() called
        │
        ▼
formState updated
        │
        ▼
hasChanges = true
        │
        ▼
"Unsaved changes" indicator shows
        │
        ▼
User clicks "Save Changes"
        │
        ▼
handleSaveProfile() called
        │
        ▼
API: PUT /settings/profile
  {
    full_name: "...",
    bio: "..."
  }
        │
        ▼
Backend validates & saves
        │
        ├─── Success ────┐
        │                │
        ▼                ▼
  User.full_name    UserSettings.bio
     updated           updated
        │                │
        └────────┬───────┘
                 │
                 ▼
        200 OK response
                 │
                 ▼
        Success toast shown
                 │
                 ▼
        hasChanges = false
                 │
                 ▼
        loadSettings() refreshes data
```

### 3. Settings Update Flow

```
User toggles/changes settings
        │
        ▼
handleToggle() or handleInputChange()
        │
        ▼
formState updated
        │
        ▼
hasChanges = true
        │
        ▼
User clicks "Save Changes"
        │
        ▼
handleSaveSettings() called
        │
        ▼
API: PUT /settings
  {
    theme: "dark",
    accent_color: "purple",
    notifications_enabled: true,
    email_notifications: true,
    ...all settings fields...
  }
        │
        ▼
Backend validates each field
        │
        ▼
UserSettings record updated
        │
        ▼
200 OK response
        │
        ▼
Success toast shown
        │
        ▼
Zustand store updated
        │
        ▼
UI reflects new settings
```

### 4. Password Change Flow

```
User fills password fields
        │
        ├── Current Password
        ├── New Password
        └── Confirm Password
        │
        ▼
User clicks "Change Password"
        │
        ▼
handleChangePassword() validates
        │
        ├─── Check all fields filled
        ├─── Check passwords match
        └─── Check password strength
        │
        ▼
API: POST /settings/change-password
  {
    current_password: "...",
    new_password: "...",
    confirm_password: "..."
  }
        │
        ▼
Backend validation
        │
        ├── Verify current password
        ├── Check password strength
        ├── Ensure not reusing password
        └── Verify confirmation match
        │
        ▼
Hash new password
        │
        ▼
Update User.hashed_password
        │
        ▼
Update UserSettings.last_password_change
        │
        ▼
200 OK response
        │
        ▼
Success toast shown
        │
        ▼
Password fields cleared
```

### 5. Delete Account Flow

```
User clicks "Delete" in Danger Zone
        │
        ▼
Delete confirmation modal opens
        │
        ▼
User enters password
        │
        ▼
User clicks "Delete My Account"
        │
        ▼
handleDeleteAccount() called
        │
        ▼
API: DELETE /settings/account
  {
    password: "...",
    confirmation: true
  }
        │
        ▼
Backend verifies password
        │
        ├─── Password correct? ────┐
        │                          │
        NO                        YES
        │                          │
        ▼                          ▼
    401 Error              Delete User record
        │                          │
        ▼                          ▼
   Error toast           Cascade delete:
        │                - UserSettings
        │                - Tasks
        │                - Habits
        │                - Expenses
        │                - Mood Entries
        │                - Notifications
        │                          │
        │                          ▼
        │                   200 OK response
        │                          │
        │                          ▼
        │                   Success toast
        │                          │
        │                          ▼
        │                   Wait 2 seconds
        │                          │
        │                          ▼
        │                   logout() called
        │                          │
        │                          ▼
        └──────────────────► Redirect to login
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### UserSettings Table
```sql
CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    
    -- Profile
    bio TEXT,
    profile_picture_url VARCHAR(500),
    
    -- Appearance
    theme VARCHAR(20) DEFAULT 'system',
    accent_color VARCHAR(20) DEFAULT 'blue',
    font_size VARCHAR(20) DEFAULT 'medium',
    ui_density VARCHAR(20) DEFAULT 'comfortable',
    
    -- Notifications
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    browser_notifications BOOLEAN DEFAULT TRUE,
    in_app_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    sound_notifications BOOLEAN DEFAULT TRUE,
    
    -- Reminders
    habit_reminders BOOLEAN DEFAULT TRUE,
    task_reminders BOOLEAN DEFAULT TRUE,
    meeting_reminders BOOLEAN DEFAULT TRUE,
    reminder_time VARCHAR(5) DEFAULT '09:00',
    
    -- Email Preferences
    email_habit_reminders BOOLEAN DEFAULT TRUE,
    email_task_reminders BOOLEAN DEFAULT TRUE,
    email_meeting_reminders BOOLEAN DEFAULT TRUE,
    welcome_email BOOLEAN DEFAULT TRUE,
    daily_summary BOOLEAN DEFAULT TRUE,
    daily_summary_time VARCHAR(5) DEFAULT '18:00',
    daily_summary_email BOOLEAN DEFAULT TRUE,
    
    -- Meeting Alerts
    meeting_alert_before INTEGER DEFAULT 15,
    
    -- AI Coach
    ai_coach_enabled BOOLEAN DEFAULT TRUE,
    daily_ai_insights BOOLEAN DEFAULT TRUE,
    expense_analysis BOOLEAN DEFAULT TRUE,
    productivity_suggestions BOOLEAN DEFAULT TRUE,
    wellness_recommendations BOOLEAN DEFAULT TRUE,
    
    -- Preferences
    language VARCHAR(5) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    session_timeout INTEGER DEFAULT 30,
    last_login DATETIME,
    last_password_change DATETIME,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints Summary

### Profile Endpoints
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/settings/profile` | Get user profile | - | UserResponse |
| PUT | `/settings/profile` | Update profile | ProfileUpdate | UserResponse |
| POST | `/settings/profile/upload-picture` | Upload picture | FormData | {message, url} |

### Settings Endpoints
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/settings` | Get all settings | - | UserSettingsResponse |
| PUT | `/settings` | Update settings | UserSettingsUpdate | UserSettingsResponse |
| PUT | `/settings/appearance` | Update appearance | AppearanceUpdate | UserSettingsResponse |
| PUT | `/settings/notifications` | Update notifications | NotificationPreferencesUpdate | UserSettingsResponse |
| PUT | `/settings/email-preferences` | Update email prefs | EmailPreferencesUpdate | UserSettingsResponse |
| PUT | `/settings/security` | Update security | SecurityUpdate | UserSettingsResponse |

### Action Endpoints
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/settings/change-password` | Change password | PasswordChange | {message, status} |
| POST | `/settings/test-email` | Send test email | - | {message, status} |
| POST | `/settings/logout-all-devices` | Logout all sessions | - | {message, status} |
| POST | `/settings/export-data` | Export user data | - | {message, status} |
| DELETE | `/settings/account` | Delete account | DeleteAccountRequest | {message, status} |

## State Management (Zustand)

### Settings Store
```javascript
{
  // Appearance
  theme: 'dark',
  accentColor: 'cyan',
  fontSize: 'medium',
  uiDensity: 'comfortable',
  
  // Actions
  setTheme: (theme) => { ... },
  setAccentColor: (color) => { ... },
  updateFromAPI: (data) => { ... }
}
```

### Auth Store
```javascript
{
  user: { id, email, username, full_name },
  token: 'jwt_token',
  
  // Actions
  login: (credentials) => { ... },
  logout: () => { ... },
  setUser: (user) => { ... }
}
```

## Security Considerations

### Frontend
1. **Password Visibility Toggles**: Allow users to verify typed passwords
2. **Validation**: Client-side validation before API calls
3. **Loading States**: Prevent duplicate submissions
4. **Secure Storage**: JWT token in localStorage with expiration

### Backend
1. **Password Hashing**: bcrypt with salt
2. **JWT Authentication**: All endpoints require valid token
3. **Input Validation**: Pydantic schemas validate all inputs
4. **SQL Injection Protection**: SQLAlchemy ORM
5. **CORS**: Configured for frontend origin only
6. **Rate Limiting**: Prevent brute force attacks (future)

## Error Handling

### Frontend
```javascript
try {
  await settingsService.updateProfile(data);
  showToast('Profile saved successfully', 'success');
} catch (error) {
  showToast(
    error.response?.data?.detail || 'Failed to save profile',
    'error'
  );
}
```

### Backend
```python
@router.put("/profile")
def update_profile(profile: ProfileUpdate, user: User = Depends(get_current_user)):
    try:
        # Validation
        if len(profile.bio) > 500:
            raise HTTPException(400, "Bio too long")
        
        # Update
        user.full_name = profile.full_name
        db.commit()
        
        return user
    except Exception as e:
        db.rollback()
        raise HTTPException(500, str(e))
```

## Performance Optimizations

1. **Parallel API Calls**: Profile and settings load simultaneously
2. **Debounced Inputs**: Prevent excessive API calls (future)
3. **Optimistic Updates**: Theme changes apply before save
4. **Lazy Loading**: Only load settings when page is visited
5. **Caching**: Settings cached in Zustand store

## Future Enhancements

1. **Real-time Sync**: WebSocket for multi-device sync
2. **Undo/Redo**: History of changes with undo capability
3. **Import Settings**: Import from JSON/backup
4. **Settings Profiles**: Save and switch between profiles
5. **Advanced Security**: 2FA, Security keys, Biometric
6. **Audit Log**: Track all settings changes
7. **Dark/Light Mode Schedule**: Auto-switch at specific times
8. **Custom Themes**: User-created color schemes

---

**Architecture Version**: 1.0  
**Last Updated**: June 12, 2026  
**Status**: Production Ready ✅
