import { useState } from 'react'
import { WorldMap } from '@/components/WorldMap'
import { GameFilter } from '@/components/GameFilter'
import { StatsPanel } from '@/components/StatsPanel'
import { LiveStatsBar } from '@/components/LiveStatsBar'
import { Game, COUNTRY_DATA, getCountryData, CountryData } from '@/data/mockData'
import { useRealTimeData } from '@/hooks/useRealTimeData'

export function HomePage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)
  const { data, isConnected } = useRealTimeData()

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

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
          Global Gaming Analytics
        </h1>
        <p className="text-muted-foreground">
          Real-time statistics and insights from around the world
        </p>
      </div>

      {/* Live Stats Bar */}
      {data && (
        <LiveStatsBar
          totalPlayers={data.globalStats.totalPlayers}
          activeGames={data.globalStats.activeGames}
          liveCountries={data.countries.length}
          isLive={isConnected}
        />
      )}

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
