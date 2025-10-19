import { useState } from 'react'
import { AchievementStats } from '@/components/AchievementStats'
import { PlayerTrendChart } from '@/components/PlayerTrendChart'
import { GameFilter } from '@/components/GameFilter'
import { Game } from '@/data/mockData'
import { useRealTimeData } from '@/hooks/useRealTimeData'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Calendar, Crown, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ProfilePage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const { data } = useRealTimeData()
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()

  // Loading state
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Not logged in - show login prompt
  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Login Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <User className="h-16 w-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              Please sign in to view your gaming profile
            </p>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 mx-auto"
            >
              <LogIn className="w-4 h-4" />
              Go to Home & Sign In
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const username = profile?.username || user.email?.split('@')[0] || 'User'
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
  const joinDate = new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={avatarUrl}
                alt={username}
                className="w-32 h-32 rounded-full border-4 border-primary/20"
              />
              {profile?.is_online && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900" />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {username}
                </h1>
                {profile?.membership_tier && profile.membership_tier !== 'free' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-medium">
                    <Crown className="w-4 h-4" />
                    {profile.membership_tier.charAt(0).toUpperCase() + profile.membership_tier.slice(1)} Member
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {joinDate}</span>
                </div>
                {profile && (
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <User className="w-4 h-4" />
                    <span>Level {profile.gaming_level || 1}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{profile?.gaming_level || 1}</div>
                <div className="text-xs text-muted-foreground">Level</div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{data.games.length}</div>
                <div className="text-xs text-muted-foreground">Games</div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {profile?.is_online ? 'Online' : 'Offline'}
                </div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Header */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold mb-2">
          Your Gaming Statistics
        </h2>
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
