# Quick Login Reference Guide

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Open Application
```
http://localhost:5173
```

### 4. Login
```
Email: test@example.com
Password: test123
```

---

## 📋 Test Credentials

| Field | Value |
|-------|-------|
| Email | test@example.com |
| Password | test123 |
| Username | testuser |
| Full Name | Test User |

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/auth.py` | Password hashing & JWT |
| `backend/routers/auth.py` | Login/Register endpoints |
| `frontend/src/store/authStore.js` | Auth state management |
| `frontend/src/pages/LoginPage.jsx` | Login UI |
| `frontend/src/config/api.js` | API client setup |

---

## 🔐 What Was Fixed

1. **Backend**: Switched from bcrypt to Argon2
2. **Frontend**: Added error handling with finally block
3. **Frontend**: Added response validation
4. **Frontend**: Added form validation
5. **Database**: Created test user

---

## ✅ Verification

### Quick Test
```bash
# Test API directly
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Expected Response
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser",
    "full_name": "Test User",
    "is_active": true,
    "created_at": "2026-05-23T15:15:58.376451"
  }
}
```

---

## 🐛 Troubleshooting

### Problem: "Logging in..." never stops
**Solution**: 
- Check backend logs
- Verify test user exists: `python backend/create_test_user.py`
- Restart backend

### Problem: "Invalid email or password"
**Solution**:
- Verify credentials: `test@example.com` / `test123`
- Recreate test user: `python backend/create_test_user.py`

### Problem: CORS error
**Solution**:
- Verify frontend URL in backend config
- Check ALLOWED_ORIGINS in `backend/config.py`

### Problem: Token not stored
**Solution**:
- Check browser console
- Verify localStorage is enabled
- Check API response in Network tab

---

## 📊 Architecture

```
Frontend (React)
  ↓
LoginPage.jsx
  ↓
authStore.login()
  ↓
apiClient.post('/auth/login')
  ↓
Backend (FastAPI)
  ↓
routers/auth.py
  ↓
Verify password (Argon2)
  ↓
Generate JWT token
  ↓
Return TokenResponse
  ↓
Frontend stores token
  ↓
Redirect to dashboard
```

---

## 🔑 Key Improvements

### Error Handling
```javascript
try {
  // API call
} catch (error) {
  // Handle error
} finally {
  // Always reset loading state
}
```

### Response Validation
```javascript
if (!response.data?.access_token) {
  throw new Error('Invalid response');
}
```

### Form Validation
```javascript
if (!formData.email || !formData.password) {
  return; // Don't submit
}
```

---

## 📚 Documentation

- `LOGIN_FIX_SUMMARY.md` - Complete fix overview
- `AUTH_DEBUGGING_GUIDE.md` - Detailed debugging guide
- `VERIFICATION_CHECKLIST.md` - Step-by-step verification
- `QUICK_START.md` - General project setup

---

## 🎯 Next Steps

1. Test login with provided credentials
2. Verify dashboard loads
3. Test error handling with wrong password
4. Create additional test users as needed
5. Monitor browser console for errors
6. Check backend logs for issues

---

## 💡 Pro Tips

### View API Response
1. Open DevTools (F12)
2. Go to Network tab
3. Login
4. Click on `/auth/login` request
5. View Response tab

### Check Token
```javascript
// In browser console
localStorage.getItem('access_token')
```

### Decode JWT
```javascript
// In browser console
const token = localStorage.getItem('access_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
```

### Clear All Data
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 🚨 Emergency Fixes

### Backend won't start
```bash
# Check Python version
python --version

# Reinstall dependencies
pip install -r requirements.txt

# Restart backend
python -m uvicorn main:app --reload
```

### Frontend won't start
```bash
# Clear node_modules
rm -r node_modules
npm install

# Restart frontend
npm run dev
```

### Database issues
```bash
# Delete database
rm backend/lifemind.db

# Recreate tables
python backend/create_test_user.py
```

---

## 📞 Quick Support

**Issue**: Can't login
**Check**: 
1. Backend running?
2. Test user exists?
3. Correct credentials?
4. No console errors?

**Issue**: Token not working
**Check**:
1. Token in localStorage?
2. Token format correct?
3. Token not expired?

**Issue**: Dashboard won't load
**Check**:
1. Token valid?
2. API responding?
3. No 401 errors?

---

## ✨ Status

- ✅ Backend: Working
- ✅ Frontend: Working
- ✅ API: Working
- ✅ Authentication: Fixed
- ✅ Error Handling: Improved
- ✅ Test User: Created

**Ready to use!** 🎉
