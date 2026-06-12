# LifeMind AI - Render Deployment Guide

## 🚀 Complete Render Deployment (Step-by-Step)

**What You'll Deploy**:
- ✅ Backend (FastAPI) → Render Web Service
- ✅ Frontend (React) → Render Static Site
- ✅ Database (PostgreSQL) → Render PostgreSQL

**Total Cost**: Free tier + $7/month for database (optional paid tier for better performance)

---

## 📋 Prerequisites

1. ✅ Render account (free): https://render.com
2. ✅ GitHub account
3. ✅ Your code pushed to GitHub
4. ✅ Gmail App Password (for email functionality)

---

## 🔧 Step 1: Prepare Your Code

### 1.1 Push Code to GitHub (if not already)

```bash
cd d:\LifeMind-AI
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/lifemind-ai.git
git push -u origin main
```

### 1.2 Update Frontend API Configuration

**File**: `frontend/src/services/api.js`

```javascript
import axios from 'axios';

// Use environment variable in production, localhost in development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... rest of the file stays the same
```

### 1.3 Create Frontend Environment File

**File**: `frontend/.env.production`

```env
VITE_API_URL=https://lifemind-api.onrender.com
```

**Note**: Replace `lifemind-api` with your actual backend URL (you'll get this in Step 3)

### 1.4 Create Backend Requirements File (if not exists)

**File**: `backend/requirements.txt`

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
pydantic[email]==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
python-dotenv==1.0.0
psycopg2-binary==2.9.9
groq==0.4.0
apscheduler==3.10.4
```

### 1.5 Update Backend for Production

**File**: `backend/config.py`

Update CORS origins:
```python
# CORS - Allow Render frontend
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")
```

### 1.6 Commit and Push Changes

```bash
git add .
git commit -m "Prepare for Render deployment"
git push
```

---

## 📦 Step 2: Deploy PostgreSQL Database

1. **Login to Render**: https://dashboard.render.com

2. **Create PostgreSQL**:
   - Click **"New +"** → **"PostgreSQL"**

3. **Configure Database**:
   ```
   Name: lifemind-db
   Database: lifemind_production
   User: lifemind_user
   Region: Choose closest to you
   PostgreSQL Version: 16
   Plan: Free (or Starter $7/month for better performance)
   ```

4. **Create Database**: Click **"Create Database"**

5. **Copy Connection String**:
   - After creation, find **"Internal Database URL"**
   - Copy it (format: `postgresql://user:password@host/database`)
   - **Save this** - you'll need it for the backend

---

## 🔧 Step 3: Deploy Backend (FastAPI)

1. **Create Web Service**:
   - Click **"New +"** → **"Web Service"**

2. **Connect Repository**:
   - Select **"Build and deploy from a Git repository"**
   - Click **"Connect GitHub"** (authorize if needed)
   - Select your **LifeMind-AI** repository

3. **Configure Service**:
   ```
   Name: lifemind-api
   Region: Same as database
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   Plan: Free
   ```

4. **Add Environment Variables**:
   Click **"Advanced"** → **"Add Environment Variable"**

   ```env
   ENVIRONMENT=production
   
   DATABASE_URL=<paste-your-internal-database-url-from-step-2>
   
   SECRET_KEY=your-super-secure-random-secret-key-change-this-now
   
   ALLOWED_ORIGINS=https://lifemind-ai.onrender.com
   
   # Email (Gmail)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-gmail-app-password
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
   
   # AI (Optional)
   GROQ_API_KEY=your-groq-key-if-you-have-one
   ```

   **⚠️ Important**:
   - Generate strong SECRET_KEY (use: `openssl rand -hex 32`)
   - Use Gmail App Password, not regular password
   - Update ALLOWED_ORIGINS with your frontend URL (you'll update this in Step 4)

5. **Create Web Service**: Click **"Create Web Service"**

6. **Wait for Deployment** (5-10 minutes):
   - Watch the logs for deployment status
   - Look for: `Uvicorn running on http://0.0.0.0:10000`

7. **Copy Backend URL**:
   - After deployment, copy your URL (e.g., `https://lifemind-api.onrender.com`)
   - **Save this** - you'll need it for the frontend

8. **Test Backend**:
   - Visit: `https://your-backend-url.onrender.com/docs`
   - You should see FastAPI Swagger documentation

---

## 🎨 Step 4: Deploy Frontend (React)

1. **Create Static Site**:
   - Click **"New +"** → **"Static Site"**

2. **Connect Repository**:
   - Select **"Build and deploy from a Git repository"**
   - Select your **LifeMind-AI** repository

3. **Configure Static Site**:
   ```
   Name: lifemind-ai
   Region: Same as backend
   Branch: main
   Root Directory: frontend
   Build Command: npm run build
   Publish Directory: dist
   ```

4. **Add Environment Variables**:
   Click **"Advanced"** → **"Add Environment Variable"**

   ```env
   VITE_API_URL=https://lifemind-api.onrender.com
   ```

   **⚠️ Replace** with your actual backend URL from Step 3!

5. **Create Static Site**: Click **"Create Static Site"**

6. **Wait for Build** (3-5 minutes)

7. **Get Frontend URL**:
   - After deployment, your site will be at: `https://lifemind-ai.onrender.com`

---

## 🔄 Step 5: Update Backend CORS

Now that you have your frontend URL, update backend CORS:

1. **Go to Backend Service**: Click on **"lifemind-api"** in Render dashboard

2. **Environment Variables**:
   - Find **"ALLOWED_ORIGINS"**
   - Update to: `https://lifemind-ai.onrender.com`
   - Click **"Save Changes"**

3. **Redeploy**: Render will automatically redeploy with new settings

---

## ✅ Step 6: Test Your Deployment

1. **Visit Your App**: https://lifemind-ai.onrender.com

2. **Register New Account**:
   - Click "Register"
   - Fill in details
   - Submit

3. **Test Login**:
   - Login with your new account

4. **Test Features**:
   ```
   ✅ Dashboard loads
   ✅ Settings page opens (click Settings in sidebar)
   ✅ Theme changes work (Appearance → Light/Dark)
   ✅ Accent color changes work
   ✅ Create a habit
   ✅ Create a task
   ✅ Add an expense
   ✅ Log mood entry
   ```

5. **Test Email** (if configured):
   - Settings → Email → "Send Test"
   - Check your inbox

---

## ⚙️ Configuration Files for Render

### Backend: `render.yaml` (Optional - Auto-deploy)

Create in repository root:

```yaml
services:
  - type: web
    name: lifemind-api
    runtime: python
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: ENVIRONMENT
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: lifemind-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: PYTHON_VERSION
        value: 3.11.0

databases:
  - name: lifemind-db
    databaseName: lifemind_production
    user: lifemind_user
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Backend Takes Long to Respond (Free Tier)
**Problem**: Backend sleeps after 15 minutes of inactivity

**Solution**: 
- Upgrade to paid tier ($7/month) for instant response
- Or accept 30-second wake-up time on first request

### Issue 2: Database Connection Error
**Problem**: `database "lifemind_production" does not exist`

**Solution**:
1. Check DATABASE_URL is correct
2. Verify database is created in Render
3. Check backend logs for detailed error

### Issue 3: CORS Error
**Problem**: `Access-Control-Allow-Origin` error in browser console

**Solution**:
1. Update backend ALLOWED_ORIGINS to include frontend URL
2. Redeploy backend
3. Clear browser cache

### Issue 4: Frontend Shows "Network Error"
**Problem**: Frontend can't connect to backend

**Solution**:
1. Verify VITE_API_URL is correct in frontend env vars
2. Check backend is running: visit `/docs` endpoint
3. Check backend logs for errors

### Issue 5: Email Not Sending
**Problem**: Test email button doesn't send email

**Solution**:
1. Verify SMTP_USER and SMTP_PASSWORD are correct
2. Use Gmail App Password, not regular password
3. Check backend logs for SMTP errors

---

## 📊 Render Dashboard Overview

### Backend Service
```
Status: ● Live
URL: https://lifemind-api.onrender.com
Logs: Click "Logs" to see real-time output
Events: See deployment history
Environment: Manage env variables
Settings: Change build/start commands
```

### Frontend Static Site
```
Status: ● Live  
URL: https://lifemind-ai.onrender.com
Deploys: See build history
Environment: Manage env variables
Settings: Change build settings
```

### PostgreSQL Database
```
Status: ● Available
Connections: View active connections
Info: See connection strings
Backups: (Paid plans only)
```

---

## 💰 Cost Breakdown

### Free Tier
- ✅ Backend: Free (sleeps after 15 min inactivity)
- ✅ Frontend: Free
- ✅ Database: Free (90 days, then expires)
- **Total: $0/month** (with limitations)

### Recommended Paid Tier
- ✅ Backend: $7/month (always on, faster)
- ✅ Frontend: Free
- ✅ Database: $7/month (persistent, backups)
- **Total: $14/month**

---

## 🔒 Security Checklist

Before going live:

- ✅ Change SECRET_KEY to strong random value
- ✅ Use Gmail App Password (not regular password)
- ✅ Enable HTTPS (automatic on Render)
- ✅ Update ALLOWED_ORIGINS to production URL only
- ✅ Remove DEBUG mode (ENVIRONMENT=production)
- ✅ Set strong passwords for database users
- ✅ Enable database backups (paid plan)

---

## 📈 Post-Deployment

### Monitor Your App
1. **Backend Logs**: Dashboard → lifemind-api → Logs
2. **Frontend Logs**: Dashboard → lifemind-ai → Deploys
3. **Database**: Dashboard → lifemind-db → Info

### Custom Domain (Optional)
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Render Settings → Custom Domain
3. Add CNAME record in DNS
4. Wait for SSL certificate

### Automatic Deployments
Render automatically deploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push
# Render auto-deploys in 2-5 minutes
```

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] Code pushed to GitHub
- [ ] Frontend API URL uses environment variable
- [ ] Backend CORS configured
- [ ] Requirements.txt updated
- [ ] Gmail App Password ready

### During Deployment
- [ ] PostgreSQL database created
- [ ] Backend web service created
- [ ] Frontend static site created
- [ ] All environment variables set
- [ ] Backend CORS updated with frontend URL

### After Deployment
- [ ] Backend `/docs` endpoint accessible
- [ ] Frontend loads without errors
- [ ] Registration works
- [ ] Login works
- [ ] All features tested
- [ ] Email sending tested (if configured)

---

## 🎉 Success!

Your LifeMind AI app is now live on Render!

**Your URLs**:
- 🌐 Frontend: https://lifemind-ai.onrender.com
- 🔧 Backend API: https://lifemind-api.onrender.com
- 📚 API Docs: https://lifemind-api.onrender.com/docs

**Next Steps**:
1. Test all features thoroughly
2. Share with friends/users
3. Monitor logs for errors
4. Set up custom domain (optional)
5. Upgrade to paid tier for better performance

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Render Support**: https://render.com/support
- **Check Logs**: Dashboard → Your Service → Logs tab

---

**Happy Deploying! 🚀**
