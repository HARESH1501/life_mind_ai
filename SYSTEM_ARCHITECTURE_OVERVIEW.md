# LifeMind AI - Complete System Architecture Overview

## System Overview

LifeMind AI is a production-grade AI-powered personal life assistant platform built with:
- **Frontend:** React + Vite + Zustand
- **Backend:** FastAPI + SQLAlchemy + SQLite
- **Email:** FastAPI-Mail + SMTP
- **Scheduling:** APScheduler
- **Authentication:** JWT + Argon2

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Dashboard   │  │  Habits      │  │  Tasks       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Expenses    │  │  Mood        │  │  Settings    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Notification Center + Dark Mode                │           │
│  └──────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                            ↓ (Axios)
┌─────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND                              │
│  ┌──────────────────────────────────────────────────┐           │
│  │  API Routes (v1)                                │           │
│  │  ├─ /auth (register, login)                     │           │
│  │  ├─ /expenses (CRUD)                           │           │
│  │  ├─ /habits (CRUD)                             │           │
│  │  ├─ /tasks (CRUD)                              │           │
│  │  ├─ /mood (CRUD)                               │           │
│  │  ├─ /settings (preferences)                    │           │
│  │  └─ /notifications (reminders, meetings)       │           │
│  └──────────────────────────────────────────────────┘           │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Services Layer                                 │           │
│  │  ├─ Email Service (SMTP)                       │           │
│  │  └─ Scheduler Service (APScheduler)            │           │
│  └──────────────────────────────────────────────────┘           │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Authentication & Security                      │           │
│  │  ├─ JWT Token Management                       │           │
│  │  ├─ Argon2 Password Hashing                    │           │
│  │  └─ CORS Middleware                            │           │
│  └──────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                               │
│  ┌──────────────────────────────────────────────────┐           │
│  │  SQLAlchemy ORM                                 │           │
│  │  ├─ User                                        │           │
│  │  ├─ Expense                                     │           │
│  │  ├─ Habit + HabitLog                           │           │
│  │  ├─ Task                                        │           │
│  │  ├─ MoodEntry                                  │           │
│  │  ├─ UserSettings                               │           │
│  │  ├─ Notification                               │           │
│  │  ├─ Reminder                                   │           │
│  │  └─ Meeting                                    │           │
│  └──────────────────────────────────────────────────┘           │
│  ┌──────────────────────────────────────────────────┐           │
│  │  SQLite Database (lifemind.db)                  │           │
│  └──────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                  BACKGROUND SERVICES                            │
│  ┌──────────────────────────────────────────────────┐           │
│  │  APScheduler                                    │           │
│  │  ├─ Check Reminders (every minute)             │           │
│  │  ├─ Send Daily Summaries (9 PM)                │           │
│  │  └─ Meeting Reminders (15 min before)          │           │
│  └──────────────────────────────────────────────────┘           │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Email Service                                  │           │
│  │  ├─ SMTP Connection (Gmail/SendGrid/AWS/etc)   │           │
│  │  ├─ Email Templates                            │           │
│  │  ├─ Retry Logic (3 attempts)                   │           │
│  │  └─ Error Handling                             │           │
│  └──────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Components

#### Pages
- **LoginPage** - User authentication
- **RegisterPage** - New user registration
- **DashboardPage** - Main dashboard with overview
- **HabitsPage** - Habit tracking and management
- **TasksPage** - Task management
- **ExpensesPage** - Expense tracking
- **MoodPage** - Mood logging and tracking
- **SettingsPage** - User preferences and settings

#### Components
- **Navbar** - Navigation and user menu
- **Sidebar** - Navigation sidebar
- **NotificationCenter** - Notification display
- **ProtectedRoute** - Route protection with JWT
- **ErrorBoundary** - Error handling

#### State Management (Zustand)
- **authStore** - Authentication state
- **habitStore** - Habits state
- **taskStore** - Tasks state
- **expenseStore** - Expenses state
- **moodStore** - Mood entries state
- **settingsStore** - User settings state
- **notificationStore** - Notifications state

### Backend Routes

#### Authentication (`/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /me` - Update user profile

#### Expenses (`/expenses`)
- `POST` - Create expense
- `GET` - Get expenses
- `GET /{id}` - Get expense details
- `PUT /{id}` - Update expense
- `DELETE /{id}` - Delete expense

#### Habits (`/habits`)
- `POST` - Create habit
- `GET` - Get habits
- `GET /{id}` - Get habit details
- `PUT /{id}` - Update habit
- `DELETE /{id}` - Delete habit
- `POST /{id}/log` - Log habit completion

