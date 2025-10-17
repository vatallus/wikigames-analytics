import { useState } from 'react'
import { GameRecommendations } from '@/components/GameRecommendations'
import { GameNews } from '@/components/GameNews'
import { Tournaments } from '@/components/Tournaments'
import { GameFilter } from '@/components/GameFilter'
import { Game } from '@/data/mockData'
import { useRealTimeData } from '@/hooks/useRealTimeData'
import { Sparkles } from 'lucide-react'

export function DiscoverPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const { data } = useRealTimeData()

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Discover Games
          </span>
        </h1>
        <p className="text-muted-foreground">
          Personalized recommendations, latest news, and upcoming tournaments
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
          {/* Recommendations - Full Width */}
          <GameRecommendations 
            selectedGameId={selectedGame?.id}
            games={data.games}
          />

          {/* News and Tournaments */}
          {data.news && data.news.length > 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <GameNews news={data.news} />
              {data.tournaments && data.tournaments.length > 0 && (
                <Tournaments tournaments={data.tournaments} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
