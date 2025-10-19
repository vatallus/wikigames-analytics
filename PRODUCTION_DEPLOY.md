# 🚀 Production Deployment Guide

## ✅ Status Overview

| Component | Platform | Status | URL |
|-----------|----------|--------|-----|
| **Frontend** | Vercel | ✅ Deployed | https://wikigames-analytics-hy2cq7tz4-vatallus-projects.vercel.app |
| **Backend** | Railway | 🔄 Ready | To be deployed |
| **Database** | Railway PostgreSQL | 🔄 Ready | Auto-provisioned |
| **Redis** | Upstash | 🔄 Optional | Free tier available |

---

## 📋 Prerequisites

- [x] Code pushed to GitHub
- [x] Vercel CLI installed
- [x] Railway CLI installed
- [ ] Railway account created (https://railway.app)
- [ ] Database migrations tested locally

---

## Part 1: Deploy Backend to Railway

### **Step 1: Login to Railway**

```bash
railway login
```

This will open a browser for authentication.

### **Step 2: Create New Project**

```bash
cd /Users/vatallus/wikigamesorg/wikigames-analytics
railway init
```

Follow the prompts:
- **Project name**: `wikigames-analytics`
- **Start from**: `Empty Project`

### **Step 3: Add PostgreSQL Database**

```bash
railway add --database postgres
```

Railway will automatically:
- ✅ Create PostgreSQL database
- ✅ Set `DATABASE_URL` environment variable
- ✅ Connect to your service

### **Step 4: Set Environment Variables**

```bash
# Set production environment
railway variables set NODE_ENV=production

# Set port (Railway auto-assigns, but we can use 3001)
railway variables set PORT=3001

# Optional: Add Redis (Upstash recommended for free tier)
# railway variables set REDIS_HOST=your-redis.upstash.io
# railway variables set REDIS_PORT=6379
# railway variables set REDIS_PASSWORD=your-password

# Optional: API keys
# railway variables set RAWG_API_KEY=your_rawg_key
```

### **Step 5: Link to GitHub Repository**

```bash
railway link
```

Select your `wikigames-analytics` repository.

### **Step 6: Deploy!**

```bash
railway up
```

This will:
1. Build the backend
2. Run Prisma migrations
3. Start the server
4. Assign a public URL

### **Step 7: Get Your Backend URL**

```bash
railway domain
```

Example output: `wikigames-analytics-production.up.railway.app`

---

## Part 2: Update Frontend Environment Variables

### **Option A: Via Vercel Dashboard**

1. Go to https://vercel.com/vatallus-projects/wikigames-analytics
2. Click **Settings** → **Environment Variables**
3. Add/Update:
   ```
   VITE_API_URL=https://your-backend.railway.app
   VITE_WS_URL=wss://your-backend.railway.app
   ```
4. Click **Save**
5. Go to **Deployments** → **Redeploy**

### **Option B: Via Vercel CLI**

```bash
vercel env add VITE_API_URL production
# Enter: https://your-backend.railway.app

vercel env add VITE_WS_URL production
# Enter: wss://your-backend.railway.app

# Redeploy
vercel --prod
```

---

## Part 3: Configure CORS on Backend

Make sure backend allows frontend domain. Update `server/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://wikigames-analytics-hy2cq7tz4-vatallus-projects.vercel.app',
    'https://wikigames-analytics.vercel.app', // Custom domain if you have one
    /\.vercel\.app$/ // Allow all Vercel preview deployments
  ],
  credentials: true
}))
```

Commit and push changes, Railway will auto-redeploy.

---

## Part 4: Testing Production

### **Test Backend Health**

```bash
curl https://your-backend.railway.app/health
# Expected: {"status":"ok","uptime":123.456,"clients":0}
```

### **Test Backend API**

```bash
curl https://your-backend.railway.app/api/stats
# Expected: {"success":true,"data":{...}}
```

### **Test Frontend**

1. Open: https://wikigames-analytics-hy2cq7tz4-vatallus-projects.vercel.app
2. Check that "Mock Data - Offline" badge is **gone**
3. Verify real-time data is loading
4. Check WebSocket connection in browser DevTools

---

## Part 5: Database Migrations

Railway will automatically run migrations on deploy, but you can also run manually:

```bash
railway run npx prisma migrate deploy
```

To check database:

```bash
railway run npx prisma studio
```

---

## 🔧 Troubleshooting

### Backend Not Starting

```bash
# Check logs
railway logs

# Common issues:
# - DATABASE_URL not set → Add PostgreSQL plugin
# - Build failed → Check package.json scripts
# - Migration failed → Run manually: railway run npx prisma migrate deploy
```

### CORS Errors

Update `server/src/index.ts` to include your Vercel domain in CORS origins.

### WebSocket Connection Failed

Make sure:
1. Backend uses `wss://` (secure WebSocket)
2. Railway provides SSL automatically
3. Frontend uses correct `VITE_WS_URL`

### Database Connection Issues

```bash
# Check DATABASE_URL
railway variables

# Reset database (⚠️ WARNING: Deletes all data)
railway service delete postgres
railway add --database postgres
railway run npx prisma migrate deploy
```

---

## 📊 Monitoring & Logs

### View Backend Logs

```bash
railway logs --follow
```

### View Metrics

```bash
railway status
```

Or visit Railway Dashboard: https://railway.app/dashboard

### Vercel Analytics

Visit: https://vercel.com/vatallus-projects/wikigames-analytics/analytics

---

## 💰 Cost Estimation

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| **Vercel** | 100GB bandwidth/month | $0 |
| **Railway** | $5 credit/month (~500 hours) | $0-5/month |
| **PostgreSQL** | Included in Railway | $0 |
| **Upstash Redis** | 10k requests/day | $0 |

**Total**: **$0-5/month** 🎉

---

## 🎯 Next Steps

### **1. Custom Domain** (Optional)

**Vercel:**
```bash
vercel domains add wikigames.org
```

**Railway:**
- Go to Railway Dashboard → Settings → Domains
- Add custom domain: `api.wikigames.org`

### **2. SSL Certificates**

Both Vercel and Railway provide **automatic SSL** certificates!

### **3. Environment Separation**

Create separate Railway projects for:
- `wikigames-analytics-staging`
- `wikigames-analytics-production`

### **4. Monitoring & Alerts**

Add services:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Better Stack** - Uptime monitoring

---

## 📝 Deployment Checklist

### Backend (Railway)
- [ ] Railway account created
- [ ] Project initialized
- [ ] PostgreSQL database added
- [ ] Environment variables set
- [ ] GitHub linked
- [ ] Deployed successfully
- [ ] Health endpoint working
- [ ] Database migrations applied
- [ ] CORS configured

### Frontend (Vercel)
- [x] Code committed and pushed
- [x] Deployed to production
- [ ] Environment variables updated with Railway URL
- [ ] Redeployed with new env vars
- [ ] "Server Offline" badge removed
- [ ] Real-time data working

### Testing
- [ ] Frontend loads without errors
- [ ] Backend API responding
- [ ] WebSocket connection working
- [ ] Database queries working
- [ ] No CORS errors
- [ ] Mobile responsive

---

## 🚀 Quick Deploy Commands

```bash
# Full production deployment
cd /Users/vatallus/wikigamesorg/wikigames-analytics

# 1. Commit changes
git add -A
git commit -m "Production ready"
git push origin main

# 2. Deploy frontend
vercel --prod

# 3. Deploy backend
railway up

# 4. Update frontend env vars (get Railway URL first)
railway domain
vercel env add VITE_API_URL production
# Enter Railway URL

# 5. Redeploy frontend with new env vars
vercel --prod

# 6. Test
curl $(railway domain)/health
```

---

## ✅ Success Indicators

When everything is working:

```
✅ Frontend: https://wikigames-analytics.vercel.app
✅ Backend: https://wikigames-analytics-production.up.railway.app
✅ Database: Connected via Railway PostgreSQL
✅ WebSocket: Real-time updates working
✅ No "Server Offline" message
✅ All API endpoints responding
✅ HTTPS/WSS secure connections
```

---

## 🆘 Support

If you encounter issues:

1. **Check logs**: `railway logs --follow`
2. **Check Vercel deployment logs**: Vercel Dashboard
3. **Test locally first**: Ensure local dev works
4. **Check documentation**: 
   - Railway: https://docs.railway.app
   - Vercel: https://vercel.com/docs
5. **Environment variables**: Make sure all required vars are set

---

**Last Updated**: October 19, 2025

🎉 **Your WikiGames Analytics is now LIVE in production!** 🎉
