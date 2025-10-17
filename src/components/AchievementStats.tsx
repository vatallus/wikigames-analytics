import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Award, Target, Zap, Star, TrendingUp, Trophy, Percent } from 'lucide-react'
import { motion } from 'framer-motion'

interface AchievementStatsProps {
  selectedGameId?: string
  games: Array<{
    gameId: string
    gameName: string
    currentPlayers: number
  }>
}

interface PlayerStat {
  category: string
  icon: any
  userValue: number
  globalAverage: number
  percentile: number
  unit: string
  badge?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress: number
  unlocked: boolean
}

export function AchievementStats({ selectedGameId: _selectedGameId, games: _games }: AchievementStatsProps) {
  // Mock user data - in real app this would come from user profile
  const [showAchievements, setShowAchievements] = useState(true)

  const generatePlayerStats = (): PlayerStat[] => {
    return [
      {
        category: 'Daily Playtime',
        icon: Zap,
        userValue: 3.5,
        globalAverage: 2.8,
        percentile: 68,
        unit: 'hours',
        badge: 'Above Average'
      },
      {
        category: 'Win Rate',
        icon: Trophy,
        userValue: 54,
        globalAverage: 50,
        percentile: 62,
        unit: '%',
        badge: 'Good'
      },
      {
        category: 'Games Played',
        icon: Target,
        userValue: 847,
        globalAverage: 523,
        percentile: 78,
        unit: 'matches',
        badge: 'Very Active'
      },
      {
        category: 'Skill Rating',
        icon: Star,
        userValue: 1845,
        globalAverage: 1500,
        percentile: 71,
        unit: 'MMR',
        badge: 'Above Average'
      }
    ]
  }

  const generateAchievements = (): Achievement[] => {
    return [
      {
        id: '1',
        title: 'Century Club',
        description: 'Play 100 matches',
        icon: Target,
        rarity: 'common',
        progress: 100,
        unlocked: true
      },
      {
        id: '2',
        title: 'Night Owl',
        description: 'Play during peak hours 50 times',
        icon: Zap,
        rarity: 'rare',
        progress: 100,
        unlocked: true
      },
      {
        id: '3',
        title: 'Global Citizen',
        description: 'Play with players from 10+ countries',
        icon: Trophy,
        rarity: 'epic',
        progress: 85,
        unlocked: false
      },
      {
        id: '4',
        title: 'Legend',
        description: 'Reach top 1% in your region',
        icon: Award,
        rarity: 'legendary',
        progress: 45,
        unlocked: false
      }
    ]
  }

  const stats = generatePlayerStats()
  const achievements = generateAchievements()

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500'
      case 'epic': return 'from-purple-500 to-pink-500'
      case 'rare': return 'from-blue-500 to-cyan-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '⭐ Legendary'
      case 'epic': return '💜 Epic'
      case 'rare': return '💎 Rare'
      default: return '🔹 Common'
    }
  }

  const getPercentileBadge = (percentile: number) => {
    if (percentile >= 90) return { text: 'Elite', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' }
    if (percentile >= 75) return { text: 'Excellent', color: 'bg-purple-500/20 text-purple-500 border-purple-500/30' }
    if (percentile >= 60) return { text: 'Good', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' }
    if (percentile >= 50) return { text: 'Average', color: 'bg-green-500/20 text-green-500 border-green-500/30' }
    return { text: 'Below Avg', color: 'bg-gray-500/20 text-gray-500 border-gray-500/30' }
  }

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Your Gaming Stats
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAchievements(!showAchievements)}
          >
            {showAchievements ? 'Hide' : 'Show'} Achievements
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Player Stats Comparison */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            You vs Global Average
          </h3>
          
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const percentileBadge = getPercentileBadge(stat.percentile)
            const difference = stat.userValue - stat.globalAverage
            const differencePercent = (difference / stat.globalAverage) * 100

            return (
              <motion.div
                key={stat.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-accent/30 rounded-lg p-4 border border-border/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold text-sm">{stat.category}</div>
                      <div className="text-xs text-muted-foreground">
                        Top {100 - stat.percentile}% globally
                      </div>
                    </div>
                  </div>
                  <Badge className={percentileBadge.color}>
                    {percentileBadge.text}
                  </Badge>
                </div>

                {/* Comparison Bars */}
                <div className="space-y-2">
                  {/* User Value */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Your Stats</span>
                      <span className="font-bold">{stat.userValue} {stat.unit}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.userValue / (stat.globalAverage * 2)) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-blue-500"
                      />
                    </div>
                  </div>

                  {/* Global Average */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Global Avg</span>
                      <span className="font-mono">{stat.globalAverage} {stat.unit}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.globalAverage / (stat.globalAverage * 2)) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        className="h-full bg-muted"
                      />
                    </div>
                  </div>
                </div>

                {/* Difference Badge */}
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <Percent className="h-3 w-3" />
                  <span className={differencePercent > 0 ? 'text-green-500' : 'text-red-500'}>
                    {differencePercent > 0 ? '+' : ''}{differencePercent.toFixed(1)}% vs average
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Achievements Section */}
        {showAchievements && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      relative rounded-lg p-3 border-2 transition-all
                      ${achievement.unlocked 
                        ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} bg-opacity-10 border-opacity-50` 
                        : 'bg-accent/20 border-border/50 opacity-60'}
                    `}
                  >
                    {/* Rarity Badge */}
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 text-xs"
                    >
                      {getRarityBadge(achievement.rarity)}
                    </Badge>

                    <div className="flex items-start gap-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${achievement.unlocked 
                          ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)}` 
                          : 'bg-muted'}
                      `}>
                        <Icon className={`h-5 w-5 ${achievement.unlocked ? 'text-white' : 'text-muted-foreground'}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm mb-0.5">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground mb-2">{achievement.description}</div>
                        
                        {/* Progress Bar */}
                        {!achievement.unlocked && (
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold">{achievement.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${achievement.progress}%` }}
                                transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
                                className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
                              />
                            </div>
                          </div>
                        )}

                        {achievement.unlocked && (
                          <Badge variant="secondary" className="text-xs text-green-500">
                            ✓ Unlocked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Overall Performance Summary */}
        <div className="bg-gradient-to-r from-primary/20 to-blue-500/20 border border-primary/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Star className="h-6 w-6 text-yellow-500" />
            <div className="flex-1">
              <div className="text-sm font-semibold mb-1">Overall Performance</div>
              <div className="text-xs text-muted-foreground">
                You're in the <strong className="text-primary">top 30%</strong> of players globally! 
                Keep playing to unlock more achievements and climb the ranks.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
