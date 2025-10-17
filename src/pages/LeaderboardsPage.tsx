import { useState } from 'react'
import { RegionalRivalry } from '@/components/RegionalRivalry'
import { PlayerMilestones } from '@/components/PlayerMilestones'
import { GameLeaderboard } from '@/components/GameLeaderboard'
import { GameFilter } from '@/components/GameFilter'
import { Game } from '@/data/mockData'
import { useRealTimeData } from '@/hooks/useRealTimeData'
import { Trophy } from 'lucide-react'

export function LeaderboardsPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const { data } = useRealTimeData()

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading leaderboards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Leaderboards & Rankings
          </span>
        </h1>
        <p className="text-muted-foreground">
          Competitive rankings, regional rivalries, and milestone achievements
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Game Filter */}
        <div className="lg:col-span-3">
          <GameFilter
            onGameSelect={setSelectedGame}
            selectedGame={selectedGame}
          />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Games Leaderboard + Milestones */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <GameLeaderboard games={data.games} />
            </div>
            <div>
              <PlayerMilestones games={data.games} />
            </div>
          </div>

          {/* Regional Rivalry - Full Width */}
          <RegionalRivalry selectedGameId={selectedGame?.id} />
        </div>
      </div>
    </div>
  )
}
