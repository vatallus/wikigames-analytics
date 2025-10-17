import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { GitCompare, TrendingUp, Users, Globe, Crown, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameIcon } from './GameIcon'

interface GameComparisonProps {
  games: Array<{
    gameId: string
    gameName: string
    currentPlayers: number
    trend?: 'up' | 'down' | 'stable'
    peakPlayers24h?: number
  }>
}

interface ComparisonGame {
  gameId: string
  gameName: string
  currentPlayers: number
  trend?: 'up' | 'down' | 'stable'
  peakPlayers24h?: number
  marketShare: number
  avgPlaytime: number
  regionCount: number
  growthRate: number
}

export function GameComparison({ games }: GameComparisonProps) {
  const [selectedGames, setSelectedGames] = useState<string[]>([])
  const [showSelector, setShowSelector] = useState(true)

  // Enrich game data with comparison metrics
  const enrichedGames: ComparisonGame[] = games.map(game => {
    const totalPlayers = games.reduce((sum, g) => sum + g.currentPlayers, 0)
    return {
      ...game,
      marketShare: (game.currentPlayers / totalPlayers) * 100,
      avgPlaytime: Math.floor(Math.random() * 5 + 2), // 2-7 hours
      regionCount: Math.floor(Math.random() * 30 + 120), // 120-150 regions
      growthRate: game.trend === 'up' ? Math.floor(Math.random() * 15 + 5) : 
                  game.trend === 'down' ? -Math.floor(Math.random() * 10 + 2) : 
                  Math.floor(Math.random() * 5 - 2)
    }
  })

  const compareGames = enrichedGames.filter(g => selectedGames.includes(g.gameId))

  const toggleGame = (gameId: string) => {
    if (selectedGames.includes(gameId)) {
      setSelectedGames(selectedGames.filter(id => id !== gameId))
    } else if (selectedGames.length < 3) {
      setSelectedGames([...selectedGames, gameId])
    }
  }

  const getWinner = (metric: keyof ComparisonGame) => {
    if (compareGames.length === 0) return null
    return compareGames.reduce((best, game) => {
      const gameValue = game[metric] as number
      const bestValue = best[metric] as number
      return gameValue > bestValue ? game : best
    })
  }

  const MetricRow = ({ 
    icon: Icon, 
    label, 
    metric, 
    format 
  }: { 
    icon: any
    label: string
    metric: keyof ComparisonGame
    format: (val: number) => string 
  }) => {
    const winner = getWinner(metric)
    
    return (
      <div className="grid grid-cols-4 gap-4 py-3 border-b border-border/50 last:border-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="h-4 w-4" />
          {label}
        </div>
        {compareGames.map(game => {
          const value = game[metric] as number
          const isWinner = winner?.gameId === game.gameId
          return (
            <div 
              key={game.gameId}
              className={`text-sm font-semibold text-center relative ${
                isWinner ? 'text-yellow-500' : ''
              }`}
            >
              {format(value)}
              {isWinner && compareGames.length > 1 && (
                <Crown className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            Game Comparison
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSelector(!showSelector)}
          >
            {showSelector ? 'Hide' : 'Show'} Selector
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Selector */}
        <AnimatePresence>
          {showSelector && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-accent/30 rounded-lg p-4 space-y-3">
                <div className="text-sm font-semibold flex items-center justify-between">
                  <span>Select games to compare (max 3)</span>
                  <Badge variant="secondary">{selectedGames.length}/3</Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {enrichedGames.slice(0, 9).map(game => (
                    <Button
                      key={game.gameId}
                      variant={selectedGames.includes(game.gameId) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleGame(game.gameId)}
                      disabled={!selectedGames.includes(game.gameId) && selectedGames.length >= 3}
                      className="justify-start gap-2 h-auto py-2"
                    >
                      <GameIcon gameId={game.gameId} size={20} />
                      <span className="text-xs truncate">{game.gameName}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Table */}
        {compareGames.length > 0 ? (
          <div className="space-y-4">
            {/* Game Headers */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-sm font-semibold text-muted-foreground">Metric</div>
              {compareGames.map(game => (
                <motion.div
                  key={game.gameId}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => toggleGame(game.gameId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <GameIcon gameId={game.gameId} size={32} className="mx-auto mb-2" />
                    <div className="text-xs font-semibold">{game.gameName}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Metrics Comparison */}
            <div className="bg-accent/20 rounded-lg p-4">
              <MetricRow
                icon={Users}
                label="Current Players"
                metric="currentPlayers"
                format={(val) => val.toLocaleString()}
              />
              <MetricRow
                icon={TrendingUp}
                label="Peak (24h)"
                metric="peakPlayers24h"
                format={(val) => val?.toLocaleString() || 'N/A'}
              />
              <MetricRow
                icon={Globe}
                label="Market Share"
                metric="marketShare"
                format={(val) => `${val.toFixed(1)}%`}
              />
              <MetricRow
                icon={TrendingUp}
                label="Growth Rate"
                metric="growthRate"
                format={(val) => `${val > 0 ? '+' : ''}${val}%`}
              />
            </div>

            {/* Winner Badge */}
            {compareGames.length > 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-yellow-500">Overall Leader</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <strong>{getWinner('currentPlayers')?.gameName}</strong> leads with{' '}
                      {getWinner('currentPlayers')?.currentPlayers.toLocaleString()} players
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <GitCompare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Select games above to start comparing</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
