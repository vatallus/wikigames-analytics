import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { TrendingUp, Users, Globe, Gamepad2 } from 'lucide-react'
import { Game, CountryData, COUNTRY_DATA, getTotalPlayersForGame, getTopCountriesForGame } from '@/data/mockData'
import { GameDetails } from './GameDetails'
import { formatNumber } from '@/lib/utils'
import { useRealTimeData } from '@/hooks/useRealTimeData'

interface StatsPanelProps {
  selectedGame: Game | null
  selectedCountry: CountryData | null
}

export function StatsPanel({ selectedGame, selectedCountry }: StatsPanelProps) {
  const { data } = useRealTimeData()

  // Find the selected game's real-time data
  const selectedGameData = useMemo(() => {
    if (!selectedGame) return null
    
    // Try to find real-time data from backend
    if (data) {
      const realTimeData = data.games.find(g => g.gameId === selectedGame.id)
      if (realTimeData) return realTimeData
    }
    
    // Fallback: Create mock data for non-Steam games
    const mockPlayerCount = getTotalPlayersForGame(selectedGame.id)
    return {
      gameId: selectedGame.id,
      gameName: selectedGame.name,
      currentPlayers: mockPlayerCount,
      // Mock SteamSpy-like data
      owners: mockPlayerCount > 10000000 ? '50,000,000 .. 100,000,000' :
              mockPlayerCount > 5000000 ? '20,000,000 .. 50,000,000' :
              mockPlayerCount > 2000000 ? '10,000,000 .. 20,000,000' :
              mockPlayerCount > 1000000 ? '5,000,000 .. 10,000,000' :
              '2,000,000 .. 5,000,000',
      positiveReviews: Math.floor(mockPlayerCount * 0.08 * 0.87), // ~8% leave reviews, 87% positive
      negativeReviews: Math.floor(mockPlayerCount * 0.08 * 0.13),
      averagePlaytime: selectedGame.type === 'MOBA' ? 35000 : // ~580 hours for MOBAs
                       selectedGame.type === 'FPS' ? 25000 :  // ~416 hours for FPS
                       selectedGame.type === 'Battle Royale' ? 20000 :
                       selectedGame.type === 'RPG' ? 40000 :
                       30000,
      recentPlaytime: 720, // ~12 hours in last 2 weeks
      price: 'Free to Play',
      tags: (() => {
        const baseTags = [selectedGame.type, 'Multiplayer']
        switch (selectedGame.type) {
          case 'FPS': return [...baseTags, 'Shooter', 'Competitive', 'Action']
          case 'MOBA': return [...baseTags, 'Strategy', 'Team-Based', 'Competitive']
          case 'Battle Royale': return [...baseTags, 'Survival', 'Last Man Standing', 'PvP']
          case 'RPG': return [...baseTags, 'Adventure', 'Story Rich', 'Character Customization']
          case 'Strategy': return [...baseTags, 'Turn-Based', 'Tactical', 'War']
          case 'Sports': return [...baseTags, 'Simulation', 'Sports', 'Realistic']
          case 'Racing': return [...baseTags, 'Driving', 'Fast-Paced', 'Simulation']
          default: return [...baseTags, 'Action', 'Online', 'Competitive']
        }
      })(),
      userScore: 87
    }
  }, [selectedGame, data])

  const globalStats = useMemo(() => {
    if (selectedGame) {
      // Use real-time data if available, otherwise fallback to mock
      const totalPlayers = selectedGameData?.currentPlayers || getTotalPlayersForGame(selectedGame.id)
      const topCountries = getTopCountriesForGame(selectedGame.id, 5)
      return { totalPlayers, topCountries }
    }
    
    // If no game selected, show global total from real-time data or mock
    const totalPlayers = data?.globalStats?.totalPlayers || COUNTRY_DATA.reduce((sum, country) => sum + country.totalPlayers, 0)
    return { totalPlayers, topCountries: [] }
  }, [selectedGame, selectedGameData, data])

  const countryStats = useMemo(() => {
    if (!selectedCountry) return null

    const games = Object.entries(selectedCountry.games)
      .map(([gameId, data]) => ({
        gameId,
        ...data
      }))
      .sort((a, b) => b.playerCount - a.playerCount)

    return { games, totalPlayers: selectedCountry.totalPlayers }
  }, [selectedCountry])

  return (
    <div className="space-y-4">
      {/* Game Details with real or mock data */}
      {selectedGameData && (
        <GameDetails game={selectedGameData} />
      )}

      {/* Global Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Global Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">
                  {selectedGame ? `${selectedGame.name} Players` : 'Total Players'}
                </div>
                <div className="text-2xl font-bold">{formatNumber(globalStats.totalPlayers)}</div>
              </div>
            </div>
          </div>

          {selectedGame && globalStats.topCountries.length > 0 && (
            <div>
              <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Top Countries
              </div>
              <div className="space-y-2">
                {globalStats.topCountries.map((country, index) => (
                  <div
                    key={country.country}
                    className="flex items-center justify-between p-2 rounded-lg bg-accent/50"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                        {index + 1}
                      </Badge>
                      <span className="text-sm font-medium">{country.country}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {formatNumber(country.playerCount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Country-Specific Stats */}
      {selectedCountry && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              {selectedCountry.country}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Total Players</div>
                <div className="text-2xl font-bold">{formatNumber(selectedCountry.totalPlayers)}</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Popular Games</div>
              <div className="space-y-2">
                {countryStats?.games.slice(0, 8).map(game => {
                  const gameInfo = selectedGame?.id === game.gameId ? selectedGame : null
                  const gameName = gameInfo?.name || game.gameId
                  
                  return (
                    <div
                      key={game.gameId}
                      className="flex items-center justify-between p-2 rounded-lg bg-accent/50"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium">{gameName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${game.playRate}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {game.playRate}%
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold ml-4">
                        {formatNumber(game.playerCount)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedCountry && !selectedGame && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-8">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Select a game or click on a country to view detailed statistics</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
