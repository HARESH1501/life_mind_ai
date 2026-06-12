# LifeMind AI - Complete Setup Guide

## 🎯 Project Status

### ✅ Completed Components

#### Backend Architecture
- ✅ Enterprise folder structure
- ✅ Configuration management (config.py)
- ✅ Database models (User, Expense, Habit, Task, MoodEntry)
- ✅ Pydantic schemas for validation
- ✅ CRUD operations layer
- ✅ JWT authentication system
- ✅ Modular API routers
- ✅ CORS middleware
- ✅ Error handling

#### API Endpoints
- ✅ Authentication (Register, Login, Get User)
- ✅ Expense Management (CRUD, Stats, Monthly)
- ✅ Habit Tracking (CRUD, Logging, Streaks)
- ✅ Task Management (CRUD, Filtering)
- ✅ Mood Tracking (CRUD, Statistics)

#### Frontend Architecture
- ✅ React 19 with Vite
- ✅ Zustand state management
- ✅ API client configuration
- ✅ Authentication store
- ✅ Expense store
- ✅ Protected routes
- ✅ Responsive UI components
- ✅ Modern styling with CSS

#### Frontend Pages
- ✅ Login Page
- ✅ Register Page
- ✅ Dashboard
- ✅ Expenses Management
- ✅ Habits Tracking
- ✅ Tasks Management
- ✅ Mood & Wellness

#### UI Components
- ✅ Sidebar Navigation
- ✅ Navbar with User Profile
- ✅ Dashboard Cards
- ✅ Forms with Validation
- ✅ Animations (Framer Motion)
- ✅ Responsive Design

## 🚀 Complete One-Click Setup (Highly Recommended)

The project now supports fully automated setup and deployment via Docker. This is the fastest way to get everything running with a production-grade database (PostgreSQL).

### Prerequisites
- [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop) installed and running.

### Instructions

1.  **Initialize the Environment:**
    Open PowerShell in the project root and run:
    ```powershell
    ./setup.ps1
    ```
    *This creates your `.env` files with secure, random secrets and installs local dependencies.*

2.  **Deploy the Full Stack:**
    Run:
    ```powershell
    ./deploy.ps1
    ```
    *This builds the Backend/Frontend images and starts PostgreSQL, Redis, and all services.*

3.  **Verify Access:**
    - **Frontend:** http://localhost
    - **API Docs:** http://localhost:8000/docs

---

## 🛠️ Manual Installation (For Local Development)

If you prefer to run services individually without Docker:

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Verify installation
python -c "import fastapi; print('✅ FastAPI installed')"
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Verify installation
npm list react react-dom zustand framer-motion
```

### Step 3: Run Backend

```bash
# From backend directory
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Verify Backend:**
- Open: http://localhost:8000/
- Expected: `{"status": "healthy", "message": "LifeMind AI v1.0.0 Running!", "api_version": "v1"}`
- API Docs: http://localhost:8000/docs

### Step 4: Run Frontend

```bash
# From frontend directory
npm run dev
```

