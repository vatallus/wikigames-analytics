# 🚀 Deployment Guide - Free Hosting Options

## 🎯 Best Free Platforms for Your Project

### ⭐ **RECOMMENDED: Vercel (Best Choice!)**

**Why Vercel:**
```
✅ Completely FREE for hobby projects
✅ Automatic deployment from GitHub
✅ Built-in CI/CD
✅ Super fast CDN
✅ Zero configuration for React/Vite
✅ Free SSL certificate
✅ Serverless functions support
✅ Analytics included
```

**Deployment Steps:**

1. **Push to GitHub** (if not done):
```bash
git add .
git commit -m "feat: Add all features"
git push origin main
```

2. **Deploy to Vercel:**
```bash
# Method 1: Using Vercel CLI (Recommended)
npm install -g vercel
vercel login
vercel

# Method 2: Via Website
# Go to https://vercel.com
# Click "Import Project"
# Connect GitHub
# Select your repository
# Click "Deploy"
```

3. **Configuration (Auto-detected):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

4. **Custom Domain (Optional):**
```
Go to Vercel Dashboard
→ Your Project → Settings → Domains
→ Add your custom domain
```

**Result:**
- Your site: `https://your-project.vercel.app`
- Auto-deploy on every push to main
- Free SSL, CDN, Analytics

---

### 🌟 **Option 2: Netlify**

**Why Netlify:**
```
✅ FREE for personal projects
✅ 100GB bandwidth/month
✅ Automatic deployments
✅ Form handling
✅ Serverless functions
✅ A/B testing
```

**Deployment Steps:**

1. **Deploy via CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

2. **Deploy via Website:**
```
1. Go to https://netlify.com
2. Click "Add new site" → "Import from Git"
3. Connect GitHub
4. Select repository
5. Build settings:
   - Build command: npm run build
   - Publish directory: dist
6. Click "Deploy"
```

**Result:**
- Your site: `https://your-project.netlify.app`
- Free custom domain
- Instant rollbacks

---

### 🔷 **Option 3: GitHub Pages**

**Why GitHub Pages:**
```
✅ Completely FREE
✅ Direct from GitHub
✅ Easy setup
✅ No signup needed (use GitHub account)
```

**Deployment Steps:**

1. **Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

2. **Update package.json:**
```json
{
  "homepage": "https://vatallus.github.io/wikigames-analytics",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update vite.config.ts:**
```typescript
export default defineConfig({
  base: '/wikigames-analytics/',  // Your repo name
  plugins: [react()],
})
```

4. **Deploy:**
```bash
npm run deploy
```

5. **Enable GitHub Pages:**
```
Go to GitHub repository
→ Settings → Pages
→ Source: gh-pages branch
→ Save
```

**Result:**
- Your site: `https://vatallus.github.io/wikigames-analytics`
- Updates on every `npm run deploy`

---

### ⚡ **Option 4: Render**

**Why Render:**
```
✅ FREE tier with static sites
✅ Auto-deploy from GitHub
✅ Custom domains
✅ SSL included
```

**Deployment Steps:**

1. **Go to https://render.com**
2. **Sign up with GitHub**
3. **New Static Site**
4. **Connect repository**
5. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Deploy**

**Result:**
- Your site: `https://your-project.onrender.com`
- Auto SSL & CDN

---

### 🔥 **Option 5: Firebase Hosting**

**Why Firebase:**
```
✅ FREE tier (10GB storage, 360MB/day transfer)
✅ Global CDN
✅ Custom domains
✅ Fast deployment
```

**Deployment Steps:**

1. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize Firebase:**
```bash
firebase init hosting

# Select:
# ✓ Use existing project or create new
# ✓ Public directory: dist
# ✓ Single-page app: Yes
# ✓ GitHub Actions: No (optional)
```

3. **Deploy:**
```bash
npm run build
firebase deploy
```

**Result:**
- Your site: `https://your-project.web.app`
- Free SSL & CDN

---

## 🏆 COMPARISON TABLE

