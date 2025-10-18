import { motion } from 'framer-motion'

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="space-y-3"
        >
          <div className="h-32 bg-gradient-to-r from-accent/50 to-accent/20 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-accent/50 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-accent/30 rounded w-1/2 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="h-32 bg-gradient-to-r from-accent/50 to-accent/20 rounded-lg animate-pulse"
        />
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="h-64 bg-gradient-to-r from-accent/50 to-accent/20 rounded-lg animate-pulse flex items-end justify-around p-4 gap-2">
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="bg-accent/40 rounded-t w-full animate-pulse"
          style={{ height: `${Math.random() * 70 + 30}%` }}
        />
      ))}
    </div>
  )
}

export function GameCardSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 p-4 bg-accent/30 rounded-lg"
        >
          <div className="h-12 w-12 bg-accent/50 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-accent/50 rounded w-2/3 animate-pulse" />
            <div className="h-3 bg-accent/30 rounded w-1/2 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
