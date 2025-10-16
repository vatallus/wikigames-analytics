# WikiGames - Global Gaming Analytics

Ứng dụng web hiện đại với **dữ liệu thời gian thực MIỄN PHÍ** từ Steam API và các nguồn khác, hiển thị thống kê game theo quốc gia trên bản đồ tương tác.

## 🎯 Tính Năng Chính

### ✅ Đã Hoàn Thành
- 🌍 **Bản đồ thế giới tương tác** - Click vào quốc gia để xem chi tiết
- 🎮 **Lọc game** - Tìm kiếm và lọc theo tên/thể loại
- 📊 **Dữ liệu thời gian thực** - Cập nhật tự động mỗi 30 giây
- 🔄 **WebSocket** - Push updates tức thì
- 🔍 **Zoom & Pan** - Phóng to/thu nhỏ bản đồ
- 🌙 **Dark Mode** - Chế độ tối/sáng
- ⚡ **UI hiện đại** - React + TypeScript + TailwindCSS
- 💰 **100% Miễn phí** - Steam API không tính phí, không cần API key

### 🎮 Real-time Data Sources (Miễn phí)
- **Steam API** ✅ - CS:GO, Dota 2, PUBG, Rust, TF2, Apex Legends
- **Twitch API** 🔜 - Viewer counts (optional)
- **RAWG API** 🔜 - Game metadata (optional)

## 🚀 Quick Start

### Option 1: Chỉ Frontend (Mock Data)

```bash
# Cài đặt và chạy frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

### Option 2: Full Stack (Real-time Data - KHUYẾN NGHỊ)

**Terminal 1 - Backend Server:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:5173
- **WebSocket**: ws://localhost:3001

## 📊 Nguồn Dữ Liệu Thực Tế

### Steam API (Đang sử dụng - 100% Miễn phí)

```bash
# KHÔNG CẦN API KEY!
# Server tự động lấy data từ:
https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=730
```

**Games hiện có:**
- Counter-Strike: Global Offensive (CS:GO)
- Dota 2
- PLAYERUNKNOWN'S BATTLEGROUNDS (PUBG)
- Rust
- Team Fortress 2
- Apex Legends

**Đặc điểm:**
- ✅ Hoàn toàn miễn phí
- ✅ Không cần đăng ký API key
- ✅ Không giới hạn requests
- ✅ Real-time player counts
- ✅ Update mỗi 30 giây

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - Interactive Map (React Simple Maps)                  │
│  - Real-time Updates (WebSocket)                        │
│  - Dark Mode, Filters, Charts                           │
│  - Port: 5173                                           │
└──────────────────┬──────────────────────────────────────┘
                   │ WebSocket + REST API
                   │
┌──────────────────▼──────────────────────────────────────┐
│              Backend Server (Node.js)                    │
│  - Express REST API                                      │
│  - WebSocket Server                                      │
│  - Data Aggregation                                      │
│  - Auto-refresh (30s)                                    │
│  - Port: 3001                                           │
└──────────────────┬──────────────────────────────────────┘
                   │ Fetch data
                   │
┌──────────────────▼──────────────────────────────────────┐
│              Free Data Sources                           │
│  ✅ Steam API (player counts)                           │
│  🔜 Twitch API (viewership - optional)                  │
│  🔜 RAWG API (metadata - optional)                      │
└─────────────────────────────────────────────────────────┘
```

## 📡 API Endpoints

### REST API

```bash
# Lấy tất cả data
GET http://localhost:3001/api/data

# Lấy data của 1 game cụ thể
GET http://localhost:3001/api/games/:gameId

# Lấy data của 1 quốc gia
GET http://localhost:3001/api/countries/:countryCode

# Thống kê global
GET http://localhost:3001/api/stats

# Force refresh
POST http://localhost:3001/api/refresh

# Health check
GET http://localhost:3001/health
```

### WebSocket

```javascript
const ws = new WebSocket('ws://localhost:3001')

ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data)
  // type: 'initial' | 'update'
  // data: AggregatedDataResponse
}
```

## 🔧 Cấu Hình Nâng Cao

### Thêm games từ Steam

Edit `server/src/services/steamService.ts`:

```typescript
export const STEAM_GAMES = {
  'your-game': { 
    appId: '123456', 
    name: 'Your Game Name' 
  }
}
```

### Thêm Twitch API (Optional - để xem popularity qua viewership)

1. Đăng ký tại: https://dev.twitch.tv/
2. Lấy Client ID và Client Secret
3. Thêm vào `server/.env`:

```bash
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
```

### Build Production

**Frontend:**
```bash
npm run build
# Files trong: dist/
```

**Backend:**
```bash
cd server
npm run build
npm start
# hoặc deploy lên Railway/Render (miễn phí)
```

