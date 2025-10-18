import express from 'express'
import cors from 'cors'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import cron from 'node-cron'
import dotenv from 'dotenv'
import { aggregateGameData, forceRefresh, getCachedData } from './services/dataAggregator.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ✅ Rate limiting - prevent API abuse
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per IP
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Middleware
app.use(cors())
app.use(express.json())

// ✅ Compression - reduce response size by ~80%
app.use(compression({
  level: 6, // Compression level 1-9 (6 is good balance)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  }
}))

// ✅ Apply rate limiting to API routes only
app.use('/api/', limiter)

// Create HTTP server
const server = createServer(app)

// Create WebSocket server
const wss = new WebSocketServer({ server })

// WebSocket connections
const clients = new Set<any>()

wss.on('connection', (ws) => {
  console.log('🔌 New WebSocket client connected')
  clients.add(ws)

  // Send current data immediately
  const cachedData = getCachedData()
  if (cachedData) {
    ws.send(JSON.stringify({ type: 'initial', data: cachedData }))
  }

  ws.on('close', () => {
    console.log('🔌 Client disconnected')
    clients.delete(ws)
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
    clients.delete(ws)
  })
})

// Broadcast data to all connected clients
function broadcastData(data: any) {
  const message = JSON.stringify({ type: 'update', data, timestamp: new Date().toISOString() })
  clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(message)
    }
  })
}

// REST API Endpoints

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), clients: clients.size })
})

// Get all aggregated data
app.get('/api/data', async (req, res) => {
  try {
    const data = await aggregateGameData()
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch data' })
  }
})

// Get specific game data
app.get('/api/games/:gameId', async (req, res) => {
  try {
    const data = await aggregateGameData()
    const game = data.games.find(g => g.gameId === req.params.gameId)
    
    if (!game) {
      return res.status(404).json({ success: false, error: 'Game not found' })
    }
    
    res.json({ success: true, data: game })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch game data' })
  }
})

// Get country data
app.get('/api/countries/:countryCode', async (req, res) => {
  try {
    const data = await aggregateGameData()
    const country = data.countries.find(c => c.countryCode === req.params.countryCode)
    
    if (!country) {
      return res.status(404).json({ success: false, error: 'Country not found' })
    }
    
    res.json({ success: true, data: country })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch country data' })
  }
})

// Force refresh data
app.post('/api/refresh', async (req, res) => {
  try {
    const data = await forceRefresh()
    broadcastData(data)
    res.json({ success: true, message: 'Data refreshed', data })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to refresh data' })
  }
})

// Get global statistics
app.get('/api/stats', async (req, res) => {
  try {
    const data = await aggregateGameData()
    res.json({ success: true, data: data.globalStats })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' })
  }
})

// Schedule automatic data updates every 30 seconds
cron.schedule('*/30 * * * * *', async () => {
  try {
    console.log('⏰ Scheduled update running...')
    const data = await aggregateGameData()
    
    if (clients.size > 0) {
      broadcastData(data)
      console.log(`📤 Broadcasted update to ${clients.size} clients`)
    }
  } catch (error) {
    console.error('❌ Scheduled update failed:', error)
  }
})

// Initial data fetch
aggregateGameData().catch(console.error)

// Start server
server.listen(PORT, () => {
  console.log(`
🚀 WikiGames Server Running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 REST API:    http://localhost:${PORT}
🔌 WebSocket:   ws://localhost:${PORT}
📊 Health:      http://localhost:${PORT}/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available Endpoints:
  GET  /api/data              - All aggregated data
  GET  /api/games/:gameId     - Specific game data
  GET  /api/countries/:code   - Country data
  GET  /api/stats             - Global statistics
  POST /api/refresh           - Force data refresh

Data Sources (ALL FREE):
  ✅ Steam API (Real-time player counts)
  🔄 Auto-updates every 30 seconds
  🔌 WebSocket broadcasts to ${clients.size} clients
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)
})