#### Tasks (`/tasks`)
- `POST` - Create task
- `GET` - Get tasks
- `GET /{id}` - Get task details
- `PUT /{id}` - Update task
- `DELETE /{id}` - Delete task

#### Mood (`/mood`)
- `POST` - Create mood entry
- `GET` - Get mood entries
- `GET /{id}` - Get mood entry details
- `DELETE /{id}` - Delete mood entry

#### Settings (`/settings`)
- `GET` - Get user settings
- `PUT` - Update settings
- `PUT /notifications` - Update notification preferences
- `PUT /preferences` - Update preferences
- `POST /change-password` - Change password

#### Notifications (`/notifications`)
- `GET` - Get notifications
- `PUT /{id}/read` - Mark as read
- `DELETE /{id}` - Delete notification
- `POST /reminders` - Create reminder
- `GET /reminders` - Get reminders
- `DELETE /reminders/{id}` - Delete reminder
- `POST /meetings` - Create meeting
- `GET /meetings` - Get meetings
- `GET /meetings/{id}` - Get meeting details
- `PUT /meetings/{id}` - Update meeting
- `DELETE /meetings/{id}` - Delete meeting

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR UNIQUE,
    username VARCHAR UNIQUE,
    hashed_password VARCHAR,
    full_name VARCHAR,
    is_active BOOLEAN,
    created_at DATETIME,
    updated_at DATETIME
);
```

#### Expenses Table
```sql
CREATE TABLE expenses (
    id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    title VARCHAR,
    description TEXT,
    amount FLOAT,
    category VARCHAR,
    date DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);
```

#### Habits Table
```sql
CREATE TABLE habits (
    id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    name VARCHAR,
    description TEXT,
    frequency VARCHAR,
    status VARCHAR,
    streak INTEGER,
    created_at DATETIME,
    updated_at DATETIME
);
```

#### Tasks Table
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    title VARCHAR,
    description TEXT,
    priority VARCHAR,
    status VARCHAR,
    due_date DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);
```

#### Mood Entries Table
```sql
CREATE TABLE mood_entries (
    id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    mood VARCHAR,
    energy_level INTEGER,
    stress_level INTEGER,
    notes TEXT,
    date DATETIME,
    created_at DATETIME
);
```

#### User Settings Table
```sql
CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY UNIQUE,
    theme VARCHAR,
    dark_mode BOOLEAN,
    email_notifications BOOLEAN,
    in_app_notifications BOOLEAN,
    habit_reminders BOOLEAN,
    task_reminders BOOLEAN,
    meeting_reminders BOOLEAN,
    daily_summary BOOLEAN,
    language VARCHAR,
    timezone VARCHAR,
    created_at DATETIME,
    updated_at DATETIME
);
```

#### Notifications Table
```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    title VARCHAR,
    message TEXT,
    type VARCHAR,
    read BOOLEAN,
    data TEXT,
    created_at DATETIME
);
```

#### Reminders Table
```sql
CREATE TABLE reminders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    title VARCHAR,
    description TEXT,
    reminder_type VARCHAR,
    scheduled_time DATETIME,
    sent BOOLEAN,
    sent_at DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);
```

#### Meetings Table
```sql
CREATE TABLE meetings (
    id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    title VARCHAR,
    description TEXT,
    start_time DATETIME,
    end_time DATETIME,
    location VARCHAR,
    attendees TEXT,
    reminder_sent BOOLEAN,
    created_at DATETIME,
    updated_at DATETIME
);
```

### Email Service Architecture

```
Email Request
    ↓
Email Service
    ├─ Validate Configuration
    ├─ Create MIME Message
    ├─ Connect to SMTP
    ├─ Send Email
    ├─ Handle Errors
    └─ Retry Logic (3 attempts)
    ↓
SMTP Server (Gmail/SendGrid/AWS/Mailgun)
    ↓
User Inbox
```

### Scheduler Architecture

```
Application Start
    ↓
Scheduler Initialize
    ├─ Create APScheduler instance
    ├─ Set timezone
    └─ Start background thread
    ↓
Schedule Periodic Tasks
    ├─ Check Reminders (every minute)
    ├─ Send Daily Summaries (9 PM)
    └─ Meeting Reminders (15 min before)
    ↓
Task Execution
    ├─ Query database
    ├─ Check conditions
    ├─ Send emails
    └─ Update database
    ↓
Application Shutdown
    ├─ Stop scheduler
    └─ Cleanup resources
```