**Expected Output:**
```
  VITE v8.0.12  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Verify Frontend:**
- Open: http://localhost:5173/
- You should see the login page

## 🧪 Testing the Application

### Test 1: User Registration

1. Go to http://localhost:5173/register
2. Fill in the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Username: johndoe
   - Password: password123
3. Click "Sign Up"
4. Expected: Redirect to login page

### Test 2: User Login

1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: john@example.com
   - Password: password123
3. Click "Login"
4. Expected: Redirect to dashboard

### Test 3: Add Expense

1. Click "Expenses" in sidebar
2. Click "Add Expense" button
3. Fill in:
   - Title: Lunch
   - Amount: 250
   - Category: food
   - Description: Lunch at restaurant
4. Click "Add Expense"
5. Expected: Expense appears in list

### Test 4: View Dashboard

1. Click "Dashboard" in sidebar
2. Expected: See expense statistics
   - Total Spent
   - Average Expense
   - Highest Expense
   - Total Expenses
   - Category Breakdown

### Test 5: Create Habit

1. Click "Habits" in sidebar
2. Click "New Habit" button
3. Fill in:
   - Habit Name: Morning Exercise
   - Frequency: daily
   - Description: 30 minutes of exercise
4. Click "Create Habit"
5. Expected: Habit card appears

### Test 6: Create Task

1. Click "Tasks" in sidebar
2. Click "New Task" button
3. Fill in:
   - Task Title: Complete project
   - Priority: high
   - Description: Finish LifeMind AI
4. Click "Create Task"
5. Expected: Task appears in list

### Test 7: Log Mood

1. Click "Wellness" in sidebar
2. Click "Log Mood" button
3. Select mood: Happy
4. Set Energy Level: 8
5. Set Stress Level: 3
6. Add notes: Great day!
7. Click "Log Entry"
8. Expected: Mood entry appears

## 📊 API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Expense (with token)
```bash
curl -X POST http://localhost:8000/api/v1/expenses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lunch",
    "amount": 250,
    "category": "food",
    "description": "Lunch at restaurant"
  }'
```

### Get Expenses
```bash
curl -X GET http://localhost:8000/api/v1/expenses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Expense Stats
```bash
curl -X GET http://localhost:8000/api/v1/expenses/stats/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔍 Verification Checklist

### Backend Verification
- [ ] Backend starts without errors
- [ ] Health check endpoint works
- [ ] API documentation loads at /docs
- [ ] Database file created (lifemind.db)
- [ ] All routers imported successfully

### Frontend Verification
- [ ] Frontend starts without errors
- [ ] Login page loads
- [ ] Can navigate between pages
- [ ] Sidebar navigation works
- [ ] Navbar displays correctly

### Integration Verification
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can create expenses
- [ ] Can view dashboard stats
- [ ] Can create habits
- [ ] Can create tasks
- [ ] Can log mood entries
- [ ] Can logout

## 🐛 Common Issues & Solutions

### Issue: Backend port 8000 already in use
**Solution:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

### Issue: Frontend can't connect to backend
**Solution:**
1. Check backend is running on port 8000
2. Verify VITE_API_URL in frontend/.env
3. Check CORS settings in backend/config.py

### Issue: Database errors
**Solution:**
```bash
# Delete and recreate database
rm backend/lifemind.db
python -c "from backend.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### Issue: Module not found errors
**Solution:**
```bash
# Backend
pip install -r backend/requirements.txt

# Frontend
npm install
```

## 📈 Next Steps

### Phase 2: Authentication Enhancement
- [ ] Email verification
- [ ] Password reset
- [ ] Two-factor authentication
- [ ] Social login (Google, GitHub)

### Phase 3: AI Integration
- [ ] Gemini API integration
- [ ] AI recommendations
- [ ] Smart expense categorization
- [ ] Productivity insights

### Phase 4: Advanced Features
- [ ] Voice assistant
- [ ] OCR for bill scanning
- [ ] Real-time notifications
- [ ] Mobile app

### Phase 5: Production Deployment (COMPLETED ✅)
- [x] Docker containerization
- [x] PostgreSQL migration
- [x] Automated setup scripts
- [ ] CI/CD pipeline
- [ ] Cloud deployment (Vercel, Render)

## 📚 Documentation

- **API Documentation**: http://localhost:8000/docs
- **Backend Code**: See `backend/` directory
- **Frontend Code**: See `frontend/src/` directory
- **Database Schema**: See `backend/models.py`

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

## 💡 Tips & Best Practices

1. **Always use environment variables** for sensitive data
2. **Test API endpoints** using Swagger UI at /docs
3. **Keep frontend and backend** running in separate terminals
4. **Use browser DevTools** to debug frontend issues
5. **Check backend logs** for API errors
6. **Use Postman** for advanced API testing

## 🎉 Success!

If you've completed all steps and verified the checklist, congratulations! You have a fully functional LifeMind AI application running locally.

---

**Need Help?**
- Check the README.md for more information
- Review the code comments for implementation details
- Check the API documentation at http://localhost:8000/docs
