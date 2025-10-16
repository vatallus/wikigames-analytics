import { motion } from 'framer-motion'
import { Users, Gamepad2, Globe } from 'lucide-react'
import { AnimatedNumber } from './AnimatedNumber'

interface LiveStatsBarProps {
  totalPlayers: number
  activeGames: number
  liveCountries: number
  isLive: boolean
}

export function LiveStatsBar({ totalPlayers, activeGames, liveCountries, isLive }: LiveStatsBarProps) {
  const stats = [
    { 
      icon: Users, 
      label: 'Total Players Online', 
      value: totalPlayers,
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Gamepad2, 
      label: 'Games Tracked', 
      value: activeGames,
      gradient: 'from-purple-500 to-pink-500',
      suffix: ' Games'
    },
    { 
      icon: Globe, 
      label: 'Countries', 
      value: liveCountries,
      gradient: 'from-green-500 to-emerald-500',
      suffix: ' Regions'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-card to-card/50 p-4"
        >
          {/* Background gradient effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-5`} />
          
          {/* Pulse effect for live data */}
          {isLive && index === 0 && (
            <motion.div
              className="absolute top-2 right-2"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-red-500 font-semibold">LIVE</span>
              </div>
            </motion.div>
          )}

          <div className="relative flex items-center gap-4">
            {/* Icon */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>

            {/* Stats */}
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
              <div className="flex items-baseline gap-1">
                <AnimatedNumber 
                  value={stat.value} 
                  className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                />
                {stat.suffix && (
                  <span className="text-sm text-muted-foreground">{stat.suffix}</span>
                )}
              </div>
            </div>
          </div>

          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      ))}
    </div>
  )
}
