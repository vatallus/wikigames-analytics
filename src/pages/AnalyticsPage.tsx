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
        <div className="text-center max-w-md">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-semibold mb-2">Server Offline</p>
          <p className="text-sm text-muted-foreground mb-4">
            Backend server is not running. Start it with: <code className="bg-muted px-2 py-1 rounded">cd server && npm run dev</code>
          </p>
          <p className="text-xs text-muted-foreground">
            Using mock data for now
          </p>
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
    <div className="min-h-screen">
      {/* Hero Header with Gradient Background */}
      <div className="relative bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-cyan-500/10 border-b">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 backdrop-blur-sm border border-primary/20 mb-6">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
              Advanced Analytics
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent leading-tight">
            Gaming Analytics
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Real-time player statistics, peak hours analysis, and comprehensive game performance metrics
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium">Live Data</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border">
              <span className="font-semibold text-primary">{data.games.length}+</span>
              <span className="text-muted-foreground">Games Tracked</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border">
              <span className="font-semibold text-primary">24/7</span>
              <span className="text-muted-foreground">Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Game Filter Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Select a Game</h2>
            <p className="text-muted-foreground">Filter analytics by specific games or view all data</p>
          </div>
          <GameFilter
            onGameSelect={setSelectedGame}
            selectedGame={selectedGame}
          />
        </section>

        {/* Leaderboard Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Top Games Leaderboard</h2>
            <p className="text-muted-foreground">Live rankings by current player count</p>
          </div>
          <GameLeaderboard games={data.games} />
        </section>

        {/* Player Trend Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {selectedGame ? `${selectedGame.name} Player Trends` : 'Player Trends'}
            </h2>
            <p className="text-muted-foreground">
              {selectedGame 
                ? `Historical player count data for ${selectedGame.name}` 
                : 'Select a game to view detailed trends'}
            </p>
          </div>
          {selectedGame ? (
            <PlayerTrendChart 
              gameId={selectedGame.id} 
              gameName={selectedGame.name}
              currentPlayers={data.games.find(g => g.gameId === selectedGame.id)?.currentPlayers}
            />
          ) : (
            <PlayerTrendChart />
          )}
        </section>

        {/* Analysis Grid Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Deep Dive Analysis</h2>
            <p className="text-muted-foreground">Peak hours and game comparisons</p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <PeakHoursHeatmap 
              gameId={selectedGame?.id}
              gameName={selectedGame?.name}
              currentPlayers={selectedGame ? data.games.find(g => g.gameId === selectedGame.id)?.currentPlayers : undefined}
            />
            <GameComparison games={data.games} />
          </div>
        </section>
      </div>
    </div>
  )
}
