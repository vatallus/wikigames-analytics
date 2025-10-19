import { useQuery } from '@tanstack/react-query'
import { gameService } from '../services/gameService'
import { formatNumber } from '../lib/utils'
import { TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { TableRowSkeleton } from '../components/layout/LoadingSkeleton'

export default function AnalyticsPage() {
  const { data: games, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: gameService.getGames
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-400 text-lg">Game statistics and player trends</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <table className="w-full">
              <tbody>
                {[...Array(10)].map((_, i) => <TableRowSkeleton key={i} />)}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-400 text-lg">
          Game statistics and player trends
        </p>
      </div>

      {/* Top Games Leaderboard */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 text-primary-500" />
            Top Games by Current Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="pb-3 text-gray-400 font-medium">Rank</th>
                  <th className="pb-3 text-gray-400 font-medium">Game</th>
                  <th className="pb-3 text-gray-400 font-medium">Type</th>
                  <th className="pb-3 text-gray-400 font-medium text-right">Current Players</th>
                  <th className="pb-3 text-gray-400 font-medium text-right">Peak Today</th>
                </tr>
              </thead>
              <tbody>
                {games?.map((game, index) => (
                  <tr key={game.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                    <td className="py-4">
                      <span className={`
                        text-2xl font-bold
                        ${index === 0 ? 'text-yellow-500' : ''}
                        ${index === 1 ? 'text-gray-400' : ''}
                        ${index === 2 ? 'text-orange-700' : ''}
                        ${index > 2 ? 'text-gray-600' : ''}
                      `}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="font-semibold">{game.name}</div>
                    </td>
                    <td className="py-4">
                      <Badge variant="secondary">{game.type}</Badge>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Users size={16} className="text-primary-500" />
                        <span className="text-lg font-bold text-primary-500">
                          {formatNumber(game.current_players)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-gray-400">
                        {formatNumber(game.peak_players_today)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Player Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">Interactive charts coming in Day 5</p>
            <div className="h-48 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-gray-600">Chart placeholder</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">Heatmap coming in Day 5</p>
            <div className="h-48 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-gray-600">Heatmap placeholder</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
