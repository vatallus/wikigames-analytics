import { useState } from 'react'
import { AchievementStats } from '@/components/AchievementStats'
import { PlayerTrendChart } from '@/components/PlayerTrendChart'
import { GameFilter } from '@/components/GameFilter'
import { Game } from '@/data/mockData'
import { useRealTimeData } from '@/hooks/useRealTimeData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from 'lucide-react'

export function ProfilePage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const { data } = useRealTimeData()

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            Your Gaming Profile
          </span>
        </h1>
        <p className="text-muted-foreground">
          Track your achievements, stats, and compare with global players
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
          {/* Achievement Stats and Personal Trends */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AchievementStats 
              selectedGameId={selectedGame?.id}
              games={data.games}
            />
            
            {selectedGame ? (
              <PlayerTrendChart 
                gameId={selectedGame.id} 
                gameName={selectedGame.name}
                currentPlayers={data.games.find(g => g.gameId === selectedGame.id)?.currentPlayers}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Game</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Choose a game from the sidebar to view your playtime trends
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Banner */}
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">About Your Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Currently showing mock data for demonstration. In production, this page would display 
                    your actual gaming statistics, achievements, and personal progress tracked from your 
                    linked gaming accounts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
