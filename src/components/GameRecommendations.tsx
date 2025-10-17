import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Sparkles, ThumbsUp, Users, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameIcon } from './GameIcon'
import { GAMES } from '@/data/mockData'

interface GameRecommendationsProps {
  selectedGameId?: string
  games: Array<{
    gameId: string
    gameName: string
    currentPlayers: number
    trend?: 'up' | 'down' | 'stable'
  }>
}

interface Recommendation {
  gameId: string
  gameName: string
  gameType: string
  reason: string
  matchScore: number
  currentPlayers: number
  trend?: 'up' | 'down' | 'stable'
  badges: string[]
}

export function GameRecommendations({ selectedGameId, games }: GameRecommendationsProps) {
  const [showAll, setShowAll] = useState(false)

  const getRecommendations = (): Recommendation[] => {
    if (!selectedGameId) {
      // Show trending games if no game selected
      return games
        .sort((a, b) => b.currentPlayers - a.currentPlayers)
        .slice(0, 5)
        .map(game => {
          const gameInfo = GAMES.find(g => g.id === game.gameId)
          return {
            ...game,
            gameType: gameInfo?.type || 'Unknown',
            reason: 'Currently trending with high player activity',
            matchScore: 85 + Math.random() * 15,
            badges: ['🔥 Hot', '👥 Popular']
          }
        })
    }

    // Find similar games based on type
    const selectedGame = GAMES.find(g => g.id === selectedGameId)
    if (!selectedGame) return []

    const similarGames = GAMES.filter(g => 
      g.id !== selectedGameId && g.type === selectedGame.type
    )

    const otherGames = GAMES.filter(g => 
      g.id !== selectedGameId && g.type !== selectedGame.type
    )

    const recommendations: Recommendation[] = []

    // Add similar type games
    similarGames.forEach(game => {
      const gameData = games.find(g => g.gameId === game.id)
      if (gameData) {
        recommendations.push({
          ...gameData,
          gameType: game.type,
          reason: `Same genre as ${selectedGame.name}`,
          matchScore: 90 + Math.random() * 10,
          badges: ['✓ Similar', '🎮 ' + game.type]
        })
      }
    })

    // Add trending games from other genres
    otherGames.slice(0, 3).forEach(game => {
      const gameData = games.find(g => g.gameId === game.id)
      if (gameData) {
        const isTrending = gameData.trend === 'up'
        recommendations.push({
          ...gameData,
          gameType: game.type,
          reason: isTrending ? 'Trending in different genre' : 'Popular alternative genre',
          matchScore: 70 + Math.random() * 15,
          badges: isTrending ? ['📈 Trending', '🎮 ' + game.type] : ['🌟 Popular', '🎮 ' + game.type]
        })
      }
    })

    return recommendations.sort((a, b) => b.matchScore - a.matchScore)
  }

  const recommendations = getRecommendations()
  const displayedRecommendations = showAll ? recommendations : recommendations.slice(0, 4)

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 80) return 'text-blue-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-orange-500'
  }

  const getTrendBadge = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <Badge variant="secondary" className="text-green-500 text-xs">↗ Rising</Badge>
      case 'down':
        return <Badge variant="secondary" className="text-red-500 text-xs">↘ Falling</Badge>
      default:
        return <Badge variant="secondary" className="text-yellow-500 text-xs">→ Stable</Badge>
    }
  }

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {selectedGameId ? 'Recommended For You' : 'Trending Games'}
          </CardTitle>
          <Badge variant="secondary">
            {recommendations.length} game{recommendations.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayedRecommendations.map((rec, index) => (
            <motion.div
              key={rec.gameId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-gradient-to-r from-accent/50 to-accent/20 hover:from-accent/70 hover:to-accent/30 rounded-lg p-4 border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
            >
              {/* Match Score Badge */}
              <div className="absolute -top-2 -right-2 z-10">
                <Badge className={`${getMatchScoreColor(rec.matchScore)} bg-background border-2 font-bold`}>
                  {rec.matchScore.toFixed(0)}%
                </Badge>
              </div>

              <div className="flex items-start gap-3">
                {/* Game Icon */}
                <div className="flex-shrink-0">
                  <GameIcon gameId={rec.gameId} size={48} />
                </div>

                {/* Game Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="font-semibold text-sm mb-0.5">{rec.gameName}</div>
                      <div className="text-xs text-muted-foreground">{rec.reason}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span className="font-mono">{rec.currentPlayers.toLocaleString()}</span>
                    </div>
                    {getTrendBadge(rec.trend)}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1 mt-2 flex-wrap">
                    {rec.badges.map((badge, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar - Match Score Visualization */}
              <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${rec.matchScore}%` }}
                  transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
                  className={`h-full bg-gradient-to-r ${
                    rec.matchScore >= 90 ? 'from-green-500 to-green-600' :
                    rec.matchScore >= 80 ? 'from-blue-500 to-blue-600' :
                    rec.matchScore >= 70 ? 'from-yellow-500 to-yellow-600' :
                    'from-orange-500 to-orange-600'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Show More Button */}
        {recommendations.length > 4 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show ${recommendations.length - 4} More`}
            <ChevronRight className={`h-4 w-4 ml-2 transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </Button>
        )}

        {/* Info Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mt-4">
          <div className="flex items-start gap-2">
            <ThumbsUp className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-xs text-muted-foreground">
              Recommendations based on {selectedGameId ? 'game type, player trends, and popularity' : 'current player activity and trends'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
