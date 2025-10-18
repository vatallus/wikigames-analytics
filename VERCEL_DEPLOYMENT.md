# 🚀 Deployment Guide - Vercel + Railway

## 📋 Overview

**Architecture:**
- **Frontend** → Vercel (Free tier) ✅
- **Backend** → Railway (Free $5 credit/month) ✅
- **Database** → Railway PostgreSQL (Free) ✅
- **Redis** → Upstash (Free tier) ✅

---

## Part 1: Deploy Frontend to Vercel

### **Step 1: Prepare Frontend**

```bash
# Make sure build works locally
npm run build

# Should see dist/ folder
```

### **Step 2: Deploy to Vercel**

**Option A: Via Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /Users/vatallus/wikigamesorg/wikigames-analytics
vercel

# Follow prompts:
? Set up and deploy? Yes
? Which scope? Your account
? Link to existing project? No
? Project name? wikigames-analytics
? In which directory is your code? ./
? Want to override settings? No

# Deploy to production
vercel --prod
```

**Option B: Via Vercel Dashboard**

1. Go to https://vercel.com/new
2. Import Git Repository
3. Select `wikigames-analytics`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.railway.app
   VITE_WS_URL=wss://your-backend.railway.app
   ```
6. Click **Deploy**

### **Step 3: Get Deployment URL**

After deployment, you'll get:
```
https://wikigames-analytics.vercel.app
```

---

## Part 2: Deploy Backend to Railway

### **Step 1: Sign Up for Railway**

1. Go to https://railway.app
2. Sign in with GitHub
3. Get $5 free credit (enough for 1 month)

### **Step 2: Create New Project**

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Select `wikigames-analytics` repository
4. Railway will detect it's a monorepo

### **Step 3: Configure Backend Service**

**Settings:**
- **Root Directory:** `/server`
- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `npm start`
- **Watch Paths:** `/server/**`

**Environment Variables:**
```env
PORT=3001
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
RAWG_API_KEY=your_rawg_key
```

### **Step 4: Add PostgreSQL Database**

1. In your Railway project, click **New**
2. Select **Database** → **PostgreSQL**
3. Railway will auto-create and link database
4. DATABASE_URL will be auto-set

### **Step 5: Add Redis**

**Option A: Railway Redis (Paid)**
- Click **New** → **Database** → **Redis**
- Auto-configured

**Option B: Upstash (FREE!)**

1. Go to https://upstash.com
2. Create account
3. Create Redis database
4. Copy credentials:
   ```env
   REDIS_HOST=your-redis.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=your-password
   ```
5. Add to Railway environment variables

### **Step 6: Run Database Migration**

In Railway dashboard:

1. Go to your backend service
2. Click **Settings** → **Deploy**
3. Add **Deploy Command:**
   ```bash
   npx prisma migrate deploy
   ```

Or manually via Railway CLI:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migration
railway run npx prisma migrate deploy
```

### **Step 7: Deploy**

Railway will auto-deploy. Check logs:
```bash
railway logs
```

Expected output:
```
✅ Redis connected
🚀 WikiGames Server Running!
📡 REST API: https://your-app.railway.app
```

### **Step 8: Get Backend URL**

Railway will give you:
```
https://wikigames-analytics-production.up.railway.app
```

---

## Part 3: Connect Frontend to Backend

### **Update Vercel Environment Variables**

1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update:
   ```env
   VITE_API_URL=https://your-backend.railway.app
   VITE_WS_URL=wss://your-backend.railway.app
   ```
5. **Redeploy** frontend

---

## Part 4: Configure API Service

Update `src/services/apiService.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
```

Already configured! ✅

---

## Part 5: Setup Custom Domain (Optional)

### **For Vercel (Frontend):**

1. Go to **Settings** → **Domains**
2. Add your domain: `wikigames.org`
3. Add DNS records:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### **For Railway (Backend):**

1. Go to **Settings** → **Domains**
2. Click **Generate Domain**
3. Get: `api.wikigames.org`
4. Add CNAME record:
   ```
   Type: CNAME
   Name: api
   Value: your-app.up.railway.app
   ```

---

## 📊 Cost Breakdown

### **Free Tier Limits:**

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| **Vercel** | 100GB bandwidth/month | $20/month |
| **Railway** | $5 credit/month (~500 hours) | $5-20/month |
| **PostgreSQL** | Included in Railway | Included |
| **Upstash Redis** | 10k requests/day | $0.20/100k |

**Total monthly cost:** $0 (within free tiers) → $5-25 after

---

## 🧪 Testing Production

### **1. Test Frontend:**
```bash
curl https://wikigames-analytics.vercel.app
# Should return HTML
```

### **2. Test Backend API:**
```bash
curl https://your-backend.railway.app/health
# Should return: {"status":"ok","uptime":123}

