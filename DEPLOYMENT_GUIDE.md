# 🚀 Production Deployment Guide
## Unplugged AI Academy - Complete Platform

This guide helps you deploy the complete multilingual AI + Computer Unplugged Learning Platform to production.

---

## 📋 Pre-Deployment Checklist

### 1. **Update Environment Variables**

#### Backend (.env)
```bash
# Production MongoDB (get from MongoDB Atlas or your provider)
MONGO_URL="mongodb+srv://username:password@cluster.mongodb.net/ai_unplugged_prod"
DB_NAME="ai_unplugged_prod"

# Production Secret Key (generate a secure random key)
SECRET_KEY="your-super-secure-random-key-min-32-characters-long"

# Production Stripe Keys (from Stripe Dashboard)
STRIPE_API_KEY="sk_live_your_live_stripe_key"

# CORS (your production domain)
CORS_ORIGINS="https://yourdomain.com"
```

#### Frontend (.env)
```bash
# Your production backend API URL
REACT_APP_BACKEND_URL="https://api.yourdomain.com"
```

### 2. **Stripe Setup - IMPORTANT!**

**Current State:** Using test key `sk_test_emergent`

**For Production:**
1. Go to https://dashboard.stripe.com
2. Get your **Live API Key** (starts with `sk_live_...`)
3. Set up webhook endpoint: `https://api.yourdomain.com/api/webhook/stripe`
4. Get webhook signing secret
5. Update pricing if needed (currently LKR 1200/1800/2800)

### 3. **Database Migration**
```bash
# Export current data (if you want to keep test data)
mongodump --uri="mongodb://localhost:27017/ai_unplugged_db" --out=backup

# Import to production MongoDB
mongorestore --uri="mongodb+srv://..." backup/ai_unplugged_db
```

---

## 🌐 Deployment Options

### **Option A: Vercel (Recommended for Frontend) + Railway (Backend)**

#### Frontend (Vercel)
1. **Connect GitHub:**
   ```bash
   # Push your code to GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/unplugged-ai.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Framework: Create React App
   - Build Command: `cd frontend && yarn build`
   - Output Directory: `frontend/build`
   - Add Environment Variable: `REACT_APP_BACKEND_URL`
   - Deploy!

#### Backend (Railway)
1. **Deploy on Railway:**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub"
   - Select your repo
   - Add Service → select `backend` folder
   - Add Environment Variables (all from .env)
   - Add MongoDB service (or use MongoDB Atlas)
   - Deploy!

2. **Get API URL:**
   - Railway will give you: `https://your-app.up.railway.app`
   - Update frontend `REACT_APP_BACKEND_URL` on Vercel

---

### **Option B: Render (All-in-One)**

#### Backend
1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: unplugged-ai-backend
    runtime: python
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: MONGO_URL
        sync: false
      - key: DB_NAME
        value: ai_unplugged_prod
      - key: SECRET_KEY
        generateValue: true
      - key: STRIPE_API_KEY
        sync: false
      - key: CORS_ORIGINS
        sync: false
```

#### Frontend
```yaml
  - type: web
    name: unplugged-ai-frontend
    runtime: node
    buildCommand: "cd frontend && yarn install && yarn build"
    staticPublishPath: "frontend/build"
    envVars:
      - key: REACT_APP_BACKEND_URL
        value: https://your-backend.onrender.com
```

---

### **Option C: DigitalOcean App Platform**

1. **Create App:**
   - Go to https://cloud.digitalocean.com/apps
   - Click "Create App" → Connect GitHub

2. **Configure Backend:**
   - Detected as: Python
   - Build: `pip install -r requirements.txt`
   - Run: `uvicorn server:app --host 0.0.0.0 --port 8080`
   - Add all environment variables

3. **Configure Frontend:**
   - Detected as: Node.js
   - Build: `yarn build`
   - Output: `build/`
   - Add `REACT_APP_BACKEND_URL`

---

## 🔧 Post-Deployment Steps

### 1. **Seed Production Data**
```bash
# SSH into your backend server or run locally pointing to prod DB
python seed_activities.py
python seed_more_activities.py
```

### 2. **Create Admin Account**
```bash
# Use the registration endpoint with role="admin"
curl -X POST https://api.yourdomain.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "secure_password",
    "full_name": "Admin User",
    "role": "admin"
  }'
