# LifeMind AI - Deployment Guide

## 🚀 Deployment Options for Your Application

Your LifeMind AI is a **full-stack application** with:
- **Frontend**: React + Vite
- **Backend**: FastAPI + SQLAlchemy
- **Database**: SQLite (dev) / PostgreSQL (production)

**❌ NOT Compatible with**: Streamlit, GitHub Pages (frontend-only), Heroku free tier (deprecated)

---

## ✅ Recommended Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) ⭐ BEST FOR BEGINNERS

**Cost**: Free tier available
**Difficulty**: Easy
**Setup Time**: 30 minutes

#### Frontend → Vercel
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Configure build settings
4. Deploy automatically

#### Backend → Railway
1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Add PostgreSQL database
4. Set environment variables
5. Deploy automatically

**Pros**:
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Easy SSL/HTTPS
- ✅ Good performance

**Cons**:
- ⚠️ Backend may sleep on free tier
- ⚠️ Limited database storage on free

---

### Option 2: AWS (EC2 + RDS) ⭐ PRODUCTION GRADE

**Cost**: ~$20-50/month
**Difficulty**: Medium
**Setup Time**: 2-3 hours

#### Architecture
- **EC2 Instance**: Runs both frontend and backend
- **RDS**: PostgreSQL database
- **S3**: Static file storage (profile pictures)
- **CloudFront**: CDN for fast delivery

**Pros**:
- ✅ Full control
- ✅ Scalable
- ✅ Professional grade
- ✅ No sleep issues

**Cons**:
- ⚠️ Requires AWS knowledge
- ⚠️ More expensive
- ⚠️ Manual setup required

---

### Option 3: DigitalOcean App Platform ⭐ BALANCED

**Cost**: ~$12/month (basic)
**Difficulty**: Easy
**Setup Time**: 1 hour

#### Setup
1. Create App in DigitalOcean
2. Connect GitHub repo
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy

**Pros**:
- ✅ Simple pricing
- ✅ Automatic deployments
- ✅ Built-in database
- ✅ No sleep issues

**Cons**:
- ⚠️ Costs more than free tiers
- ⚠️ Less flexible than AWS

---

### Option 4: Render ⭐ FREE TIER AVAILABLE

**Cost**: Free tier + $7/month for database
**Difficulty**: Easy
**Setup Time**: 45 minutes

#### Setup
1. Create Web Service for backend
2. Create Static Site for frontend
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy

**Pros**:
- ✅ Free tier for backend
- ✅ Free for frontend
- ✅ Automatic deployments
- ✅ Easy setup

**Cons**:
- ⚠️ Backend sleeps after 15 min inactivity on free
- ⚠️ Slow wake-up time (~30 seconds)

---

### Option 5: Self-Hosted (Your Own Server)

**Cost**: Variable (VPS ~$5-20/month)
**Difficulty**: Hard
**Setup Time**: 4-6 hours

#### Providers
- Linode
- Vultr
- Hetzner
- Your own hardware

**Pros**:
- ✅ Full control
- ✅ Cheap if using own hardware
- ✅ No vendor lock-in

**Cons**:
- ⚠️ Requires DevOps knowledge
- ⚠️ Manual security updates
- ⚠️ You handle everything

---

## 📋 Step-by-Step: Recommended Deployment (Vercel + Railway)

### Prerequisites
```bash
# Install required tools
npm install -g vercel
# Railway CLI (optional)
npm install -g railway
```

### Step 1: Prepare Your Code

#### Update Frontend API URL
**File**: `frontend/src/services/api.js`

```javascript
// BEFORE (Development)
const API_URL = 'http://localhost:8000';

// AFTER (Production)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

#### Create Frontend Environment File
**File**: `frontend/.env.production`

```env
VITE_API_URL=https://your-backend.railway.app
```

#### Update Backend CORS
**File**: `backend/config.py`

```python
# Add your frontend URLs
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,https://your-app.vercel.app"
).split(",")
```

### Step 2: Deploy Backend to Railway

1. **Create Railway Account**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Select Repository**: LifeMind-AI
4. **Add PostgreSQL**: Click "New" → "Database" → "PostgreSQL"
5. **Set Environment Variables**:
   ```env
   ENVIRONMENT=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}  # Auto-filled by Railway
   SECRET_KEY=your-super-secure-secret-key-change-this
   ALLOWED_ORIGINS=https://your-app.vercel.app
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

6. **Configure Root Directory**: 
   - Settings → Root Directory → `/backend`