| Platform | Free Tier | Build Time | Bandwidth | SSL | Custom Domain | Best For |
|----------|-----------|------------|-----------|-----|---------------|----------|
| **Vercel** | ✅ Unlimited | ⚡ Fast | 100GB | ✅ Yes | ✅ Free | React/Vite |
| **Netlify** | ✅ Unlimited | ⚡ Fast | 100GB | ✅ Yes | ✅ Free | Any framework |
| **GitHub Pages** | ✅ Unlimited | ⚡ Fast | 100GB | ✅ Yes | ✅ Free | Simple sites |
| **Render** | ✅ Free | 🐌 Slow | Limited | ✅ Yes | ✅ Free | Static sites |
| **Firebase** | ✅ 10GB | ⚡ Fast | 360MB/day | ✅ Yes | ✅ Free | Google ecosystem |

---

## 🎯 MY RECOMMENDATION

### **For Your Project → Use Vercel! 🥇**

**Reasons:**
1. ⚡ **Zero configuration** - Works instantly with Vite
2. 🚀 **Fastest deployment** - 30 seconds from push to live
3. 🔄 **Auto-deploy** - Every push to main = new deployment
4. 📊 **Analytics included** - Track visitors for free
5. 🌐 **Best CDN** - Fastest load times worldwide
6. 💯 **100% free** - No credit card needed

**Quick Deploy (2 minutes):**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy (from project root)
vercel

# 4. Follow prompts:
# - Link to existing project? No
# - What's your project's name? wikigames-analytics
# - In which directory is your code located? ./
# - Auto-detected settings? Yes

# Done! Your site is live! 🎉
```

---

## 📱 BACKEND SERVER DEPLOYMENT

Your project has a **Node.js backend** in `/server`. Here are options:

### **Option 1: Railway (Recommended for Backend)**

**Why Railway:**
```
✅ FREE $5 credit/month
✅ Zero configuration
✅ WebSocket support
✅ Auto-deploy from GitHub
```

**Deploy Backend:**
```bash
# 1. Go to https://railway.app
# 2. Sign up with GitHub
# 3. New Project → Deploy from GitHub
# 4. Select repository
# 5. Add service → Server folder
# 6. Environment variables:
#    PORT=3000
#    NODE_ENV=production
# 7. Deploy
```

### **Option 2: Render (Backend)**

**Deploy Backend:**
```bash
# 1. Go to https://render.com
# 2. New Web Service
# 3. Connect repository
# 4. Settings:
#    - Root directory: server
#    - Build: npm install
#    - Start: npm start
# 5. Deploy
```

### **Option 3: Fly.io**

**Deploy Backend:**
```bash
# 1. Install Fly CLI
brew install flyctl  # Mac
# or
curl -L https://fly.io/install.sh | sh  # Linux

# 2. Login
fly auth login

# 3. Launch (from /server directory)
cd server
fly launch

# 4. Deploy
fly deploy
```

---

## 🔗 FULL STACK DEPLOYMENT

**Best Setup:**

### **Frontend (Vercel):**
```bash
cd /Users/vatallus/wikigamesorg/wikigames-analytics
vercel
```

### **Backend (Railway):**
```bash
# Deploy via Railway dashboard
# Point to /server directory
```

### **Connect Frontend to Backend:**

Update frontend API URL:

```typescript
// src/services/apiService.ts
const API_URL = import.meta.env.PROD 
  ? 'https://your-backend.up.railway.app'  // Production
  : 'http://localhost:3000'                 // Development
```

Add to `.env.production`:
```bash
VITE_API_URL=https://your-backend.up.railway.app
```

---

## 🎨 DEPLOYMENT SCRIPT

Tạo file `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying WikiGames Analytics..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🎉 Your site is live!"
```

Make executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🔧 ENVIRONMENT VARIABLES

### **Frontend (.env.production):**
```bash
VITE_API_URL=https://your-backend.up.railway.app
VITE_WS_URL=wss://your-backend.up.railway.app
```

### **Backend (Railway/Render):**
```bash
NODE_ENV=production
PORT=3000
STEAM_API_KEY=your_steam_api_key
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

---

## 🎯 STEP-BY-STEP DEPLOYMENT

### **Complete Guide (15 minutes):**

**Step 1: Prepare Code**
```bash
# Make sure everything works locally
npm run dev

# Build to check for errors
npm run build

# Commit all changes
git add .
git commit -m "feat: Ready for deployment"
git push origin main
```

