# Developer Quick Start Guide - LifeMind AI SaaS

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ (production) or SQLite (development)
- Git

### Development Setup

```bash
# Clone repository
git clone <repo-url>
cd LifeMind-AI

# Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=sqlite:///./lifemind.db
SECRET_KEY=dev-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:5173
DEBUG=true
EOF

# Start backend
python -m uvicorn main:app --reload

# Frontend Setup (in new terminal)
cd frontend
npm install
npm run dev
```

### Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Test Login
- Email: `test@example.com`
- Password: `test123`

---

## 📁 Project Structure

```
LifeMind-AI/
├── backend/
│   ├── routers/
│   │   ├── auth.py          # Authentication
│   │   ├── expenses.py      # Expenses
│   │   ├── habits.py        # Habits
│   │   ├── tasks.py         # Tasks
│   │   ├── mood.py          # Mood
│   │   ├── settings.py      # Settings (NEW)
│   │   └── notifications.py # Notifications (NEW)
│   ├── models.py            # Database models
│   ├── schemas/__init__.py  # Pydantic schemas
│   ├── crud.py              # Database operations
│   ├── auth.py              # JWT & password
│   ├── config.py            # Configuration
│   ├── database.py          # Database setup
│   ├── main.py              # FastAPI app
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ExpensesPage.jsx
│   │   │   ├── HabitsPage.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   ├── MoodPage.jsx
│   │   │   └── SettingsPage.jsx (NEW)
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── NotificationCenter.jsx (NEW)
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── expenseStore.js
│   │   │   ├── habitStore.js
│   │   │   ├── taskStore.js
│   │   │   ├── moodStore.js
│   │   │   ├── settingsStore.js (NEW)
│   │   │   └── notificationStore.js (NEW)
│   │   ├── styles/
│   │   ├── config/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
│
└── Documentation/
    ├── PRODUCTION_DEPLOYMENT_GUIDE.md
    ├── FEATURES_DOCUMENTATION.md
    ├── SAAS_UPGRADE_COMPLETE.md
    └── DEVELOPER_QUICK_START.md (this file)
```

---

## 🔧 Common Development Tasks

### Add New API Endpoint

1. **Create Schema** (`backend/schemas/__init__.py`):
```python
class MyResourceCreate(BaseModel):
    name: str
    description: Optional[str] = None

class MyResourceResponse(MyResourceCreate):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
```

2. **Create Model** (`backend/models.py`):
```python
class MyResource(Base):
    __tablename__ = "my_resources"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="my_resources")
```

3. **Add CRUD** (`backend/crud.py`):
```python
def create_my_resource(db: Session, resource: MyResourceCreate, user_id: int):
    db_resource = MyResource(
        user_id=user_id,
        name=resource.name,
        description=resource.description
    )
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource
```

4. **Create Router** (`backend/routers/my_resource.py`):
```python
from fastapi import APIRouter, Depends
from models import User
from schemas import MyResourceCreate, MyResourceResponse
from auth import get_current_user, get_db
import crud

router = APIRouter(prefix="/my-resources", tags=["my-resources"])

@router.post("", response_model=MyResourceResponse, status_code=201)
def create_resource(
    resource: MyResourceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_my_resource(db, resource, current_user.id)
```

5. **Register Router** (`backend/main.py`):
```python
from routers import my_resource
app.include_router(my_resource.router, prefix=API_V1_PREFIX)
```

### Add New Frontend Page

1. **Create Store** (`frontend/src/store/myStore.js`):
```javascript
import { create } from 'zustand';
import apiClient from '../config/api';

export const useMyStore = create((set) => ({
  items: [],
  isLoading: false,
  error: null,
  
  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/my-resources');
      set({ items: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
```

2. **Create Page** (`frontend/src/pages/MyPage.jsx`):
```javascript
import { useEffect } from 'react';
import { useMyStore } from '../store/myStore';

export default function MyPage() {
  const { items, fetchItems, isLoading } = useMyStore();
  
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  return (
    <div>
      {isLoading ? <p>Loading...</p> : (
        <ul>
          {items.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

3. **Add Route** (`frontend/src/App.jsx`):
```javascript
import MyPage from './pages/MyPage';

<Route path="/my-page" element={<MyPage />} />
```

---

## 🎨 Styling Guide

### CSS Variables
```css
/* Light Mode */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --primary-color: #3b82f6;
}

