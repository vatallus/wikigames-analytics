import { useState, useEffect } from 'react'
import { Moon, Sun, RefreshCw, Wifi, WifiOff, Activity } from 'lucide-react'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { WorldMap } from './components/WorldMap'
import { GameFilter } from './components/GameFilter'
import { StatsPanel } from './components/StatsPanel'
import { GameNews } from './components/GameNews'
import { Tournaments } from './components/Tournaments'
import { LiveStatsBar } from './components/LiveStatsBar'
import { GameLeaderboard } from './components/GameLeaderboard'
import { PlayerTrendChart } from './components/PlayerTrendChart'
import { ParticleBackground } from './components/ParticleBackground'
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
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Header */}
      <header className="relative border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Custom WikiGames Logo */}
              <div className="relative">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="logoGlow" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 0.8 }} />
                      <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }} />
                    </linearGradient>
                  </defs>
                  
                  {/* Glow Effect */}
                  <circle cx="24" cy="24" r="22" fill="url(#logoGlow)" opacity="0.3" />
                  
                  {/* Globe/World */}
                  <circle cx="24" cy="24" r="18" fill="url(#logoGradient)" />
                  
                  {/* Latitude Lines */}
                  <ellipse cx="24" cy="24" rx="18" ry="6" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
                  <ellipse cx="24" cy="24" rx="18" ry="12" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
                  
                  {/* Longitude Line */}
                  <path d="M 24 6 Q 30 24 24 42" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
                  <path d="M 24 6 Q 18 24 24 42" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
                  
                  {/* Gaming Controller Icon in Center */}
                  <g transform="translate(24, 24)">
                    {/* Controller Body */}
                    <rect x="-6" y="-3" width="12" height="6" rx="2" fill="white" opacity="0.9" />
                    
                    {/* D-Pad Left */}
                    <circle cx="-3" cy="0" r="1.2" fill="url(#logoGradient)" />
                    
                    {/* Buttons Right */}
                    <circle cx="3" cy="0" r="1.2" fill="url(#logoGradient)" />
                    
                    {/* Triggers */}
                    <rect x="-5" y="-4.5" width="2.5" height="1.5" rx="0.5" fill="white" opacity="0.7" />
                    <rect x="2.5" y="-4.5" width="2.5" height="1.5" rx="0.5" fill="white" opacity="0.7" />
                  </g>
                  
                  {/* Pulse Animation */}
                  <circle cx="24" cy="24" r="20" fill="none" stroke="url(#logoGradient)" strokeWidth="1" opacity="0.6">
                    <animate attributeName="r" from="20" to="23" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  WikiGames
                </h1>
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
      <main className="relative container mx-auto px-4 py-6 z-10">
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

        {/* Live Stats Bar */}
        {data && (
          <LiveStatsBar
            totalPlayers={data.globalStats.totalPlayers}
            activeGames={data.globalStats.activeGames}
            liveCountries={data.countries.length}
            isLive={isConnected}
          />
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

        {/* Game Analytics Section */}
        {data && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Game Leaderboard */}
            <GameLeaderboard games={data.games} />
            
            {/* Player Trend Chart */}
            {selectedGame ? (
              <PlayerTrendChart 
                gameId={selectedGame.id} 
                gameName={selectedGame.name}
              />
            ) : (
              <PlayerTrendChart />
            )}
          </div>
        )}

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
