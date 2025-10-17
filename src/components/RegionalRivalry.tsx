import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Swords, Trophy, TrendingUp, Flag, Crown } from 'lucide-react'
import { motion } from 'framer-motion'
import { COUNTRY_DATA } from '@/data/mockData'

interface RegionalRivalryProps {
  selectedGameId?: string
}

interface CountryRanking {
  country: string
  countryCode: string
  players: number
  marketShare: number
  rank: number
  rivalry?: {
    opponent: string
    leadBy: number
  }
}

export function RegionalRivalry({ selectedGameId }: RegionalRivalryProps) {
  const showRivalries = true

  // Calculate rankings for selected game or overall
  const getRankings = (): CountryRanking[] => {
    const rankings: CountryRanking[] = COUNTRY_DATA.map(country => {
      let players = 0
      
      if (selectedGameId && country.games[selectedGameId]) {
        players = country.games[selectedGameId].playerCount
      } else if (!selectedGameId) {
        players = country.totalPlayers
      }
      
      return {
        country: country.country,
        countryCode: country.countryCode,
        players,
        marketShare: 0,
        rank: 0,
        rivalry: undefined
      }
    }).filter(c => c.players > 0)
    
    // Calculate market share
    const totalPlayers = rankings.reduce((sum, c) => sum + c.players, 0)
    rankings.forEach(c => {
      c.marketShare = (c.players / totalPlayers) * 100
    })
    
    // Sort and assign ranks
    rankings.sort((a, b) => b.players - a.players)
    rankings.forEach((c, i) => c.rank = i + 1)
    
    // Add rivalries (compare with next ranked country)
    rankings.forEach((c, i) => {
      if (i < rankings.length - 1) {
        const next = rankings[i + 1]
        c.rivalry = {
          opponent: next.country,
          leadBy: c.players - next.players
        }
      }
    })
    
    return rankings.slice(0, 10) // Top 10
  }

  const rankings = getRankings()
  
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-500 to-yellow-600'
      case 2: return 'from-gray-400 to-gray-500'
      case 3: return 'from-orange-600 to-orange-700'
      default: return 'from-primary to-primary/80'
    }
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return 'bg-gradient-to-r text-white font-bold'
    return 'bg-primary/20 text-primary'
  }

  const getFlagEmoji = (countryCode: string) => {
    const flags: Record<string, string> = {
      'USA': '🇺🇸', 'CHN': '🇨🇳', 'KOR': '🇰🇷', 'JPN': '🇯🇵',
      'DEU': '🇩🇪', 'GBR': '🇬🇧', 'BRA': '🇧🇷', 'RUS': '🇷🇺',
      'FRA': '🇫🇷', 'CAN': '🇨🇦', 'AUS': '🇦🇺', 'MEX': '🇲🇽',
      'IND': '🇮🇳', 'THA': '🇹🇭', 'POL': '🇵🇱'
    }
    return flags[countryCode] || '🏳️'
  }

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Swords className="h-5 w-5 text-primary" />
            Regional Rivalry Rankings
          </CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Flag className="h-3 w-3" />
            Top {rankings.length} Regions
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Champion Banner - Top Country */}
        {rankings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-yellow-500/20 border-2 border-yellow-500/40 rounded-xl p-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent animate-pulse" />
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="relative">
                  <Crown className="h-12 w-12 text-yellow-500" />
                  <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    1
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-yellow-500 font-semibold mb-1">
                  🏆 REGIONAL CHAMPION
                </div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <span className="text-3xl">{getFlagEmoji(rankings[0].countryCode)}</span>
                  {rankings[0].country}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {rankings[0].players.toLocaleString()} players • 
                  {rankings[0].marketShare.toFixed(1)}% market share
                </div>
              </div>
              {rankings[0].rivalry && (
                <div className="text-right">
                  <div className="text-xs text-yellow-500 font-semibold mb-1">LEADS BY</div>
                  <div className="text-2xl font-bold text-yellow-500">
                    +{rankings[0].rivalry.leadBy.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    vs {rankings[0].rivalry.opponent}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Rankings List */}
        <div className="space-y-2">
          {rankings.slice(1).map((country, index) => (
            <motion.div
              key={country.countryCode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + 1) * 0.05 }}
              className="group relative bg-accent/30 hover:bg-accent/50 rounded-lg p-3 transition-all cursor-pointer border border-border/50 hover:border-primary/30"
            >
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${getRankBadgeColor(country.rank)} ${getMedalColor(country.rank)}
                `}>
                  {country.rank}
                </div>

                {/* Flag */}
                <div className="text-2xl flex-shrink-0">
                  {getFlagEmoji(country.countryCode)}
                </div>

                {/* Country Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{country.country}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="font-mono">{country.players.toLocaleString()}</span>
                    <span>•</span>
                    <span>{country.marketShare.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Rivalry Info */}
                {showRivalries && country.rivalry && (
                  <div className="flex-shrink-0 text-right">
                    <Badge variant="outline" className="text-xs">
                      <Swords className="h-3 w-3 mr-1" />
                      +{country.rivalry.leadBy.toLocaleString()}
                    </Badge>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      vs {country.rivalry.opponent}
                    </div>
                  </div>
                )}

                {/* Medal Icon for Top 3 */}
                {country.rank <= 3 && (
                  <Trophy className={`
                    h-4 w-4 absolute -top-1 -right-1
                    ${country.rank === 1 ? 'text-yellow-500' :
                      country.rank === 2 ? 'text-gray-400' :
                      'text-orange-600'}
                  `} />
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${country.marketShare}%` }}
                  transition={{ delay: (index + 1) * 0.05 + 0.3, duration: 0.5 }}
                  className={`h-full bg-gradient-to-r ${getMedalColor(country.rank)}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
          <div className="text-center p-2 bg-accent/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Total Players</div>
            <div className="text-sm font-bold">
              {rankings.reduce((sum, c) => sum + c.players, 0).toLocaleString()}
            </div>
          </div>
          <div className="text-center p-2 bg-accent/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Avg per Region</div>
            <div className="text-sm font-bold">
              {Math.floor(rankings.reduce((sum, c) => sum + c.players, 0) / rankings.length).toLocaleString()}
            </div>
          </div>
          <div className="text-center p-2 bg-accent/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Regions</div>
            <div className="text-sm font-bold">{rankings.length}</div>
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground text-center">
          <TrendingUp className="h-3 w-3 inline mr-1" />
          Rankings update every 30 seconds based on live data
        </div>
      </CardContent>
    </Card>
  )
}