```

### 3. **Test Critical Flows**
- ✅ Registration (all roles)
- ✅ Login
- ✅ Activity browsing
- ✅ Activity completion
- ✅ Language switching (all 13 languages)
- ✅ Voice playback (bilingual)
- ✅ Stripe checkout (use test card: 4242 4242 4242 4242)
- ✅ Certificate download
- ✅ Parent linking child
- ✅ Teacher creating activity
- ✅ Leaderboard display

### 4. **Stripe Webhook Testing**
```bash
# Test webhook locally first
stripe listen --forward-to localhost:8001/api/webhook/stripe

# Then set production webhook in Stripe Dashboard
# Endpoint: https://api.yourdomain.com/api/webhook/stripe
# Events: checkout.session.completed, checkout.session.async_payment_succeeded
```

---

## 📊 Monitoring & Maintenance

### **Application Monitoring**
- **Uptime:** Use UptimeRobot (https://uptimerobot.com) - free
- **Error Tracking:** Sentry (https://sentry.io)
- **Analytics:** Google Analytics or Plausible

### **Database Backups**
```bash
# Daily backups (set up cron job)
0 2 * * * mongodump --uri="$MONGO_URL" --out=/backups/$(date +\%Y\%m\%d)
```

### **Log Monitoring**
```bash
# Check backend logs
railway logs --service backend # Railway
render logs # Render
doctl apps logs <app-id> # DigitalOcean
```

---

## 🔐 Security Hardening

### 1. **Update SECRET_KEY**
```python
# Generate secure key
import secrets
print(secrets.token_urlsafe(32))
```

### 2. **CORS Configuration**
```python
# backend/server.py - update CORS_ORIGINS
CORS_ORIGINS = "https://yourdomain.com,https://www.yourdomain.com"
```

### 3. **Rate Limiting** (Optional)
```bash
pip install slowapi
```

```python
# Add to server.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

@api_router.post("/login")
@limiter.limit("5/minute")
async def login_user(request: Request, login_data: UserLogin):
    # ... existing code
```

### 4. **HTTPS Only**
Ensure your deployment platform serves over HTTPS (all mentioned platforms do this automatically).

---

## 🌍 Custom Domain Setup

### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your domain: `www.yourdomain.com`
3. Follow DNS instructions (add CNAME)

### Railway/Render/DigitalOcean (Backend)
1. Go to Settings → Custom Domain
2. Add: `api.yourdomain.com`
3. Update DNS (add CNAME or A record)

---

## 💰 Cost Estimates

### **Free Tier (Hobbyist)**
- Vercel: Free (100GB bandwidth)
- Railway: Free ($5 credit/month)
- MongoDB Atlas: Free (512MB)
- **Total: $0/month** (within limits)

### **Production Scale**
- Vercel Pro: $20/month
- Railway Pro: $20/month
- MongoDB Atlas M10: $57/month
- Stripe: 2.9% + $0.30 per transaction
- **Total: ~$100/month + transaction fees**

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Stripe Docs:** https://stripe.com/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **React Docs:** https://react.dev

---

## ✅ Final Checklist Before Going Live

- [ ] All environment variables updated to production values
- [ ] Stripe live keys configured
- [ ] MongoDB production database set up
- [ ] All 38 activities seeded
- [ ] Admin account created
- [ ] Custom domain configured
- [ ] HTTPS enabled
- [ ] Webhooks tested
- [ ] All features tested on production URL
- [ ] Backup system in place
- [ ] Monitoring tools configured
- [ ] Legal pages added (Terms, Privacy Policy)

---

## 🎉 You're Ready to Launch!

Your **Unplugged AI Academy** is now production-ready with:
- ✅ 13 Languages (Multilingual)
- ✅ Bilingual Voice (Native + English)
- ✅ 38 Curated Activities
- ✅ 4 User Roles (Student, Parent, Teacher, Admin)
- ✅ Complete Dashboards
- ✅ Leaderboard System
- ✅ Stripe Payments
- ✅ Certificate Generation
- ✅ Child-First Design

**Need Help?** The codebase is well-documented and modular. All features are fully functional and tested!