curl https://your-backend.railway.app/api/data
# Should return JSON with game data
```

### **3. Test WebSocket:**
```javascript
// In browser console
const ws = new WebSocket('wss://your-backend.railway.app')
ws.onopen = () => console.log('Connected!')
ws.onmessage = (e) => console.log('Data:', JSON.parse(e.data))
```

---

## 🔧 Troubleshooting

### **Frontend not loading:**
```bash
# Check Vercel logs
vercel logs

# Common issues:
- Wrong API_URL in env vars
- Build failed (check build logs)
- Environment variables not set
```

### **Backend not responding:**
```bash
# Check Railway logs
railway logs

# Common issues:
- Database migration not run
- Redis connection failed (non-critical)
- Environment variables missing
```

### **CORS errors:**

Update `server/src/index.ts`:
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://wikigames-analytics.vercel.app',
    'https://your-custom-domain.com'
  ]
}))
```

### **WebSocket connection failed:**

Make sure Railway service is using **wss://** (secure WebSocket):
- Railway auto-provides SSL
- Update frontend to use `wss://` not `ws://`

---

## 📈 Monitoring

### **Vercel:**
- Dashboard → Analytics
- Real-time visitor stats
- Performance metrics

### **Railway:**
- Dashboard → Metrics
- CPU/Memory usage
- Request logs
- Database connections

### **Upstash:**
- Dashboard → Metrics  
- Redis operations
- Cache hit rate

---

## 🚀 CI/CD (Auto-Deploy)

**Already configured!** ✅

Every `git push` will trigger:
1. **Vercel** auto-deploys frontend from `main` branch
2. **Railway** auto-deploys backend from `main` branch

**To disable auto-deploy:**
- Vercel: Settings → Git → Disable
- Railway: Settings → Deploys → Manual

---

## ✅ Deployment Checklist

### **Before Deploy:**
- [x] Code committed to Git
- [x] Environment variables documented
- [x] Database schema ready
- [x] Build tested locally
- [x] CORS configured

### **Frontend (Vercel):**
- [ ] Project created
- [ ] GitHub connected
- [ ] Environment variables set
- [ ] First deployment successful
- [ ] Custom domain added (optional)

### **Backend (Railway):**
- [ ] Project created
- [ ] Root directory set to `/server`
- [ ] PostgreSQL database added
- [ ] Redis configured (Upstash)
- [ ] Database migration run
- [ ] Environment variables set
- [ ] First deployment successful

### **Integration:**
- [ ] Frontend can reach backend API
- [ ] WebSocket connection works
- [ ] Database queries working
- [ ] Redis cache working (optional)

---

## 🎉 Success!

Your app is now live at:
- **Frontend:** https://wikigames-analytics.vercel.app
- **Backend:** https://your-app.railway.app
- **Admin:** https://your-app.railway.app/health

---

## 📝 Post-Deployment

1. **Add monitoring** (optional):
   - Sentry for error tracking
   - LogRocket for session replay
   - Google Analytics

2. **Setup backups:**
   - Railway auto-backups database
   - Export critical data weekly

3. **Performance:**
   - Monitor Vercel Analytics
   - Check Railway metrics
   - Optimize slow queries

---

**Need help?** Check logs:
```bash
# Vercel
vercel logs --follow

# Railway
railway logs --follow
```

🚀 **Your WikiGames is now LIVE!** 🎉