**Step 2: Deploy Frontend (Vercel)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Note the URL (e.g., https://wikigames-analytics.vercel.app)
```

**Step 3: Deploy Backend (Railway)**
```bash
# 1. Go to https://railway.app
# 2. New Project → Deploy from GitHub
# 3. Select repository
# 4. Add service → Point to /server
# 5. Add environment variables
# 6. Deploy

# Note the URL (e.g., https://wikigames-server.up.railway.app)
```

**Step 4: Connect Frontend to Backend**
```bash
# Update frontend API URL
# Create .env.production:
echo "VITE_API_URL=https://wikigames-server.up.railway.app" > .env.production

# Redeploy frontend
vercel --prod
```

**Step 5: Test**
```bash
# Visit your site
open https://wikigames-analytics.vercel.app

# Check real-time connection
# Open DevTools → Network → WS
# Should see WebSocket connection
```

---

## 🎉 RESULT

After deployment:

### **Your URLs:**
```
Frontend: https://wikigames-analytics.vercel.app
Backend:  https://wikigames-server.up.railway.app
```

### **Features Working:**
```
✅ Real-time data updates
✅ WebSocket connections
✅ Notifications
✅ Favorites
✅ All pages
✅ SSL/HTTPS
✅ Fast CDN
✅ Auto-deploy on push
```

---

## 🔄 CONTINUOUS DEPLOYMENT

### **Auto-Deploy Setup:**

Once deployed, every time you push to GitHub:
1. Vercel detects push
2. Automatically builds
3. Runs tests (if configured)
4. Deploys to production
5. Updates live site

**No manual work needed!**

---

## 💰 COST COMPARISON

| Platform | Frontend | Backend | Total/Month |
|----------|----------|---------|-------------|
| **Vercel + Railway** | FREE | FREE ($5 credit) | **$0** |
| **Netlify + Render** | FREE | FREE | **$0** |
| **Vercel + Fly.io** | FREE | FREE ($5 credit) | **$0** |
| **GitHub Pages + Railway** | FREE | FREE ($5 credit) | **$0** |

**All completely FREE for your traffic level! 🎉**

---

## 🚀 QUICK START (Fastest Way)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend (2 minutes)
vercel --prod

# 3. Deploy backend via Railway dashboard (3 minutes)
# Go to railway.app → Deploy from GitHub

# 4. Update API URL in frontend
# Add to .env.production

# 5. Redeploy frontend
vercel --prod

# DONE! Your site is live! 🎉
```

---

## 📊 POST-DEPLOYMENT

### **Monitor Your Site:**
```
Vercel Dashboard:  https://vercel.com/dashboard
Railway Dashboard: https://railway.app/dashboard
Analytics:         Built into Vercel
Logs:             Both platforms provide real-time logs
```

### **Custom Domain (Optional):**
```
1. Buy domain (e.g., wikigames.com from Namecheap)
2. Add to Vercel: Settings → Domains
3. Update DNS records
4. Wait for SSL (automatic)
```

---

## ✅ CHECKLIST

Before deployment:
- [ ] All code committed to GitHub
- [ ] Build works locally (`npm run build`)
- [ ] Environment variables prepared
- [ ] API endpoints configured
- [ ] CORS settings updated

After deployment:
- [ ] Site loads correctly
- [ ] All pages work
- [ ] WebSocket connects
- [ ] Notifications work
- [ ] Favorites persist
- [ ] No console errors

---

## 🎯 FINAL RECOMMENDATION

**For Your WikiGames Analytics Project:**

```
Frontend: Vercel (FREE, unlimited)
Backend:  Railway (FREE, $5 credit/month)

Total Cost: $0/month
Build Time: 15 minutes
Result:     Professional, fast, reliable website

Domain: wikigames-analytics.vercel.app (free)
or add custom domain: wikigames.com ($10/year)
```

**Deploy ngay bây giờ! Chỉ mất 15 phút! 🚀**

---

## 📞 SUPPORT

Need help?
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Netlify Docs: https://docs.netlify.com

---

**Bạn muốn tôi deploy ngay bây giờ không? Tôi có thể chạy commands! 🚀**
