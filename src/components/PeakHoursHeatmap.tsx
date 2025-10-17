import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Clock, Flame, Users } from 'lucide-react'
import { motion } from 'framer-motion'

interface PeakHoursHeatmapProps {
  gameId?: string
  gameName?: string
  currentPlayers?: number
}

interface HourData {
  hour: string
  intensity: number
  players: number
  label: string
}

// Generate realistic peak hours based on global gaming patterns
const generatePeakHoursData = (currentPlayers: number): HourData[] => {
  const hours = []
  
  // Gaming patterns: Lower in morning, peak in evening/night
  const patterns = {
    '00': 0.85, '01': 0.75, '02': 0.65, '03': 0.55, '04': 0.50, '05': 0.48,
    '06': 0.52, '07': 0.58, '08': 0.65, '09': 0.70, '10': 0.75, '11': 0.82,
    '12': 0.88, '13': 0.90, '14': 0.93, '15': 0.95, '16': 0.97, '17': 0.98,
    '18': 1.00, '19': 1.00, '20': 0.98, '21': 0.95, '22': 0.92, '23': 0.88
  }
  
  for (let i = 0; i < 24; i++) {
    const hourStr = i.toString().padStart(2, '0')
    const intensity = patterns[hourStr as keyof typeof patterns]
    const basePlayers = currentPlayers
    
    hours.push({
      hour: hourStr,
      intensity: intensity,
      players: Math.floor(basePlayers * intensity),
      label: `${hourStr}:00`
    })
  }
  
  return hours
}

export function PeakHoursHeatmap({ gameId: _gameId, gameName, currentPlayers }: PeakHoursHeatmapProps) {
  // Use real current players from props, fallback to 600000 for mock
  const playerCount = currentPlayers || 600000
  const hoursData = generatePeakHoursData(playerCount)
  const maxIntensity = Math.max(...hoursData.map(h => h.intensity))
  const peakHours = hoursData.filter(h => h.intensity >= maxIntensity * 0.95)
  
  const getIntensityColor = (intensity: number) => {
    const normalized = intensity / maxIntensity
    if (normalized >= 0.9) return 'bg-red-500'
    if (normalized >= 0.75) return 'bg-orange-500'
    if (normalized >= 0.60) return 'bg-yellow-500'
    if (normalized >= 0.40) return 'bg-green-500'
    return 'bg-blue-500'
  }
  
  const getIntensityGlow = (intensity: number) => {
    const normalized = intensity / maxIntensity
    if (normalized >= 0.9) return 'shadow-[0_0_15px_rgba(239,68,68,0.6)]'
    if (normalized >= 0.75) return 'shadow-[0_0_10px_rgba(249,115,22,0.5)]'
    if (normalized >= 0.60) return 'shadow-[0_0_8px_rgba(234,179,8,0.4)]'
    return ''
  }

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {gameName ? `${gameName} - Peak Hours` : 'Global Peak Hours (UTC)'}
          </CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Flame className="h-3 w-3 text-orange-500" />
            Best Time: {peakHours[0]?.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Heatmap Grid */}
        <div className="grid grid-cols-12 gap-1">
          {hoursData.map((hour, index) => (
            <motion.div
              key={hour.hour}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
              className="group relative"
            >
              <div
                className={`
                  w-full aspect-square rounded-md transition-all cursor-pointer
                  ${getIntensityColor(hour.intensity)}
                  ${getIntensityGlow(hour.intensity)}
                  hover:scale-110 hover:z-10
                `}
                style={{ opacity: 0.3 + (hour.intensity / maxIntensity) * 0.7 }}
              >
                {/* Tooltip */}
                <div className="
                  absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                  opacity-0 group-hover:opacity-100 transition-opacity
                  bg-black/90 text-white text-xs rounded px-2 py-1.5
                  whitespace-nowrap z-20 pointer-events-none
                  border border-primary/30
                ">
                  <div className="font-semibold">{hour.label}</div>
                  <div className="flex items-center gap-1 text-primary">
                    <Users className="h-3 w-3" />
                    {hour.players.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {(hour.intensity / maxIntensity * 100).toFixed(0)}% activity
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hour Labels */}
        <div className="grid grid-cols-12 gap-1 text-[10px] text-muted-foreground text-center">
          {hoursData.map((hour) => (
            <div key={hour.hour}>{hour.hour}</div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Activity:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-500 opacity-60" />
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500 opacity-80" />
              <span>Med</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span>Peak</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Hover for details
          </div>
        </div>

        {/* Peak Hours Info */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Flame className="h-4 w-4 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-orange-500">Best Time to Play</div>
              <div className="text-xs text-muted-foreground mt-1">
                Peak activity from <strong>{peakHours[0]?.label}</strong> to <strong>{peakHours[peakHours.length - 1]?.label}</strong> UTC
                with {peakHours[0]?.players.toLocaleString()}+ concurrent players
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
