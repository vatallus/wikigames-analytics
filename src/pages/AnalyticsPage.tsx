import { useQuery } from '@tanstack/react-query'
import { gameService } from '../services/gameService'
import { formatNumber } from '../lib/utils'
import { TrendingUp, Users } from 'lucide-react'

export default function AnalyticsPage() {
  const { data: games, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: gameService.getGames
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading analytics...</div>
        </div>
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
      <div className="mb-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <TrendingUp className="mr-2 text-primary-500" />
          Top Games by Current Players
        </h2>
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
                <tr key={game.id} className="border-b border-gray-800 last:border-0">
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
                    <span className="px-2 py-1 bg-gray-800 rounded text-sm text-gray-400">
                      {game.type}
                    </span>
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
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Player Trends</h3>
          <p className="text-gray-400">Interactive charts coming in Day 5</p>
          <div className="mt-4 h-48 bg-gray-800 rounded flex items-center justify-center">
            <span className="text-gray-600">Chart placeholder</span>
          </div>
        </div>
        
        <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Peak Hours Heatmap</h3>
          <p className="text-gray-400">Heatmap coming in Day 5</p>
          <div className="mt-4 h-48 bg-gray-800 rounded flex items-center justify-center">
            <span className="text-gray-600">Heatmap placeholder</span>
          </div>
        </div>
      </div>
    </div>
  )
}
