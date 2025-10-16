import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { GameIcon } from './GameIcon'
import { AnimatedNumber } from './AnimatedNumber'

interface GameLeaderboardProps {
  games: Array<{
    gameId: string
    gameName: string
    currentPlayers: number
    trend?: 'up' | 'down' | 'stable'
    peakPlayers24h?: number
  }>
}

export function GameLeaderboard({ games }: GameLeaderboardProps) {
  const topGames = games.slice(0, 10)

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />
    }
  }


  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Top Games Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {topGames.map((game, index) => (
          <motion.div
            key={game.gameId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`
              relative flex items-center gap-3 p-3 rounded-lg 
              transition-all hover:scale-[1.02] cursor-pointer
              ${index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border-2 border-yellow-500/30' : 
                index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-400/5 border border-gray-400/30' :
                index === 2 ? 'bg-gradient-to-r from-orange-600/20 to-orange-600/5 border border-orange-600/30' :
                'bg-accent/50 border border-border/50'}
            `}
          >
            {/* Rank Badge */}
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full font-bold
              ${index === 0 ? 'bg-yellow-500 text-black' : 
                index === 1 ? 'bg-gray-400 text-black' :
                index === 2 ? 'bg-orange-600 text-white' :
                'bg-primary/20 text-primary'}
            `}>
              {index + 1}
            </div>

            {/* Game Icon */}
            <GameIcon gameId={game.gameId} size={36} />

            {/* Game Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{game.gameName}</span>
                {getTrendIcon(game.trend)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <AnimatedNumber 
                  value={game.currentPlayers} 
                  className="text-lg font-bold text-primary"
                />
                <span className="text-xs text-muted-foreground">players</span>
              </div>
            </div>

            {/* Peak Badge */}
            {game.peakPlayers24h && (
              <Badge variant="secondary" className="text-xs">
                Peak: {game.peakPlayers24h.toLocaleString()}
              </Badge>
            )}

            {/* Trophy for top 3 */}
            {index < 3 && (
              <Trophy 
                className={`
                  absolute -top-1 -right-1 h-5 w-5
                  ${index === 0 ? 'text-yellow-500' : 
                    index === 1 ? 'text-gray-400' :
                    'text-orange-600'}
                `}
              />
            )}
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
