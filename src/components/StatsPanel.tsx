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
    if (!selectedGame || !data) return null
    return data.games.find(g => g.gameId === selectedGame.id)
  }, [selectedGame, data])

  const globalStats = useMemo(() => {
    if (selectedGame) {
      const totalPlayers = getTotalPlayersForGame(selectedGame.id)
      const topCountries = getTopCountriesForGame(selectedGame.id, 5)
      return { totalPlayers, topCountries }
    }
    
    const totalPlayers = COUNTRY_DATA.reduce((sum, country) => sum + country.totalPlayers, 0)
    return { totalPlayers, topCountries: [] }
  }, [selectedGame])

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
      {/* Game Details with SteamSpy data */}
      {selectedGame && selectedGameData && (
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
