import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Users, ThumbsUp, ThumbsDown, Clock, DollarSign, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import { ShareButton } from './ShareButton'

interface GameDetailsProps {
  game: {
    gameName: string
    currentPlayers: number
    trend?: 'up' | 'down' | 'stable'
    owners?: string
    positiveReviews?: number
    negativeReviews?: number
    averagePlaytime?: number
    recentPlaytime?: number
    price?: string
    tags?: string[]
    userScore?: number
  }
}

export function GameDetails({ game }: GameDetailsProps) {
  // Calculate review score percentage
  const totalReviews = (game.positiveReviews || 0) + (game.negativeReviews || 0)
  const reviewScore = totalReviews > 0 
    ? Math.round((game.positiveReviews || 0) / totalReviews * 100) 
    : 0

  // Format playtime
  const formatPlaytime = (minutes?: number) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    if (hours > 1000) return `${Math.floor(hours / 100) / 10}k hours`
    if (hours > 100) return `${Math.floor(hours)} hours`
    return `${hours} hours`
  }

  // Get review badge color
  const getReviewColor = (score: number) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-blue-500'
    if (score >= 70) return 'bg-yellow-500'
    if (score >= 60) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{game.gameName}</CardTitle>
            <ShareButton
              title={`${game.gameName} Stats - WikiGames`}
              text={`🎮 ${game.gameName} has ${game.currentPlayers.toLocaleString()} players online right now!`}
              gameData={{
                name: game.gameName,
                players: game.currentPlayers,
                trend: game.trend
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Players */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Current Players</div>
              <div className="text-2xl font-bold text-primary">
                {game.currentPlayers.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Owners */}
          {game.owners && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Owners</span>
              </div>
              <Badge variant="secondary">{game.owners}</Badge>
            </div>
          )}

          {/* Reviews */}
          {totalReviews > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User Reviews</span>
                <Badge className={`${getReviewColor(reviewScore)} text-white`}>
                  {reviewScore}% Positive
                </Badge>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Positive</div>
                    <div className="text-sm font-semibold">
                      {(game.positiveReviews || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Negative</div>
                    <div className="text-sm font-semibold">
                      {(game.negativeReviews || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-red-500/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${reviewScore}%` }}
                />
              </div>
            </div>
          )}

          {/* Playtime */}
          {game.averagePlaytime && game.averagePlaytime > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-accent/50">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Avg Playtime</span>
                </div>
                <div className="text-sm font-bold">
                  {formatPlaytime(game.averagePlaytime)}
                </div>
              </div>
              {game.recentPlaytime && game.recentPlaytime > 0 && (
                <div className="p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Last 2 Weeks</span>
                  </div>
                  <div className="text-sm font-bold">
                    {formatPlaytime(game.recentPlaytime)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Price */}
          {game.price !== undefined && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Price</span>
              </div>
              <Badge variant={game.price === '0' ? 'default' : 'secondary'}>
                {game.price === '0' ? 'Free to Play' : `$${(parseInt(game.price) / 100).toFixed(2)}`}
              </Badge>
            </div>
          )}

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Popular Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
