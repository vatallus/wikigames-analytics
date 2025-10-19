import { useQuery } from '@tanstack/react-query'
import { gameService } from '../services/gameService'
import { formatNumber } from '../lib/utils'
import { Globe, Users, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { PageLoadingSkeleton } from '../components/layout/LoadingSkeleton'

export default function HomePage() {
  const { data: games, isLoading: gamesLoading } = useQuery({
    queryKey: ['games'],
    queryFn: gameService.getGames
  })

  const { data: globalStats, isLoading: statsLoading } = useQuery({
    queryKey: ['global-stats'],
    queryFn: gameService.getGlobalStats
  })

  const { data: countryStats, isLoading: countryLoading } = useQuery({
    queryKey: ['country-stats'],
    queryFn: gameService.getCountryStats
  })

  const isLoading = gamesLoading || statsLoading || countryLoading

  if (isLoading) {
    return <PageLoadingSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">WikiGames.org</h1>
        <p className="text-gray-400 text-lg">
          Real-time Global Gaming Analytics
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="text-primary-500" size={24} />
              <h3 className="text-gray-400 text-sm">Total Players</h3>
            </div>
            <p className="text-3xl font-bold">{formatNumber(globalStats?.totalPlayers || 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Trophy className="text-yellow-500" size={24} />
              <h3 className="text-gray-400 text-sm">Peak Today</h3>
            </div>
            <p className="text-3xl font-bold">{formatNumber(globalStats?.totalPeak || 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Globe className="text-green-500" size={24} />
              <h3 className="text-gray-400 text-sm">Countries</h3>
            </div>
            <p className="text-3xl font-bold">{countryStats?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* World Map Placeholder */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>World Map</CardTitle>
          <p className="text-gray-400 text-sm">
            Interactive world map with regional player distribution (Coming in Day 4)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {countryStats?.slice(0, 8).map((country) => (
              <div key={country.country_code} className="p-3 bg-gray-800 rounded">
                <div className="text-sm text-gray-400">{country.country_name}</div>
                <div className="text-lg font-semibold">{formatNumber(country.total_players)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Games */}
      <Card>
        <CardHeader>
          <CardTitle>Top Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {games?.slice(0, 5).map((game, index) => (
              <div key={game.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-gray-600">#{index + 1}</div>
                  <div>
                    <div className="font-semibold">{game.name}</div>
                    <Badge variant="secondary" className="text-xs mt-1">{game.type}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary-500">
                    {formatNumber(game.current_players)}
                  </div>
                  <div className="text-xs text-gray-400">players</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
