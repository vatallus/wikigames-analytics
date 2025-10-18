import { motion } from 'framer-motion'
import { Users, Gamepad2, TrendingUp, Globe2 } from 'lucide-react'
import { Card } from './ui/card'
import { AnimatedNumber } from './AnimatedNumber'

interface QuickStatsWidgetProps {
  totalPlayers: number
  activeGames: number
  trendingGame?: {
    name: string
    change: number
  }
  topCountry?: {
    name: string
    players: number
  }
}

export function QuickStatsWidget({ 
  totalPlayers, 
  activeGames, 
  trendingGame,
  topCountry 
}: QuickStatsWidgetProps) {
  const stats = [
    {
      label: 'Players Online',
      value: totalPlayers,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      suffix: ''
    },
    {
      label: 'Games Tracked',
      value: activeGames,
      icon: Gamepad2,
      color: 'from-purple-500 to-pink-500',
      suffix: ' games'
    },
    ...(trendingGame ? [{
      label: 'Trending',
      value: trendingGame.name,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      change: trendingGame.change
    }] : []),
    ...(topCountry ? [{
      label: 'Top Region',
      value: topCountry.name,
      icon: Globe2,
      color: 'from-orange-500 to-red-500',
      players: topCountry.players
    }] : [])
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="p-4 h-full bg-gradient-to-br from-card to-card/50 border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
            <div className="flex items-start gap-3 h-full">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} flex-shrink-0`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-xl font-bold truncate flex-grow">
                  {typeof stat.value === 'number' ? (
                    <>
                      <AnimatedNumber value={stat.value} />
                      {stat.suffix && <span className="text-sm text-muted-foreground">{stat.suffix}</span>}
                    </>
                  ) : (
                    <span className="text-sm">{stat.value}</span>
                  )}
                </div>
                <div className="min-h-[20px] mt-1">
                  {'change' in stat && stat.change ? (
                    <div className="text-xs text-green-500">
                      +{stat.change}% today
                    </div>
                  ) : 'players' in stat && stat.players ? (
                    <div className="text-xs text-muted-foreground">
                      {stat.players.toLocaleString()} players
                    </div>
                  ) : (
                    <div className="text-xs text-transparent">.</div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
