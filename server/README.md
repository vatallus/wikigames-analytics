# WikiGames Server - Free Data Aggregator

Backend server tổng hợp dữ liệu game từ nhiều nguồn API **MIỄN PHÍ**.

## 🎯 Nguồn Dữ Liệu Miễn Phí

### ✅ Steam API (Đang dùng)
- **Cost**: Hoàn toàn miễn phí
- **No API key required** cho player counts
- **Games**: CS:GO, Dota 2, PUBG, Rust, TF2, Apex Legends
- **Data**: Real-time player counts
- **Rate limit**: Không giới hạn
- **Update frequency**: Mỗi 30 giây

### 🔜 Có thể thêm (Tất cả miễn phí)

1. **Twitch API** - Viewer counts (popularity indicator)
2. **RAWG API** - Game metadata (20,000 requests/month free)
3. **GitHub Gaming Stats** - Community-sourced data
4. **SteamCharts** - Historical data (web scraping)

## 🚀 Quick Start

### 1. Cài đặt
```bash
cd server
npm install
```

### 2. Cấu hình (Optional)
```bash
cp .env.example .env
# Edit .env nếu muốn thêm Twitch/RAWG API
```

### 3. Chạy server
```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3001`

## 📡 API Endpoints

### REST API

```bash
# Lấy tất cả data
GET http://localhost:3001/api/data

# Lấy data của 1 game
GET http://localhost:3001/api/games/csgo

# Lấy data của 1 quốc gia
GET http://localhost:3001/api/countries/USA

# Lấy thống kê global
GET http://localhost:3001/api/stats

# Force refresh data
POST http://localhost:3001/api/refresh

# Health check
GET http://localhost:3001/health
```

### WebSocket

```javascript
const ws = new WebSocket('ws://localhost:3001')

ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data)
  
  if (type === 'initial') {
    console.log('Initial data:', data)
  } else if (type === 'update') {
    console.log('Real-time update:', data)
  }
}
```

## 🔄 Automatic Updates

Server tự động update data mỗi **30 giây** và broadcast qua WebSocket đến tất cả clients.

## 📊 Response Format

```typescript
{
  "success": true,
  "data": {
    "games": [
      {
        "gameId": "csgo",
        "gameName": "Counter-Strike: Global Offensive",
        "currentPlayers": 850000,
        "peakPlayers24h": 1100000,
        "trend": "stable",
        "lastUpdate": "2024-10-16T14:20:00Z",
        "sources": ["Steam API"]
      }
    ],
    "countries": [
      {
        "countryCode": "USA",
        "countryName": "United States",
        "games": {
          "csgo": {
            "playerCount": 153000,
            "playRate": 18.0
          }
        },
        "totalPlayers": 850000,
        "lastUpdate": "2024-10-16T14:20:00Z"
      }
    ],
    "globalStats": {
      "totalPlayers": 5000000,
      "activeGames": 6,
      "lastUpdate": "2024-10-16T14:20:00Z"
    }
  }
}
```

## 💰 Cost Breakdown

| Service | Cost | Rate Limit | Data Quality |
|---------|------|------------|--------------|
| Steam API | **FREE** | Unlimited | ⭐⭐⭐⭐⭐ Real-time |
| Hosting (local) | **FREE** | - | Perfect for dev |
| Railway/Render | **FREE tier** | Good | Production ready |

## 🎯 Regional Distribution

Hiện tại server **estimate** phân bố theo region dựa trên:
- Gaming market research data
- Population statistics
- Known gaming preferences by region

Khi có thêm API keys cho các game khác, bạn có thể lấy data thực tế.

## 🔧 Customize

### Thêm game mới từ Steam:

Edit `src/services/steamService.ts`:
```typescript
export const STEAM_GAMES = {
  'your-game': { appId: '123456', name: 'Your Game Name' }
}
```

### Thay đổi update frequency:

Edit `src/index.ts`:
```typescript
// Đổi từ mỗi 30s sang mỗi 60s
cron.schedule('*/60 * * * * *', async () => {
  // ...
})
```

## 🌟 Ưu Điểm

✅ **100% Miễn phí** - Không cần trả tiền cho API  
✅ **Real-time** - Cập nhật mỗi 30 giây  
✅ **WebSocket** - Push updates tức thì  
✅ **REST API** - Easy integration  
✅ **TypeScript** - Type-safe  
✅ **No rate limits** - Steam API không giới hạn  
✅ **Scalable** - Dễ thêm API mới

## 📝 Notes

- **Regional data**: Hiện estimate dựa trên market research. Để có data chính xác cần API của từng game (thường trả phí)
- **Caching**: Data được cache 30s để giảm API calls
- **Error handling**: Tự động retry và fallback to cached data
- **Production**: Deploy free trên Railway, Render, hoặc Fly.io
