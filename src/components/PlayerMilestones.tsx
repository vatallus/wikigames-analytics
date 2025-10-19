import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Trophy, Zap, Target, PartyPopper, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { GameIcon } from './GameIcon'
import { AnimatedNumber } from './AnimatedNumber'

interface PlayerMilestonesProps {
  games: Array<{
    gameId: string
    gameName: string
    currentPlayers: number
  }>
}

interface Milestone {
  threshold: number
  label: string
  icon: 'trophy' | 'zap' | 'target' | 'party'
  color: string
  achieved: boolean
  progress: number
  nextMilestone?: number
}

export function PlayerMilestones({ games }: PlayerMilestonesProps) {
  const milestoneThresholds = [
    { value: 100000, label: '100K Milestone', icon: 'target' as const, color: 'text-blue-500' },
    { value: 250000, label: '250K Surge', icon: 'zap' as const, color: 'text-cyan-500' },
    { value: 500000, label: '500K Champion', icon: 'trophy' as const, color: 'text-purple-500' },
    { value: 1000000, label: '1M Legend', icon: 'party' as const, color: 'text-yellow-500' },
    { value: 2000000, label: '2M Elite', icon: 'party' as const, color: 'text-orange-500' },
  ]

  const getIcon = (type: string, className: string) => {
    const icons = {
      trophy: <Trophy className={className} />,
      zap: <Zap className={className} />,
      target: <Target className={className} />,
      party: <PartyPopper className={className} />
    }
    return icons[type as keyof typeof icons]
  }

  const calculateMilestones = (currentPlayers: number): Milestone[] => {
    return milestoneThresholds.map((threshold, index) => {
      const achieved = currentPlayers >= threshold.value
      const nextThreshold = milestoneThresholds[index + 1]?.value || threshold.value * 2
      const progress = achieved ? 100 : (currentPlayers / threshold.value) * 100

      return {
        threshold: threshold.value,
        label: threshold.label,
        icon: threshold.icon,
        color: threshold.color,
        achieved,
        progress,
        nextMilestone: achieved && nextThreshold ? nextThreshold : undefined
      }
    })
  }

  // Get games close to achieving milestones (within 20%)
  const nearMilestoneGames = games.map(game => {
    const milestones = calculateMilestones(game.currentPlayers)
    const nextMilestone = milestones.find(m => !m.achieved)
    
    if (!nextMilestone) return null
    
    const distanceToNext = nextMilestone.threshold - game.currentPlayers
    const percentageToNext = (distanceToNext / nextMilestone.threshold) * 100
    
    // Only show if within 20% of next milestone
    if (percentageToNext <= 20) {
      return {
        ...game,
        nextMilestone,
        distanceToNext,
        percentageToNext: 100 - percentageToNext
      }
    }
    return null
  }).filter((g): g is NonNullable<typeof g> => g !== null)

  // Get recently achieved milestones (highest achieved)
  const achievedMilestones = games.map(game => {
    const milestones = calculateMilestones(game.currentPlayers)
    const highestAchieved = milestones.filter(m => m.achieved).pop()
    
    if (highestAchieved) {
      return {
        ...game,
        milestone: highestAchieved
      }
    }
    return null
  }).filter((g): g is NonNullable<typeof g> => g !== null).sort((a, b) => b.milestone.threshold - a.milestone.threshold).slice(0, 5)

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Player Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Near Milestone Games */}
        {nearMilestoneGames.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Almost There!
              </h3>
              <Badge variant="secondary" className="text-xs">
                {nearMilestoneGames.length} game{nearMilestoneGames.length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            {nearMilestoneGames.slice(0, 3).map((game, index) => (
              <motion.div
                key={game.gameId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg p-4 overflow-hidden"
              >
                {/* Animated background pulse */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-pulse" />
                
                <div className="relative flex items-center gap-3">
                  <GameIcon gameId={game.gameId} size={40} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-1">{game.gameName}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <AnimatedNumber 
                        value={game.currentPlayers} 
                        className="text-xs font-mono text-muted-foreground"
                      />
                      <span className="text-xs text-muted-foreground">
                        → {game.nextMilestone.threshold.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${game.percentageToNext}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 text-right">
                    {getIcon(game.nextMilestone.icon, `h-8 w-8 ${game.nextMilestone.color}`)}
                    <div className="text-xs font-bold text-orange-500 mt-1">
                      {game.distanceToNext.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">to go</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recently Achieved Milestones */}
        {achievedMilestones.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <PartyPopper className="h-4 w-4 text-yellow-500" />
                Recently Achieved
              </h3>
            </div>
            
            <div className="space-y-2">
              {achievedMilestones.map((game, index) => (
                <motion.div
                  key={game.gameId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <GameIcon gameId={game.gameId} size={32} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{game.gameName}</div>
                    <div className="text-xs text-muted-foreground">
                      {game.currentPlayers.toLocaleString()} players
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 text-right">
                    <Badge 
                      variant="secondary"
                      className={`${game.milestone.color} font-semibold text-xs`}
                    >
                      {getIcon(game.milestone.icon, 'h-3 w-3 inline mr-1')}
                      {game.milestone.label}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Milestone Legend */}
        <div className="pt-4 border-t border-border/50">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3">Milestone Tiers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {milestoneThresholds.map((milestone) => (
              <div 
                key={milestone.value}
                className="flex items-center gap-2 p-2 bg-accent/30 rounded text-xs"
              >
                {getIcon(milestone.icon, `h-3 w-3 ${milestone.color}`)}
                <span className="font-semibold">{milestone.value >= 1000000 ? `${milestone.value / 1000000}M` : `${milestone.value / 1000}K`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <strong className="text-primary">Did you know?</strong> The combined player base across all games is{' '}
              <strong>{games.reduce((sum, g) => sum + g.currentPlayers, 0).toLocaleString()}</strong> players!
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
