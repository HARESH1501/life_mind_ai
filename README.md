# LifeMind AI - Life Optimization Platform

![LifeMind AI](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19.2.6-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![Python](https://img.shields.io/badge/Python-3.11-yellow)

A comprehensive AI-powered life optimization platform that helps users track habits, manage tasks, monitor expenses, log mood, and receive personalized AI coaching.

## 🌟 Features

### Core Features
- 📊 **Dashboard** - Comprehensive overview of your life metrics
- ✅ **Habit Tracking** - Build and maintain healthy habits with streak tracking
- 📝 **Task Management** - Organize and prioritize your daily tasks
- 💰 **Expense Tracking** - Monitor spending and manage budget
- 😊 **Mood Logging** - Track emotional well-being and energy levels
- 📅 **Meeting Scheduler** - Plan and manage meetings with reminders
- ⚙️ **Advanced Settings** - Customize your experience

### AI-Powered Features
- 🤖 **AI Coach** - Personalized life coaching using Groq LLaMA 3.3 70B
- 💡 **Smart Insights** - AI-generated recommendations and analysis
- 📈 **Predictive Analytics** - Understand patterns and trends
- 🎯 **Goal Optimization** - AI-driven goal setting and tracking

### Settings & Customization
- 🎨 **Theme Switching** - Light/Dark/System with instant preview
- 🌈 **Accent Colors** - 10 color options with instant application
- 🔔 **Notifications** - Granular control over all notification types
- 📧 **Email Preferences** - Customizable email notifications
- 🔒 **Security** - Password management, 2FA, session control
- 💾 **Data Export** - Export all your data anytime

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19.2.6 + Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Animations**: Framer Motion 11
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Styling**: Custom CSS with CSS Variables

### Backend
- **Framework**: FastAPI
- **Database**: SQLAlchemy ORM (SQLite dev, PostgreSQL prod)
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: SMTP (Gmail)
- **Scheduler**: APScheduler
- **AI**: Groq API (LLaMA 3.3 70B)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (see .env.example)
# Add your API keys and configuration

# Run database migrations (if any)
# python migrate.py

# Start backend server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file (optional for local development)
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=sqlite:///./lifemind.db

# JWT
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Services
GROQ_API_KEY=your-groq-api-key

# Email (Gmail)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Features
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_HABIT_REMINDERS=true
ENABLE_TASK_REMINDERS=true
SCHEDULER_ENABLED=true
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Recommended: Render.com

**Quick Deploy**:
1. Push code to GitHub
2. Create PostgreSQL database on Render
3. Deploy backend as Web Service
4. Deploy frontend as Static Site
5. Update CORS and environment variables

**Detailed Guide**: See `RENDER_DEPLOYMENT_GUIDE.md`

**Quick Reference**: See `RENDER_QUICK_DEPLOY.txt`

### Other Options
- **Vercel + Railway** - Free tier available
- **AWS (EC2 + RDS)** - Production grade
- **DigitalOcean** - Balanced option

## 📚 Documentation

- **Deployment**: `RENDER_DEPLOYMENT_GUIDE.md` - Complete Render deployment guide
- **Settings**: `SETTINGS_COMPLETE_REPORT.md` - Settings feature documentation
- **Architecture**: `SETTINGS_ARCHITECTURE.md` - Technical architecture
- **Testing**: `SETTINGS_TESTING_CHECKLIST.md` - Testing procedures
- **Quick Start**: `SETTINGS_QUICK_START.md` - 5-minute setup guide

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### API Tests
```bash
python test_settings_endpoints.py
```

### Complete Verification
```bash
python verify_all_settings_features.py
```

## 🎯 Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | ✅ Complete | JWT-based auth |
| Dashboard | ✅ Complete | Real-time metrics |
| Habits | ✅ Complete | Streak tracking |
| Tasks | ✅ Complete | Priority management |
| Expenses | ✅ Complete | Category tracking |
| Mood | ✅ Complete | Energy & stress levels |
| Meetings | ✅ Complete | With reminders |
| Settings | ✅ Complete | 8 comprehensive sections |
| AI Coach | ✅ Complete | Groq LLaMA 3.3 70B |
| Email Notifications | ✅ Complete | SMTP configured |
| Theme Switching | ✅ Complete | Instant preview |

## 🔧 Troubleshooting

### Common Issues

**Issue**: React version conflict
**Solution**: See `REACT_VERSION_FIX.md`

**Issue**: Email not sending
**Solution**: Use Gmail App Password, not regular password

**Issue**: Database connection error
**Solution**: Check DATABASE_URL in .env

**Issue**: CORS error
**Solution**: Update ALLOWED_ORIGINS in backend config

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Haresh**
- GitHub: [@HARESH1501](https://github.com/HARESH1501)
- Repository: [life_mind_ai](https://github.com/HARESH1501/life_mind_ai)

## 🙏 Acknowledgments

- **Groq** - For the amazing LLaMA 3.3 70B API
- **FastAPI** - For the excellent Python framework
- **React** - For the powerful frontend library
- **Framer Motion** - For beautiful animations
- **Render** - For easy deployment

## 📊 Project Stats

- **Lines of Code**: ~15,000+
- **Components**: 30+
- **API Endpoints**: 50+
- **Features**: 12 major features
- **Documentation**: 15+ comprehensive guides

## 🚀 Roadmap

- [ ] Mobile app (React Native)
- [ ] Social features (share habits, challenges)
- [ ] Advanced AI analytics
- [ ] Integration with fitness trackers
- [ ] Voice commands
- [ ] Multi-language support
- [ ] Dark/Light theme presets
- [ ] Custom dashboard widgets

## 💡 Support

For support, email haresh@example.com or open an issue on GitHub.

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ by Haresh**

🌐 **Live Demo**: Coming soon on Render
📧 **Contact**: haresh@example.com
