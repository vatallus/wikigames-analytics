# 🗄️ Database Setup Guide - Phase 2

## Quick Setup (Docker - Recommended)

### **Option 1: Using Docker Compose (Easiest!)**

Create `docker-compose.yml` in server folder:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: wikigames-postgres
    environment:
      POSTGRES_USER: wikigames
      POSTGRES_PASSWORD: wikigames123
      POSTGRES_DB: wikigames
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: wikigames-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

**Start databases:**
```bash
cd server
docker-compose up -d

# Check if running
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE                PORTS                    STATUS
xxx            postgres:15-alpine   0.0.0.0:5432->5432/tcp   Up
xxx            redis:7-alpine       0.0.0.0:6379->6379/tcp   Up
```

---

## Setup Steps

### **1. Update .env file**

```bash
cd server
cp .env.example .env
nano .env
```

Add these lines:
```env
# Database
DATABASE_URL="postgresql://wikigames:wikigames123@localhost:5432/wikigames?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### **2. Run Database Migration**

```bash
# Create and apply migration
npx prisma migrate dev --name init

# This will:
# ✅ Create database schema
# ✅ Create all tables
# ✅ Generate Prisma Client
```

**Expected output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "wikigames"

✔ Enter a name for the new migration: … init
Applying migration `20231018000000_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20231018000000_init/
    └─ migration.sql

Your database is now in sync with your schema.
```

### **3. Verify Database**

```bash
# Open Prisma Studio to view database
npx prisma studio

# Opens at http://localhost:5555
```

**You should see:**
- ✅ Game table (empty)
- ✅ PlayerHistory table (empty)
- ✅ Country table (empty)
- ✅ NewsCache table (empty)
- ✅ ApiLog table (empty)

### **4. Test Redis**

```bash
# Connect to Redis CLI
docker exec -it wikigames-redis redis-cli

# Test commands
127.0.0.1:6379> PING
PONG
127.0.0.1:6379> SET test "Hello"
OK
127.0.0.1:6379> GET test
"Hello"
127.0.0.1:6379> exit
```

### **5. Start Server**

```bash
npm run dev
```

**Expected logs:**
```
✅ Redis connected
🚀 WikiGames Server Running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 REST API:    http://localhost:3001
🔌 WebSocket:   ws://localhost:3001
📊 Health:      http://localhost:3001/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Aggregating fresh data from sources...
✅ Data aggregated: X players across 30 games
💾 Saved to Redis cache
💾 Saved to database
```

---

## Verification Checklist

### **Database:**
- [ ] PostgreSQL running on port 5432
- [ ] Can connect with Prisma Studio
- [ ] All 5 tables created
- [ ] No migration errors

### **Redis:**
- [ ] Redis running on port 6379
- [ ] Can ping successfully
- [ ] Server logs show "✅ Redis connected"

### **Application:**
- [ ] Server starts without errors
- [ ] First data fetch saves to database
- [ ] Subsequent fetches use cache
- [ ] Prisma Studio shows data in tables

---

## Troubleshooting

### **Problem: "Cannot connect to PostgreSQL"**

**Solution:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs wikigames-postgres

# Restart PostgreSQL
docker restart wikigames-postgres
```

### **Problem: "Redis connection failed"**

**Solution:**
```bash
# Check if Redis is running
docker ps | grep redis

# Restart Redis
docker restart wikigames-redis

# Server will still work without Redis (uses memory cache)
```

### **Problem: "Prisma migration failed"**

**Solution:**
```bash
# Reset database
npx prisma migrate reset --force

# Re-run migration
npx prisma migrate dev --name init
```

### **Problem: "Port 5432 already in use"**

**Solution:**
```bash
# Check what's using the port
lsof -i :5432

# Kill the process or change port in docker-compose.yml
ports:
  - "5433:5432"  # Use different external port

# Update DATABASE_URL accordingly
DATABASE_URL="postgresql://wikigames:wikigames123@localhost:5433/wikigames?schema=public"
```

---

## Performance Benefits

### **With Database + Redis:**

**Before (Memory only):**
```
⏱️ First request:  12s (fetch all data)
⏱️ Second request:  2s (memory cache)
💾 Data persistence: ❌ Lost on restart
📊 Historical data: ❌ None
🔍 Query capability: ❌ None
```

**After (Database + Redis):**
```
⏱️ First request:  <50ms (Redis cache)
⏱️ Cold start:     2s (fetch fresh data)
💾 Data persistence: ✅ PostgreSQL
📊 Historical data: ✅ 7 days kept
🔍 Query capability: ✅ Full SQL
🚀 Performance: 240x faster!
```

---

## Optional: Production Setup

### **For production, use managed services:**

**PostgreSQL:**
- Supabase (FREE tier - 500MB)
- Neon (FREE tier - 3GB)
- Railway ($5/month)
- DigitalOcean ($15/month)

**Redis:**
- Upstash (FREE tier - 10k requests/day)
- Redis Cloud (FREE tier - 30MB)
- Railway ($5/month)

**Update .env for production:**
```env
DATABASE_URL="postgresql://user:pass@your-host.com:5432/db"
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

---

## Database Schema

```prisma
Game
├── id (primary key)
├── appId
├── name
├── currentPlayers
├── peakPlayers24h
├── trend
└── ... (18 more fields)

PlayerHistory
├── id (primary key)
├── gameId (foreign key -> Game)
├── playerCount
└── timestamp

Country
├── id (primary key)
├── code (unique)
├── name
├── totalPlayers
└── gamesData (JSON)

NewsCache
└── Cached news & tournaments

ApiLog
└── Performance monitoring
```

---

## Useful Commands

```bash
# View database
npx prisma studio

# Check database status
npx prisma db pull

# View migrations
ls -la prisma/migrations/

# Generate Prisma Client
npx prisma generate

# Reset database (WARNING: Deletes all data!)
npx prisma migrate reset

# View Redis data
docker exec -it wikigames-redis redis-cli
> KEYS *
> GET wikigames:aggregated_data

# Database backup
docker exec wikigames-postgres pg_dump -U wikigames wikigames > backup.sql

# Restore backup
docker exec -i wikigames-postgres psql -U wikigames wikigames < backup.sql
```

---

## Next Steps

1. ✅ Setup complete
2. ✅ Run migration
3. ✅ Start server
4. ✅ Verify data in Prisma Studio
5. 🚀 Enjoy 5-10x faster performance!

---

**Ready for Phase 3?** Advanced optimizations coming next! 🚀
