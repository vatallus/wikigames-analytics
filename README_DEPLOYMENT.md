# 🚀 Deployment Guide - WikiGames.org

## Quick Deploy Options

### Option 1: Vercel (Recommended for Frontend)

**Frontend Deploy:**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Follow prompts:
# - Link to existing project or create new
# - Select wikigames project
# - Deploy!
```

**Custom Domain (wikigames.org):**
1. Go to Vercel Dashboard → Settings → Domains
2. Add `wikigames.org`
3. Configure DNS records at your domain registrar:
   - Type: `A`, Name: `@`, Value: `76.76.21.21`
   - Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`

### Option 2: Railway (Backend Server)

**Backend Deploy:**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy from server folder
cd server
railway up
```

**Environment Variables on Railway:**
- `PORT`: 3001
- `NODE_ENV`: production
- `RAWG_API_KEY`: (optional) your RAWG key
- `TWITCH_CLIENT_ID`: (optional)
- `TWITCH_CLIENT_SECRET`: (optional)

### Option 3: GitHub Pages (Frontend Only)

Already configured! Just push to main:
```bash
git push origin main
```

GitHub Actions will auto-deploy to: `https://yourusername.github.io/wikigames`

## DNS Configuration for wikigames.org

### Namecheap / GoDaddy / Other Registrars

**A Records:**
```
Type: A
Host: @
Value: 76.76.21.21 (Vercel)
TTL: Automatic
```

**CNAME Records:**
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

### Cloudflare (Recommended)

1. Add wikigames.org to Cloudflare
2. Update nameservers at registrar
3. Add DNS records:
   - A record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`
4. Enable:
   - SSL/TLS: Full
   - Always Use HTTPS: On
   - Auto Minify: HTML, CSS, JS
   - Brotli compression: On

## Full Stack Deploy Architecture

```
wikigames.org (Frontend - Vercel)
    │
    ├── Real-time Data
    │   └── api.wikigames.org (Backend - Railway)
    │       ├── Steam API
    │       ├── RAWG API (optional)
    │       └── WebSocket Server
    │
    └── Static Assets (Vercel CDN)
```

## Environment Setup

### Frontend (.env for production)
```bash
# Create .env.production
VITE_API_URL=https://api.wikigames.org
VITE_WS_URL=wss://api.wikigames.org
```

### Backend (Railway environment)
```bash
PORT=3001
NODE_ENV=production
RAWG_API_KEY=your_key_here
CORS_ORIGIN=https://wikigames.org
```

## Post-Deploy Checklist

### Frontend (wikigames.org)
- [ ] SSL certificate active (https://)
- [ ] Custom domain pointing correctly
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Meta tags loading correctly
- [ ] Open Graph images working
- [ ] Dark mode functioning
- [ ] Map loading correctly

### Backend (api.wikigames.org)
- [ ] Health endpoint: `GET /health` returns OK
- [ ] API endpoint: `GET /api/data` returns data
- [ ] WebSocket connecting
- [ ] CORS configured for wikigames.org
- [ ] Steam API data updating
- [ ] Auto-refresh working (30s)

### SEO & Performance
- [ ] Google Search Console verified
- [ ] Submit sitemap to Google
- [ ] Lighthouse score > 90
- [ ] PageSpeed Insights optimized
- [ ] Social media preview working
- [ ] Analytics installed (optional)

## Monitoring

### Setup Monitoring (Free)

**UptimeRobot:**
```
Monitor 1: https://wikigames.org
Monitor 2: https://api.wikigames.org/health
Interval: 5 minutes
```

**Better Stack (formerly Logtail):**
- Free tier: 1GB logs/month
- Real-time error tracking
- Performance monitoring

## Maintenance

### Update Content
```bash
# Update game info
cd server/src/services
# Edit steamService.ts to add new games

# Redeploy
railway up
```

### Update Frontend
```bash
# Make changes
git add .
git commit -m "Update: feature description"
git push origin main

# Auto-deploys via Vercel/GitHub Actions
```

## Cost Breakdown (Production)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | $0/month |
| Railway | Starter | $5/month (500 hours) |
| Cloudflare | Free | $0/month |
| Domain | Annual | ~$12/year |
| **Total** | | **~$5/month** |

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month
- **Railway**: 500 hours/month (enough for 1 service)
- **Cloudflare**: Unlimited bandwidth
- **Steam API**: Unlimited requests
- **RAWG API**: 20,000 requests/month

## Troubleshooting

### "Cannot connect to backend"
- Check Railway logs: `railway logs`
- Verify CORS settings in backend
- Test API directly: `curl https://api.wikigames.org/health`

### "Domain not resolving"
- DNS propagation takes 24-48 hours
- Use https://dnschecker.org to verify
- Clear browser cache

### "WebSocket not connecting"
- Check if Railway supports WebSocket (it does)
- Verify WS URL uses `wss://` not `ws://`
- Check browser console for errors

## Performance Optimization

### Frontend
```bash
# Already optimized:
✓ Code splitting
✓ Tree shaking
✓ Minification
✓ Gzip compression
```

### Backend
```bash
# Cache optimization (30s)
# WebSocket for real-time
# Efficient API calls
```

## Security

### Headers (already configured)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- HTTPS enforced
- CORS restricted

### API Keys
- Never commit .env files
- Use Railway environment variables
- Rotate keys periodically

## Support

Issues? Check:
1. Railway logs: `railway logs`
2. Vercel deployment logs
3. Browser DevTools console
4. Network tab for API calls

---

**🎉 Your app is ready for production!**

wikigames.org - Fast, free, and scalable gaming analytics.
