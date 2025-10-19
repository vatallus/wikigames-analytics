# 🚂 Deploy Backend to Railway - Dashboard Guide

Hướng dẫn deploy backend lên Railway qua Dashboard (dễ nhất!)

---

## Bước 1: Truy cập Railway Dashboard

1. Mở: https://railway.com/project/88b8ea0e-237f-48b7-a8ad-4852cfd511c5
2. Đăng nhập nếu chưa (đã login với email: hacuong.1751992@gmail.com)

---

## Bước 2: Thêm PostgreSQL Database

1. Click nút **"+ New"** (góc trên bên phải)
2. Chọn **"Database"**
3. Chọn **"Add PostgreSQL"**
4. Railway sẽ tự động:
   - ✅ Tạo database
   - ✅ Tạo `DATABASE_URL` environment variable
   - ✅ Kết nối với service của bạn

---

## Bước 3: Deploy Backend từ GitHub

1. Click nút **"+ New"** lại
2. Chọn **"GitHub Repo"**
3. Chọn repository: **`wikigames-analytics`**
4. Railway sẽ tự động detect và build

### Configure Service Settings:

Sau khi service được tạo, click vào service → **Settings**:

#### **Root Directory**
```
server
```

#### **Build Command** (nếu cần custom)
```bash
npm install && npx prisma generate && npm run build
```

#### **Start Command**
```bash
npx prisma migrate deploy && npm start
```

#### **Health Check Path**
```
/health
```

---

## Bước 4: Set Environment Variables

Click vào Backend service → **Variables** tab:

Thêm các biến sau:

```env
NODE_ENV=production
PORT=3001
```

**DATABASE_URL** sẽ tự động được set khi bạn add PostgreSQL.

### Optional Variables:

```env
# Redis (nếu bạn muốn dùng Upstash)
REDIS_HOST=your-redis.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-password

# API Keys (optional)
RAWG_API_KEY=your_rawg_key_here
```

---

## Bước 5: Trigger Deploy

1. Click **"Deploy"** button
2. Hoặc Railway sẽ auto-deploy khi bạn push code lên GitHub

### Monitor Deploy:

- Click vào **"Deployments"** tab để xem logs
- Chờ đến khi thấy: ✅ **Success**

---

## Bước 6: Get Public URL

1. Click vào Backend service
2. Click **"Settings"**
3. Scroll xuống **"Networking"**
4. Click **"Generate Domain"**

Railway sẽ tạo domain như: `wikigame-production.up.railway.app`

Copy URL này!

---

## Bước 7: Test Backend

Mở browser hoặc dùng curl:

```bash
# Health check
curl https://your-backend.railway.app/health

# API stats
curl https://your-backend.railway.app/api/stats
```

Nếu thấy response JSON → ✅ Backend đang chạy!

---

## Bước 8: Update Frontend Environment Variables

### Via Vercel Dashboard:

1. Mở: https://vercel.com/vatallus-projects/wikigames-analytics
2. Click **Settings** → **Environment Variables**
3. Add hoặc Update:

```env
VITE_API_URL=https://your-backend.railway.app
VITE_WS_URL=wss://your-backend.railway.app
```

4. Click **Save**

### Redeploy Frontend:

1. Go to **Deployments** tab
2. Click vào deployment mới nhất
3. Click **"Redeploy"**

Hoặc dùng CLI:

```bash
vercel --prod
```

---

## Bước 9: Test Production

1. Mở: https://wikigames-analytics-hy2cq7tz4-vatallus-projects.vercel.app
2. **Kiểm tra:**
   - ❌ Badge "Mock Data - Offline" phải biến mất
   - ✅ Dữ liệu real-time load từ Steam API
   - ✅ WebSocket connection working (check DevTools)
   - ✅ Analytics charts hiển thị data thật

---

## Bước 10: Setup Auto-Deploy (Optional)

Railway tự động deploy khi bạn push code lên GitHub!

Để tắt auto-deploy:
1. Service → **Settings**
2. **Source** section
3. Toggle **"Auto Deploy"** off

---

## 🎯 Checklist Hoàn Thành

### Railway Backend:
- [ ] PostgreSQL database added
- [ ] Backend service deployed from GitHub
- [ ] Root directory set to `server`
- [ ] Environment variables configured
- [ ] Health check passing
- [ ] Public domain generated
- [ ] Database migrations ran successfully

### Vercel Frontend:
- [ ] Environment variables updated
- [ ] Redeployed with new backend URL
- [ ] "Server Offline" message gone
- [ ] Real-time data loading
- [ ] WebSocket connected

---

## 🔧 Troubleshooting

### Build Failed

**Check Logs:**
- Railway Dashboard → Service → **Deployments** → Click failed deployment

**Common Issues:**
- Missing dependencies → Check `package.json`
- Prisma generate failed → Check `prisma/schema.prisma`
- Port conflict → Use `PORT=3001` in env vars

### Database Connection Failed

**Check:**
1. PostgreSQL service is running (green status)
2. `DATABASE_URL` variable exists in backend service
3. Run migrations manually:
   - Railway Dashboard → Service → Click **"..."** menu
   - Select **"Run a Command"**
   - Enter: `npx prisma migrate deploy`

### CORS Errors

Update `server/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://wikigames-analytics-hy2cq7tz4-vatallus-projects.vercel.app',
    /\.vercel\.app$/ // Allow all Vercel domains
  ]
}))
```

Commit & push → Railway auto-redeploys.

---

## 📊 View Logs

### Real-time Logs:

1. Railway Dashboard
2. Click Backend service
3. Click **"View Logs"**

### Download Logs:

Click **"..."** menu → **"Download Logs"**

---

## 💰 Cost

**Free Tier:**
- $5 credit/month
- ~500 hours of runtime
- Should be enough for development!

**Monitor Usage:**
- Dashboard → **"Usage"** tab

---

## 🚀 Success!

Khi mọi thứ hoạt động:

```
✅ Frontend: https://wikigames-analytics.vercel.app
✅ Backend: https://wikigame-production.up.railway.app
✅ Database: PostgreSQL on Railway
✅ No "Server Offline" message
✅ Real-time data streaming
✅ WebSocket connected
```

---

## 📸 Screenshots Guide

### Add PostgreSQL:
![Add Database](https://railway.app/blog/content/images/2023/02/add-postgres.png)

### Deploy from GitHub:
![Deploy GitHub](https://railway.app/blog/content/images/2023/02/deploy-github.png)

### Generate Domain:
![Generate Domain](https://railway.app/blog/content/images/2023/02/generate-domain.png)

---

## 🆘 Need Help?

1. **Check Railway Docs**: https://docs.railway.app
2. **Railway Discord**: https://discord.gg/railway
3. **Check backend logs** in Railway Dashboard
4. **Check Vercel logs** in Vercel Dashboard

---

**Thời gian ước tính**: 10-15 phút để deploy hoàn toàn!

🎉 **Chúc bạn deploy thành công!** 🎉
