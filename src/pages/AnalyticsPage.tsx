import { useState } from 'react'
import { GameLeaderboard } from '@/components/GameLeaderboard'
import { PlayerTrendChart } from '@/components/PlayerTrendChart'
import { PeakHoursHeatmap } from '@/components/PeakHoursHeatmap'
import { GameComparison } from '@/components/GameComparison'
import { GameFilter } from '@/components/GameFilter'
import { Game } from '@/data/mockData'
import { useRealTimeData } from '@/hooks/useRealTimeData'
import { BarChart3 } from 'lucide-react'

export function AnalyticsPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const { data, isLoading, error, serverAvailable } = useRealTimeData()

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !serverAvailable) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center max-w-lg">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-left">
            <p className="text-lg font-semibold mb-2 text-yellow-600 dark:text-yellow-400">Server Offline</p>
            <p className="text-sm text-muted-foreground mb-3">
              Backend server is not running. Start it with:
            </p>
            <code className="block bg-muted px-3 py-2 rounded text-xs font-mono mb-3">
              cd server && npm run dev
            </code>
            <p className="text-sm font-medium text-muted-foreground">
              Using mock data for now
            </p>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Deep dive into gaming statistics, trends, and comparisons
        </p>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Game Filter */}
        <div className="lg:col-span-3">
          <GameFilter
            onGameSelect={setSelectedGame}
            selectedGame={selectedGame}
          />
        </div>

        {/* Right Content - Charts */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <GameLeaderboard games={data.games} />
            
            {selectedGame ? (
              <PlayerTrendChart 
                gameId={selectedGame.id} 
                gameName={selectedGame.name}
                currentPlayers={data.games.find(g => g.gameId === selectedGame.id)?.currentPlayers}
              />
            ) : (
              <PlayerTrendChart />
            )}
          </div>

          {/* Bottom Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <PeakHoursHeatmap 
              gameId={selectedGame?.id}
              gameName={selectedGame?.name}
              currentPlayers={selectedGame ? data.games.find(g => g.gameId === selectedGame.id)?.currentPlayers : undefined}
            />
            <GameComparison games={data.games} />
          </div>
        </div>
      </div>
    </div>
  )
}
