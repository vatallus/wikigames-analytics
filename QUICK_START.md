# 🚀 Quick Start Guide - WikiGames

## TL;DR - Chạy ngay trong 2 phút!

### Bước 1: Frontend (Mock Data)
```bash
npm install
npm run dev
```
✅ Xong! Mở http://localhost:5173

### Bước 2: Backend (Real-time Data - Optional nhưng nên làm!)

**Terminal mới:**
```bash
cd server
npm install
npm run dev
```
✅ Backend chạy tại http://localhost:3001

Reload frontend và bạn sẽ thấy **🔴 LIVE** badge với data thật từ Steam API!

---

## 📊 Nguồn Data MIỄN PHÍ

### ✅ Đang dùng (100% Free, No API Key)

**Steam API** - Real-time player counts
- CS:GO: ~800K-1M players
- Dota 2: ~400K-600K players  
- PUBG: ~200K-400K players
- Rust, TF2, Apex Legends

**Update frequency:** Mỗi 30 giây tự động
**Cost:** $0
**Rate limit:** Không giới hạn

### 🔜 Có thể thêm (Optional - Vẫn miễn phí)

1. **Twitch API** - Xem game nào đang hot qua viewership
   - Đăng ký: https://dev.twitch.tv/
   - Free tier: Rất đủ dùng
   
2. **RAWG API** - Game metadata (500K+ games)
   - 20,000 requests/month miễn phí
   - Không cần credit card

---

## 💰 Cost Breakdown

| Item | Cost |
|------|------|
| Steam API | **$0** (Unlimited) |
| Development | **$0** (localhost) |
| Production Hosting | **$0** (Railway/Render free tier) |
| Database | **$0** (In-memory cache) |
| **TOTAL** | **$0/month** |

---

## 🎯 Features

### ✅ Có sẵn ngay
- Interactive world map với 15+ quốc gia
- Real-time player counts từ Steam
- WebSocket auto-updates (30s)
- Dark mode
- Game filtering (name/type)
- Zoom & pan map
- Responsive UI

### 🔜 Dễ thêm
- Historical charts
- More Steam games (chỉ cần thêm App ID)
- Twitch integration
- Mobile app

---

## 🐛 Troubleshooting

### "Backend Server Not Running" banner?

**Nguyên nhân:** Bạn chưa start backend server

**Fix:**
```bash
# Terminal mới
cd server
npm install    # Lần đầu tiên
npm run dev
```

### Frontend vẫn không connect?

**Check:**
```bash
# Test backend
curl http://localhost:3001/health

# Kết quả mong đợi:
# {"status":"ok","uptime":123.45,"clients":0}
```

### Muốn thêm game mới?

1. Tìm Steam App ID: https://steamdb.info/
2. Edit `server/src/services/steamService.ts`
3. Thêm vào `STEAM_GAMES` object:
```typescript
'game-id': { appId: '123456', name: 'Game Name' }
```
4. Restart server

---

## 📈 Data Flow

```
Steam API (free, no key)
    ↓
Backend aggregator (30s refresh)
    ↓
WebSocket broadcast
    ↓
Frontend auto-update
```

**Không cần:**
- ❌ Database
- ❌ API keys (cho Steam)
- ❌ Paid subscriptions
- ❌ Credit card

**Cần:**
- ✅ Internet connection
- ✅ Node.js 16+
- ✅ 2 terminal windows

---

## 🎨 Customize

### Thay đổi update frequency

`server/src/index.ts` line 158:
```typescript
// Từ 30s sang 60s
cron.schedule('*/60 * * * * *', async () => {
```

### Thêm countries

`src/data/mockData.ts` - thêm vào `COUNTRY_DATA` array

### Thay đổi colors

`src/index.css` - edit CSS variables

---

## 📚 API Examples

### REST API

```bash
# Tất cả data
curl http://localhost:3001/api/data

# 1 game
curl http://localhost:3001/api/games/csgo

# 1 country
curl http://localhost:3001/api/countries/USA

# Force refresh
curl -X POST http://localhost:3001/api/refresh
```

### WebSocket (JavaScript)

```javascript
const ws = new WebSocket('ws://localhost:3001')

ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data)
  console.log('Received:', type, data)
}
```

---

## 🚢 Deploy Production

### Frontend → Vercel (Free)
```bash
npm run build
# Kéo thả folder dist/ vào Vercel
```

### Backend → Railway (Free)
```bash
# 1. Push code lên GitHub
# 2. Connect repo tại railway.app
# 3. Xong!
```

**Free tier limits:**
- Railway: 500 hours/month (Đủ cho 1 project)
- Vercel: Unlimited

---

## 🎓 Learning Resources

### Muốn hiểu cách hoạt động?

1. **Steam API**: `server/src/services/steamService.ts`
2. **WebSocket**: `server/src/index.ts` (line 20-50)
3. **Data aggregation**: `server/src/services/dataAggregator.ts`
4. **Frontend hook**: `src/hooks/useRealTimeData.ts`

### Muốn extend?

- Add Twitch: Template sẵn trong `server/src/services/twitchService.ts`
- Add database: Thay in-memory cache bằng Redis
- Add auth: JWT middleware cho Express
- Add more games: Chỉ cần Steam App ID

---

## ✨ Tips

1. **Development**: Dùng 2 terminal tabs cho frontend + backend
2. **Testing**: Kiểm tra http://localhost:3001/health trước
3. **Debugging**: Mở browser DevTools → Network tab để xem WebSocket
4. **Performance**: Backend cache 30s, không spam Steam API
5. **Free forever**: Tất cả APIs dùng đều free tier

---

**Have fun! 🎮**

Nếu gặp vấn đề gì, check:
1. README.md - Full documentation
2. server/README.md - Backend specific
3. GitHub Issues - Report bugs