/* Dark Mode */
[data-theme='dark'] {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #f3f4f6;
  --text-secondary: #d1d5db;
  --border-color: #374151;
  --primary-color: #60a5fa;
}
```

### Component Template
```css
.my-component {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.my-component:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
}

/* Dark Mode Specific */
[data-theme='dark'] .my-component {
  /* Override if needed */
}
```

---

## 🔐 Authentication

### JWT Token Flow
```
1. User logs in with email/password
2. Backend validates credentials
3. Backend generates JWT token
4. Frontend stores token in localStorage
5. Frontend includes token in Authorization header
6. Backend validates token on each request
7. Token expires after 30 minutes (configurable)
```

### Using Protected Endpoints
```javascript
// Token automatically added by axios interceptor
const response = await apiClient.get('/api/v1/expenses');

// Manual token usage
const token = localStorage.getItem('access_token');
const headers = { Authorization: `Bearer ${token}` };
```

---

## 📊 Database Queries

### Common Patterns

```python
# Get user's data
user_data = db.query(Expense).filter(
    Expense.user_id == user_id
).all()

# Paginated query
items = db.query(Expense).filter(
    Expense.user_id == user_id
).offset(skip).limit(limit).all()

# Count
total = db.query(Expense).filter(
    Expense.user_id == user_id
).count()

# Order by
items = db.query(Expense).filter(
    Expense.user_id == user_id
).order_by(Expense.date.desc()).all()

# Filter by multiple conditions
items = db.query(Expense).filter(
    Expense.user_id == user_id,
    Expense.category == 'food',
    Expense.amount > 10
).all()
```

---

## 🧪 Testing

### Backend Testing
```bash
# Install pytest
pip install pytest pytest-asyncio

# Run tests
pytest

# Run specific test
pytest tests/test_expenses.py::test_create_expense

# With coverage
pytest --cov=.
```

### Frontend Testing
```bash
# Install vitest
npm install -D vitest

# Run tests
npm run test

# Watch mode
npm run test:watch
```

---

## 🐛 Debugging

### Backend Debugging
```python
# Add logging
import logging
logger = logging.getLogger(__name__)
logger.info(f"Creating expense: {expense_data}")

# Print statements
print(f"DEBUG: {variable}")

# Use debugger
import pdb; pdb.set_trace()
```

### Frontend Debugging
```javascript
// Console logging
console.log('Creating expense:', expenseData);
console.error('Error:', error);

// Browser DevTools
// F12 → Console, Network, Application tabs

// React DevTools
// Install React DevTools browser extension
```

---

## 📦 Dependencies

### Backend
```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-jose==3.3.0
passlib==1.7.4
argon2-cffi==23.1.0
psycopg2-binary==2.9.9
```

### Frontend
```
react==18.2.0
react-router-dom==6.20.0
zustand==4.4.0
axios==1.6.0
framer-motion==10.16.0
lucide-react==0.292.0
```

---

## 🚀 Deployment

### Development
```bash
# Backend
python -m uvicorn main:app --reload

# Frontend
npm run dev
```

### Production
```bash
# Backend
gunicorn --workers 4 --worker-class uvicorn.workers.UvicornWorker main:app

# Frontend
npm run build
# Serve dist/ folder with Nginx
```

See `PRODUCTION_DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 📚 Documentation

- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc
- **Features**: See `FEATURES_DOCUMENTATION.md`
- **Deployment**: See `PRODUCTION_DEPLOYMENT_GUIDE.md`

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.10+

# Check dependencies
pip list

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check database
sqlite3 lifemind.db ".tables"
```

### Frontend won't start
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+

# Check port
lsof -i :5173
```

### API errors
```bash
# Check backend logs
tail -f /var/log/lifemind/app.log

# Test endpoint
curl http://localhost:8000/health

# Check database connection
python -c "from database import SessionLocal; db = SessionLocal(); print('OK')"
```

---

## 📞 Support

- **Issues**: Check GitHub issues
- **Documentation**: See docs/ folder
- **API Docs**: http://localhost:8000/docs
- **Community**: Join Discord/Slack

---

## 🎯 Next Steps

1. ✅ Set up development environment
2. ✅ Run application locally
3. ✅ Test all features
4. ✅ Read feature documentation
5. ✅ Make your first contribution
6. ✅ Deploy to production

---

**Happy Coding! 🚀**

Last Updated: May 23, 2026  
Version: 2.0.0 (SaaS Edition)