## Project Structure

```
wikigames/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── WorldMap.tsx  # Interactive map component
│   │   ├── GameFilter.tsx # Game filtering sidebar
│   │   └── StatsPanel.tsx # Statistics panel
│   ├── data/             # Mock data and data utilities
│   │   └── mockData.ts   # Game and country data
│   ├── lib/              # Utility functions
│   │   └── utils.ts      # Helper functions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Features in Detail

### Game Selection
- Browse through 11 popular games across 7 different genres
- Search games by name
- Filter by game type (FPS, MOBA, Battle Royale, RPG, Strategy, Sports, Racing)
- View player counts and play rates for each game

### Interactive Map
- Visualize game popularity across 15+ countries
- Color-coded regions showing play rate intensity
- Click on countries for detailed statistics
- Zoom and pan controls for better exploration

### Statistics Dashboard
- Global statistics showing total players and top countries
- Country-specific data showing popular games and player distribution
- Real-time data updates (WebSocket support coming soon)

## 🌐 Deploy Production (Miễn Phí)

### Frontend (Netlify/Vercel)

```bash
npm run build
# Upload folder dist/ lên Netlify/Vercel
```

### Backend (Railway/Render/Fly.io)

**Railway (Khuyến nghị - FREE tier):**
```bash
# 1. Tạo account: railway.app
# 2. Connect GitHub repo
# 3. Deploy folder: server/
# 4. Railway tự động detect và deploy
```

**Environment Variables:**
```bash
PORT=3001
NODE_ENV=production
```

## 🐛 Troubleshooting

### Frontend không kết nối được Backend

**Triệu chứng:**
- Hiện banner "Backend Server Not Running"
- Chỉ thấy mock data

**Giải pháp:**
```bash
# Check server có chạy không
curl http://localhost:3001/health

# Nếu không, start server:
cd server && npm run dev
```

### CORS Error

**Giải pháp:**
Backend đã config CORS. Nếu vẫn lỗi, check:
```typescript
// server/src/index.ts
app.use(cors()) // Đã có
```

### WebSocket không connect

**Check:**
1. Backend có chạy không?
2. Port 3001 có bị chiếm không?
3. Check browser console

### Steam API trả về 0 players

**Nguyên nhân:**
- Game đó không có trên Steam
- App ID sai
- Steam API tạm thời down

**Giải pháp:**
```bash
# Test trực tiếp API:
curl "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=730"
```

## 💡 Tips & Best Practices

### Performance

- ✅ Backend cache data 30s
- ✅ WebSocket chỉ broadcast khi có clients
- ✅ Frontend chỉ re-render khi data thay đổi
- ✅ Map component tối ưu với React.memo

### Cost Optimization

- ✅ **Steam API**: Miễn phí, không giới hạn
- ✅ **Hosting**: Railway/Render free tier
- ✅ **Database**: Không cần (in-memory cache)
- ✅ **Total cost**: $0/month

### Thêm nhiều games

1. Tìm Steam App ID: https://steamdb.info/
2. Thêm vào `STEAM_GAMES` object
3. Restart server
4. Frontend tự động detect game mới

## 📈 Roadmap

### Phase 1 (Done ✅)
- ✅ Frontend với interactive map
- ✅ Backend API aggregator
- ✅ WebSocket real-time updates
- ✅ Steam API integration
- ✅ Dark mode
- ✅ Auto-refresh (30s)

### Phase 2 (Optional)
- 🔜 Twitch API integration
- 🔜 Historical data & charts
- 🔜 More Steam games
- 🔜 Regional trends analysis
- 🔜 Mobile app (React Native)
- 🔜 User accounts & preferences

### Phase 3 (Future)
- 🔜 Machine learning predictions
- 🔜 Tournament tracking
- 🔜 Streamer integration
- 🔜 Discord bot

## 📚 Tech Stack Chi Tiết

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2 | UI Framework |
| TypeScript | 5.2 | Type Safety |
| Vite | 5.0 | Build Tool |
| TailwindCSS | 3.3 | Styling |
| React Simple Maps | 3.0 | Map Visualization |
| Lucide React | 0.294 | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| Express | 4.18 | REST API |
| TypeScript | 5.3 | Type Safety |
| WebSocket (ws) | 8.14 | Real-time Updates |
| node-cron | 3.0 | Scheduled Tasks |

## 🤝 Contributing

Contributions are welcome! 

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - free to use for learning or commercial purposes.

## 📞 Support

- **GitHub Issues**: Bug reports & feature requests
- **Discussions**: Questions & ideas
- **Discord**: Coming soon

---

**Tạo bởi:** WikiGames Team  
**Dữ liệu:** Steam API (Free)  
**Cost:** $0/month 💰  
**Status:** Production Ready ✅
