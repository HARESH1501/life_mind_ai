# 🚀 LifeMind AI - AI-Powered Personal Life Assistant Platform

A world-class, production-grade SaaS platform that combines AI intelligence with personal life management. LifeMind AI helps users optimize their productivity, manage finances, build habits, and improve overall wellness.

## 🎯 Project Vision

LifeMind AI is an intelligent ecosystem combining:
- **AI Personal Assistant** - Smart recommendations and insights
- **Expense Tracker** - Financial management with AI analysis
- **Productivity Manager** - Task and time management
- **Habit Tracker** - Build and maintain daily habits
- **Smart Planner** - AI-powered scheduling
- **Mood & Wellness Analyzer** - Mental health tracking
- **Analytics Dashboard** - Comprehensive insights and reports

## 🏗️ Architecture Overview

### Frontend Stack
- **React 19** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Zustand** - State management
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### Backend Stack
- **FastAPI** - High-performance Python framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation
- **JWT** - Secure authentication
- **SQLite** (Development) / **PostgreSQL** (Production)

### AI & Analytics
- **Google Gemini API** - AI recommendations
- **OpenAI API** - Advanced NLP
- **Pandas** - Data analysis
- **Sentiment Analysis** - Mood tracking

## 📁 Project Structure

```
LifeMind-AI/
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Zustand stores
│   │   ├── config/            # Configuration files
│   │   ├── styles/            # CSS modules
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── .env                   # Environment variables
│   └── package.json           # Dependencies
│
├── backend/
│   ├── routers/               # API route handlers
│   ├── models.py              # Database models
│   ├── schemas.py             # Pydantic schemas
│   ├── crud.py                # Database operations
│   ├── auth.py                # Authentication logic
│   ├── config.py              # Configuration
│   ├── database.py            # Database setup
│   ├── main.py                # FastAPI app
│   ├── .env                   # Environment variables
│   └── requirements.txt       # Python dependencies
│
├── docker/                    # Docker configuration
├── docs/                      # Documentation
└── README.md                  # This file
```

### ⚡ One-Click Setup (Recommended)

If you are on Windows, you can set up and deploy the entire project (including Database and Redis) with a single command:

1. **Run Setup:**
   ```powershell
   ./setup.ps1
   ```
   This will install dependencies, generate secure `.env` files, and prepare the environment.

2. **Deploy with Docker:**
   ```powershell
   ./deploy.ps1
   ```
   This will build and start all services (Backend, Frontend, DB, Redis) in the background.

**Access Points:**
- Frontend: `http://localhost`
- Backend API: `http://localhost/api/v1`
- API Docs: `http://localhost:8000/docs`

---

### 🛠️ Manual Setup (Development)

If you prefer to run services manually for debugging:

1. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure environment variables:**
```bash
# Edit backend/.env
ENVIRONMENT=development
DATABASE_URL=sqlite:///./lifemind.db
SECRET_KEY=your-secret-key-here
```

3. **Run the backend:**
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Install Node dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment variables:**
```bash
# Edit frontend/.env
VITE_API_URL=http://localhost:8000/api/v1
```

3. **Run the development server:**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

#### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Expense Endpoints

#### Create Expense
```bash
POST /api/v1/expenses
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Lunch",
  "amount": 250.00,
  "category": "food",
  "description": "Lunch at restaurant"
}
```

#### Get All Expenses
```bash
GET /api/v1/expenses?skip=0&limit=20
Authorization: Bearer {token}
```

#### Get Expense Stats
```bash
GET /api/v1/expenses/stats/summary
Authorization: Bearer {token}
```

### Habit Endpoints

#### Create Habit
```bash
POST /api/v1/habits
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Morning Exercise",
  "frequency": "daily",
  "description": "30 minutes of exercise"
}
```

#### Log Habit Completion
```bash
POST /api/v1/habits/{habit_id}/log
Authorization: Bearer {token}
```

### Task Endpoints

#### Create Task
```bash
POST /api/v1/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete project",
  "priority": "high",
  "description": "Finish the LifeMind AI project"
}
```

### Mood Endpoints

#### Log Mood Entry
```bash
POST /api/v1/mood
Authorization: Bearer {token}
Content-Type: application/json

{
  "mood": "happy",
  "energy_level": 8,
  "stress_level": 3,
  "notes": "Great day today!"
}
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt password hashing
- **CORS Protection** - Cross-origin request handling
- **Input Validation** - Pydantic schema validation
- **SQL Injection Protection** - SQLAlchemy parameterized queries
- **Environment Variables** - Sensitive data management

## 📊 Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- username (Unique)
- hashed_password
- full_name
- is_active
- created_at
- updated_at

### Expenses Table
- id (Primary Key)
- user_id (Foreign Key)
- title
- description
- amount
- category
- date
- created_at
- updated_at

### Habits Table
- id (Primary Key)
- user_id (Foreign Key)
- name
- description
- frequency
- status
- streak
- created_at
- updated_at

### Tasks Table
- id (Primary Key)
- user_id (Foreign Key)
- title
- description
- priority
- status
- due_date
- created_at
- updated_at

### Mood Entries Table
- id (Primary Key)
- user_id (Foreign Key)
- mood
- energy_level
- stress_level
- notes
- date
- created_at

## 🎨 UI/UX Features

- **Modern Dashboard** - Overview of all life metrics
- **Smooth Animations** - Framer Motion transitions
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Theme support
- **Real-time Updates** - Live data synchronization
- **Interactive Charts** - Recharts visualizations
- **Intuitive Navigation** - Sidebar-based routing

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### Docker Deployment

The project is fully containerized. To manage the stack:

```bash
# Build and start everything
docker-compose up --build -d

# View status
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

### Cloud Deployment

#### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy
```

#### Backend (Render)
```bash
# Push to GitHub
git push origin main

# Connect to Render and deploy
```

## 🔄 Development Workflow

1. **Create feature branch:**
```bash
git checkout -b feature/your-feature
```

2. **Make changes and commit:**
```bash
git add .
git commit -m "feat: add your feature"
```

3. **Push and create PR:**
```bash
git push origin feature/your-feature
```

## 📈 Performance Optimization

- **Code Splitting** - Lazy loading components
- **Image Optimization** - Compressed assets
- **Caching** - Browser and server caching
- **Database Indexing** - Optimized queries
- **API Rate Limiting** - Prevent abuse
- **CDN Integration** - Fast content delivery

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

**Database errors:**
```bash
# Reset database
rm backend/lifemind.db
python -c "from backend.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### Frontend Issues

**Dependencies not installing:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 5173 in use:**
```bash
npm run dev -- --port 3000
```

## 📝 Environment Variables

### Backend (.env)
```
ENVIRONMENT=development
DATABASE_URL=sqlite:///./lifemind.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api/v1
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by Notion, ChatGPT, and Habitica
- Community-driven development

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: knharesh1501@gmail.com
- Documentation: https://docs.lifemindai.com

---

**LifeMind AI** - Your AI-powered life optimization companion 🚀
