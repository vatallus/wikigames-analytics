import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface PlayerTrendChartProps {
  gameId?: string
  gameName?: string
  currentPlayers?: number
}

// Mock historical data - in real app this would come from backend
const generateMockTrendData = (currentPlayers: number) => {
  const data = []
  const now = new Date()
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const variation = Math.random() * 0.3 + 0.85 // 85-115% of current
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      players: Math.floor(currentPlayers * variation),
      peak: Math.floor(currentPlayers * (variation + 0.1))
    })
  }
  
  return data
}

export function PlayerTrendChart({ gameId: _gameId, gameName, currentPlayers }: PlayerTrendChartProps) {
  // Use real current players from props, fallback to 500000 for mock
  const playerCount = currentPlayers || 500000
  
  const data = generateMockTrendData(playerCount)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {gameName ? `${gameName} - 24h Trend` : 'Player Trends (24 Hours)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="#888"
                tick={{ fill: '#888', fontSize: 12 }}
                interval={3}
              />
              <YAxis 
                stroke="#888"
                tick={{ fill: '#888', fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => [value.toLocaleString(), '']}
                labelStyle={{ color: '#888' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                iconType="circle"
              />
              <Area 
                type="monotone" 
                dataKey="players" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPlayers)"
                name="Current Players"
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="peak" 
                stroke="#06b6d4" 
                strokeWidth={1}
                strokeDasharray="5 5"
                fillOpacity={1} 
                fill="url(#colorPeak)"
                name="Peak"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
