import { useState } from 'react'
import { WorldMap } from '@/components/WorldMap'
import { GameFilter } from '@/components/GameFilter'
import { StatsPanel } from '@/components/StatsPanel'
import { QuickStatsWidget } from '@/components/QuickStatsWidget'
import { SEO } from '@/components/SEO'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Game, COUNTRY_DATA, getCountryData, CountryData } from '@/data/mockData'
import { useRealTimeData } from '@/hooks/useRealTimeData'

export function HomePage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)
  const { data, isLoading } = useRealTimeData()

  const countryData = data?.countries.map(c => ({
    country: c.countryName,
    countryCode: c.countryCode,
    games: c.games,
    totalPlayers: c.totalPlayers
  })) || COUNTRY_DATA

  const handleCountryClick = (countryCode: string) => {
    const country = getCountryData(countryCode)
    setSelectedCountry(country || null)
  }


  // Get trending game data
  const trendingGame = data?.games.find(g => g.trend === 'up')
  const topCountry = data?.countries[0]

  return (
    <div className="space-y-6">
      {/* SEO */}
      <SEO
        title="WikiGames - Real-time Gaming Analytics & Player Statistics"
        description="Track live player counts, trends, and statistics for 30+ popular games including CS2, Dota 2, PUBG, and more. Free real-time gaming analytics dashboard."
        keywords="gaming statistics, player count, CS2 stats, Dota 2 stats, PUBG stats, live gaming data, esports analytics"
      />

      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-3">
          Global Gaming Analytics
        </h1>
        <p className="text-muted-foreground text-lg">
          Real-time statistics and insights from around the world
        </p>
      </div>

      {/* Quick Stats Widget */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : data ? (
        <QuickStatsWidget
          totalPlayers={data.globalStats.totalPlayers}
          activeGames={data.globalStats.activeGames}
          trendingGame={trendingGame ? {
            name: trendingGame.gameName,
            change: 15
          } : undefined}
          topCountry={topCountry ? {
            name: topCountry.countryName,
            players: topCountry.totalPlayers
          } : undefined}
        />
      ) : null}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Game Filter */}
        <div className="lg:col-span-3">
          <GameFilter
            onGameSelect={setSelectedGame}
            selectedGame={selectedGame}
          />
        </div>

        {/* Center - Map */}
        <div className="lg:col-span-6">
          <div className="h-[600px] lg:h-[700px]">
            <WorldMap
              selectedGame={selectedGame}
              countryData={countryData}
              onCountryClick={handleCountryClick}
            />
          </div>
        </div>

        {/* Right Sidebar - Stats */}
        <div className="lg:col-span-3">
          <StatsPanel
            selectedGame={selectedGame}
            selectedCountry={selectedCountry}
          />
        </div>
      </div>

    </div>
  )
}
