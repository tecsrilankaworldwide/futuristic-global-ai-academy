# Futuristic Global AI Academy - GitHub Setup

## 📁 Project Directory

**Main Directory:** `/app/`

This contains the complete platform with frontend, backend, and all documentation.

---

## 🚀 Push to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `futuristic-ai-academy` (or your choice)
3. Description: "Futuristic Global AI Academy - Future Leaders Meeting Place"
4. Choose: Public or Private
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

---

### Step 2: Initialize Git & Push

```bash
# Navigate to project directory
cd /app

# Initialize git
git init

# Add all files
git add .

# Create .gitignore first
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
pip-log.txt
pip-delete-this-directory.txt

# Environment files
.env
.env.local
.env.*.local

# Build files
frontend/build/
frontend/dist/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Uploads
backend/uploads/

# Testing
.coverage
htmlcov/
.pytest_cache/

# Certificates
*.pdf
EOF

# Add files after gitignore
git add .

# First commit
git commit -m "Initial commit: Futuristic Global AI Academy - Complete multilingual platform"

# Add your GitHub repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/futuristic-ai-academy.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Step 3: Verify on GitHub

Visit: `https://github.com/YOUR_USERNAME/futuristic-ai-academy`

You should see:
- ✅ README.md with project overview
- ✅ Complete backend/ and frontend/ folders
- ✅ Documentation files
- ✅ Seed scripts

---

## 📦 What Gets Pushed

### Included:
- ✅ `/app/backend/` - Complete FastAPI backend
- ✅ `/app/frontend/` - Complete React frontend
- ✅ `/app/README.md` - Project documentation
- ✅ `/app/plan.md` - Development plan
- ✅ `/app/DEPLOYMENT_GUIDE.md` - Deployment instructions
- ✅ `/app/USER_JOURNEY.md` - User flow documentation
- ✅ `/app/seed_activities.py` - Activity seed scripts
- ✅ `/app/seed_more_activities.py`
- ✅ `/app/add_topic_explanations.py`

### Excluded (via .gitignore):
- ❌ `node_modules/` - Too large, reinstall with `yarn`
- ❌ `__pycache__/` - Python cache
- ❌ `.env` files - Contains secrets (MongoDB, Stripe keys)
- ❌ `uploads/` - User-uploaded files
- ❌ Build artifacts

---

## 🔐 Environment Setup for New Clone

After cloning, create `.env` files:

### backend/.env
```env
MONGO_URL="mongodb://your-mongodb-url"
DB_NAME="ai_unplugged_db"
SECRET_KEY="your-secret-key"
STRIPE_API_KEY="your-stripe-key"
CORS_ORIGINS="*"
```

### frontend/.env
```env
REACT_APP_BACKEND_URL="http://localhost:8001"
```

---

## 📊 Repository Statistics

**Project Size:**
- Backend: ~50 files
- Frontend: ~100+ files
- Total: 38 activities, 13 languages, 150+ translations

**Lines of Code (approx):**
- Backend: ~2,000 lines
- Frontend: ~3,500 lines
- Total: ~5,500 lines

---

## 🎉 Benefits of GitHub

1. **Version Control:** Track all changes
2. **Collaboration:** Multiple developers can contribute
3. **Backup:** Cloud storage of your code
4. **Deployment:** Easy integration with Vercel/Railway
5. **Portfolio:** Showcase your project

---

## 🌟 Repository Visibility

**Public Repository:**
- ✅ Great for portfolio
- ✅ Community contributions
- ✅ Open source recognition
- ⚠️ Keep API keys in .env (not pushed)

**Private Repository:**
- ✅ Keeps code confidential
- ✅ Control access
- ✅ Commercial projects
- ⚠️ Requires paid GitHub plan for teams

---

## 📝 Next Steps After Push

1. **Add Topics:** On GitHub, add topics like:
   - `ai-education`
   - `multilingual`
   - `fastapi`
   - `react`
   - `mongodb`
   - `computer-science-education`

2. **Add Description:** "Futuristic Global AI Academy - A multilingual AI education platform in 13 languages"

3. **Set Homepage:** Add live demo URL if deployed

4. **Enable Issues:** For bug tracking

5. **Add License:** MIT or appropriate license

---

## 🚀 Deploy from GitHub

### Vercel (Frontend)
```bash
vercel --prod
# Or connect via Vercel dashboard
```

### Railway (Backend)
```bash
railway up
# Or connect via Railway dashboard
```

---

## 🤝 Made by TEC WORLDWIDE

**SEE THE FUTURE TODAY**

For support, visit: https://tecworldwide.com
