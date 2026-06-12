# ⚡ LifeMind AI - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

---

## 📦 Installation

### 1. Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Run backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

✅ Backend ready at: http://localhost:8000

---

### 2. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
```

**Expected Output:**
```
  VITE v8.0.12  ready in 123 ms
  ➜  Local:   http://localhost:5173/
```

✅ Frontend ready at: http://localhost:5173

---

## 🧪 Test the Application

### Step 1: Register User
1. Open http://localhost:5173/register
2. Fill in:
   - Full Name: John Doe
   - Email: john@example.com
   - Username: johndoe
   - Password: password123
3. Click "Sign Up"

### Step 2: Login
1. Go to http://localhost:5173/login
2. Enter:
   - Email: john@example.com
   - Password: password123
3. Click "Login"

### Step 3: Add Expense
1. Click "Expenses" in sidebar
2. Click "Add Expense"
3. Fill in:
   - Title: Lunch
   - Amount: 250
   - Category: food
4. Click "Add Expense"

### Step 4: View Dashboard
1. Click "Dashboard"
2. See your expense statistics

### Step 5: Create Habit
1. Click "Habits"
2. Click "New Habit"
3. Fill in:
   - Habit Name: Morning Exercise
   - Frequency: daily
4. Click "Create Habit"

### Step 6: Create Task
1. Click "Tasks"
2. Click "New Task"
3. Fill in:
   - Task Title: Complete project
   - Priority: high
4. Click "Create Task"

### Step 7: Log Mood
1. Click "Wellness"
2. Click "Log Mood"
3. Select mood: Happy
4. Set Energy: 8
5. Set Stress: 3
6. Click "Log Entry"

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main application |
| Backend | http://localhost:8000 | API server |
| API Docs | http://localhost:8000/docs | Swagger UI |
| ReDoc | http://localhost:8000/redoc | Alternative docs |

---

## 📝 API Quick Reference

### Register
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

### Create Expense
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

### Get Stats
```bash
curl -X GET http://localhost:8000/api/v1/expenses/stats/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
# Windows
netstat -ano | findstr :8000

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Can't connect to backend
1. Verify backend is running on port 8000
2. Check VITE_API_URL in frontend/.env
3. Verify CORS settings in backend/config.py

### Database errors
```bash
# Reset database
rm backend/lifemind.db
python -c "from backend.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

---

## 📚 Documentation

- **Full Guide:** README.md
- **Setup Instructions:** SETUP_GUIDE.md
- **Verification Report:** VERIFICATION_REPORT.md
- **Project Summary:** PROJECT_SUMMARY.md

---

## 🎯 Features Overview

### Dashboard
- View expense statistics
- See category breakdown
- Quick access to all features

### Expenses
- Add, edit, delete expenses
- Categorize spending
- View monthly reports
- Analyze spending patterns

### Habits
- Create daily habits
- Track completion
- Maintain streaks
- Monitor progress

### Tasks
- Create tasks with priorities
- Track status
- Set deadlines
- Organize work

### Wellness
- Log daily mood
- Track energy levels
- Monitor stress
- View patterns

---

## 🔐 Test Credentials

```
Email: john@example.com
Password: password123
```

---

## 💡 Tips

1. **Use Swagger UI** for API testing: http://localhost:8000/docs
2. **Check browser console** for frontend errors
3. **Check terminal logs** for backend errors
4. **Use browser DevTools** to inspect network requests
5. **Keep both terminals open** while developing

---

## 🚀 Next Steps

1. ✅ Run the application
2. ✅ Test all features
3. ✅ Explore the code
4. ✅ Read the documentation
5. ✅ Deploy to cloud (optional)

---

## 📞 Need Help?

- Check README.md for detailed information
- Review SETUP_GUIDE.md for installation help
- Check API docs at http://localhost:8000/docs
- Review code comments for implementation details

---

**Happy coding! 🎉**

LifeMind AI is ready to use. Start building your life optimization platform!