7. **Configure Start Command**:
   - Settings → Start Command → `uvicorn main:app --host 0.0.0.0 --port $PORT`

8. **Deploy**: Railway auto-deploys on push

9. **Get Your URL**: Copy the Railway URL (e.g., `https://lifemind-ai-production.up.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. **Create Vercel Account**: https://vercel.com

2. **Import Project**:
   - New Project → Import Git Repository
   - Select LifeMind-AI

3. **Configure Build Settings**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

5. **Deploy**: Vercel builds and deploys

6. **Get Your URL**: Your app is live at `https://lifemind-ai.vercel.app`

### Step 4: Update Backend CORS

Update Railway environment variable:
```env
ALLOWED_ORIGINS=https://lifemind-ai.vercel.app,https://lifemind-ai-*.vercel.app
```

### Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Register a new account
3. Test all features:
   - ✅ Login/Register
   - ✅ Dashboard
   - ✅ Settings (theme, email, etc.)
   - ✅ Habits, Tasks, Expenses
   - ✅ Email notifications

---

## 🔧 Production Configuration Checklist

### Backend (Railway)
```env
# Required
✅ ENVIRONMENT=production
✅ DATABASE_URL=(auto-filled by Railway)
✅ SECRET_KEY=(generate strong random key)
✅ ALLOWED_ORIGINS=(your frontend URL)

# Email (Optional but recommended)
✅ SMTP_USER=your-email@gmail.com
✅ SMTP_PASSWORD=your-app-password
✅ SMTP_HOST=smtp.gmail.com
✅ SMTP_PORT=587

# AI (Optional)
✅ GROQ_API_KEY=your-groq-key
```

### Frontend (Vercel)
```env
# Required
✅ VITE_API_URL=https://your-backend.railway.app
```

---

## 📊 Deployment Comparison

| Feature | Vercel+Railway | AWS | DigitalOcean | Render |
|---------|---------------|-----|--------------|--------|
| **Free Tier** | ✅ Yes | ❌ No | ❌ No | ✅ Partial |
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Auto Deploy** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **Cost (Monthly)** | Free - $5 | $20-50 | $12-25 | Free - $7 |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Scalability** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Best For** | Startups | Enterprise | Small Business | Hobby |

---

## 🚨 Important Notes

### Security
- ✅ Always use strong SECRET_KEY in production
- ✅ Never commit .env files to Git
- ✅ Use HTTPS for all production URLs
- ✅ Enable CORS only for your domains

### Database
- ✅ Use PostgreSQL in production (not SQLite)
- ✅ Enable automated backups
- ✅ Set up database migrations

### Email
- ✅ Use transactional email services for scale (SendGrid, AWS SES)
- ✅ Gmail works for small scale
- ✅ Monitor email deliverability

---

## ❓ FAQ

**Q: Can I deploy to Streamlit?**
A: ❌ No. Streamlit is for Python-only apps. Your app is React + FastAPI.

**Q: Can I deploy to GitHub Pages?**
A: ⚠️ Partially. You can host frontend on GitHub Pages, but you need a separate backend host.

**Q: What's the cheapest option?**
A: Vercel (frontend free) + Railway (backend free tier) = $0 initially, with optional paid upgrades.

**Q: What's the easiest option?**
A: Vercel + Railway. Both have GitHub integration and auto-deploy.

**Q: What's the best for production?**
A: AWS or DigitalOcean for reliability and scale.

**Q: Do I need a custom domain?**
A: No, but recommended. You can use Vercel/Railway subdomains initially.

---

## 📚 Additional Resources

### Vercel Deployment
- Docs: https://vercel.com/docs
- React/Vite: https://vitejs.dev/guide/static-deploy.html#vercel

### Railway Deployment
- Docs: https://docs.railway.app
- FastAPI: https://docs.railway.app/guides/fastapi

### AWS Deployment
- EC2 Tutorial: https://docs.aws.amazon.com/ec2/
- RDS Setup: https://docs.aws.amazon.com/rds/

---

## ✅ Next Steps

1. **Choose Deployment Option**: I recommend Vercel + Railway for beginners
2. **Create Accounts**: Sign up for Vercel and Railway
3. **Push to GitHub**: Ensure your code is in a Git repository
4. **Follow Deployment Steps**: Use the guide above
5. **Test Thoroughly**: Verify all features work in production
6. **Monitor**: Set up error logging (Sentry, LogRocket)

---

**Need Help?** See the deployment guides or ask for specific platform assistance!