## Data Flow Examples

### User Registration Flow

```
1. User fills registration form
2. Frontend validates input
3. POST /api/v1/auth/register
4. Backend validates data
5. Hash password with Argon2
6. Create user in database
7. Create default settings
8. Send welcome email
9. Return user data
10. Frontend redirects to login
```

### Create Reminder Flow

```
1. User creates reminder
2. POST /api/v1/notifications/reminders
3. Backend validates data
4. Store reminder in database
5. Scheduler adds job
6. Return reminder data
7. At scheduled time:
   - Scheduler triggers
   - Query reminder from database
   - Check user settings
   - Send email
   - Mark as sent
   - Log confirmation
```

### Daily Summary Flow

```
1. Scheduler runs at 9 PM
2. Query all active users
3. For each user:
   - Check if daily summary enabled
   - Count habits completed today
   - Count tasks completed today
   - Count mood entries today
   - Sum expenses today
   - Send summary email
4. Log completion
```

## Security Architecture

### Authentication Flow

```
1. User enters credentials
2. POST /api/v1/auth/login
3. Backend queries user
4. Verify password with Argon2
5. Create JWT token
6. Return token to frontend
7. Frontend stores token
8. Include token in API requests
9. Backend validates token
10. Extract user ID from token
```

### Authorization Flow

```
1. Request includes JWT token
2. Backend extracts token
3. Verify token signature
4. Check token expiration
5. Extract user ID
6. Verify user is active
7. Check resource ownership
8. Execute operation
9. Return result
```

## Performance Optimization

### Frontend Optimization
- Zustand for efficient state management
- React lazy loading for pages
- CSS modules for styling
- Vite for fast development

### Backend Optimization
- SQLAlchemy ORM with indexes
- Database connection pooling
- Async email sending
- Background task scheduling
- Request validation with Pydantic

### Database Optimization
- Indexes on frequently queried columns
- Foreign key relationships
- Cascade delete for data integrity
- Transaction management

## Deployment Architecture

### Development Environment
```
Frontend: http://localhost:5173
Backend: http://127.0.0.1:8000
Database: SQLite (lifemind.db)
Scheduler: Running in background
Email: Development mode (logs only)
```

### Production Environment
```
Frontend: Deployed to CDN/Static hosting
Backend: Deployed to cloud (AWS/GCP/Azure)
Database: PostgreSQL or managed database
Scheduler: Running in background
Email: Production SMTP (Gmail/SendGrid/AWS)
```

## Monitoring & Logging

### Application Logs
- Scheduler startup/shutdown
- Email sending status
- API request/response
- Database operations
- Error tracking

### Health Checks
- `/health` - Basic health check
- `/` - Detailed health check with scheduler status
- Database connectivity
- Email service status

### Metrics to Monitor
- API response times
- Email delivery rate
- Scheduler job execution
- Database query performance
- Error rates

## Future Enhancements

### Phase 2
- SMS notifications (Twilio)
- Push notifications (Firebase)
- Email analytics
- Recurring reminders
- Smart scheduling

### Phase 3
- AI-powered insights
- Predictive analytics
- Machine learning recommendations
- Advanced reporting
- Data export

### Phase 4
- Mobile app (React Native)
- Desktop app (Electron)
- API marketplace
- Third-party integrations
- Advanced automation

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Vite | UI framework |
| State Management | Zustand | State management |
| HTTP Client | Axios | API communication |
| Styling | CSS Modules | Component styling |
| Backend | FastAPI | Web framework |
| ORM | SQLAlchemy | Database abstraction |
| Database | SQLite | Data storage |
| Authentication | JWT + Argon2 | Security |
| Email | FastAPI-Mail + SMTP | Email sending |
| Scheduling | APScheduler | Background tasks |
| Timezone | Pytz | Timezone handling |
| Validation | Pydantic | Data validation |

## Conclusion

LifeMind AI is a comprehensive, production-ready personal life assistant platform with:

✅ Modern frontend with React and Zustand
✅ Robust backend with FastAPI and SQLAlchemy
✅ Secure authentication with JWT and Argon2
✅ Email notifications with retry logic
✅ Background task scheduling with APScheduler
✅ Comprehensive API with 40+ endpoints
✅ User preference management
✅ Dark mode support
✅ Responsive design
✅ Error handling and logging
✅ Production-ready architecture

**Status: COMPLETE AND PRODUCTION-READY ✅**
