import { useState, useEffect } from 'react'
import { Moon, Sun, Activity, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { WorldMap } from './components/WorldMap'
import { GameFilter } from './components/GameFilter'
import { StatsPanel } from './components/StatsPanel'
import { GameNews } from './components/GameNews'
import { Tournaments } from './components/Tournaments'
import { Game, COUNTRY_DATA, getCountryData, CountryData } from './data/mockData'
import { useRealTimeData } from './hooks/useRealTimeData'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)
  const { data, isLoading, isConnected, error, serverAvailable, refresh } = useRealTimeData()
  
  // Use real-time data if available, otherwise fall back to mock data
  const countryData = data?.countries.map(c => ({
    country: c.countryName,
    countryCode: c.countryCode,
    games: c.games,
    totalPlayers: c.totalPlayers
  })) || COUNTRY_DATA

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handleCountryClick = (countryCode: string) => {
    const country = getCountryData(countryCode)
    setSelectedCountry(country || null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">WikiGames</h1>
                <p className="text-sm text-muted-foreground">Global Gaming Analytics</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="text-right hidden sm:block">
                <div className="text-xs text-muted-foreground">
                  {serverAvailable ? 'Real-time Data' : 'Mock Data'}
                </div>
                <div className="text-sm font-semibold flex items-center gap-1">
                  {isConnected ? (
                    <>
                      <Wifi className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">Connected</span>
                    </>
                  ) : serverAvailable ? (
                    <>
                      <WifiOff className="h-3 w-3 text-yellow-500" />
                      <span className="text-yellow-500">Connecting...</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Offline</span>
                    </>
                  )}
                </div>
              </div>

              {/* Refresh Button */}
              {serverAvailable && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={refresh}
                  disabled={isLoading}
                  title="Refresh data"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              )}
              
              {/* Dark Mode Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Server Status Banner */}
        {!serverAvailable && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <WifiOff className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-yellow-500">Backend Server Not Running</h3>
                <p className="text-sm text-muted-foreground">
                  Currently using mock data. To enable real-time data from Steam API and other sources,
                  start the backend server:
                </p>
                <code className="block mt-2 p-2 bg-background rounded text-xs">
                  cd server && npm install && npm run dev
                </code>
              </div>
            </div>
          </div>
        )}

        {error && serverAvailable && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1 text-destructive">Connection Error</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        )}
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

        {/* News and Tournaments Section */}
        {data?.news && data.news.length > 0 && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GameNews news={data.news} />
            {data?.tournaments && data.tournaments.length > 0 && (
              <Tournaments tournaments={data.tournaments} />
            )}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">About This Dashboard</h3>
                {isConnected && (
                  <Badge variant="default" className="bg-green-500">
                    🔴 LIVE
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {serverAvailable ? (
                  <>
                    This dashboard displays <strong>real-time gaming statistics</strong> from Steam API and other free sources.
                    Data updates automatically every 30 seconds via WebSocket. Select a game to view its popularity by region,
                    or click on any country to see detailed gaming statistics.
                  </>
                ) : (
                  <>
                    This interactive dashboard displays gaming statistics across the globe. 
                    Select a game to view its popularity by region, or click on any country to see detailed 
                    gaming statistics for that region. Start the backend server to enable real-time data!
                  </>
                )}
              </p>
              {data && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last update: {new Date(data.globalStats.lastUpdate).toLocaleString()} •
                  Total players: {data.globalStats.totalPlayers.toLocaleString()} •
                  Active games: {data.globalStats.activeGames}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-card/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>WikiGames © 2024 - Global Gaming Analytics Platform</p>
          <p className="mt-1">Built with React, TypeScript, TailwindCSS & React Simple Maps</p>
        </div>
      </footer>
    </div>
  )
}

export default App
