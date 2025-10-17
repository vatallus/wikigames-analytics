import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Moon, Sun, RefreshCw, Wifi, WifiOff, Bell, Heart } from 'lucide-react'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'react-hot-toast'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Navigation } from './components/Navigation'
import { ParticleBackground } from './components/ParticleBackground'
import { NotificationPanel } from './components/NotificationPanel'
import { DonationPanel } from './components/DonationPanel'
import { HomePage } from './pages/HomePage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { LeaderboardsPage } from './pages/LeaderboardsPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { ProfilePage } from './pages/ProfilePage'
import { DonateConfirmPage } from './pages/DonateConfirmPage'
import { useRealTimeData } from './hooks/useRealTimeData'
import { useNotifications } from './hooks/useNotifications'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [donationPanelOpen, setDonationPanelOpen] = useState(false)
  const { isConnected, serverAvailable, refresh } = useRealTimeData()
  const { unreadCount } = useNotifications()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <Router>
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
                    
                    <circle cx="24" cy="24" r="22" fill="url(#logoGlow)" opacity="0.3" />
                    <circle cx="24" cy="24" r="18" fill="url(#logoGradient)" />
                    <ellipse cx="24" cy="24" rx="18" ry="6" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
                    <ellipse cx="24" cy="24" rx="18" ry="12" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
                    <path d="M 24 6 Q 30 24 24 42" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
                    <path d="M 24 6 Q 18 24 24 42" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
                    
                    <g transform="translate(24, 24)">
                      <rect x="-6" y="-3" width="12" height="6" rx="2" fill="white" opacity="0.9" />
                      <circle cx="-3" cy="0" r="1.2" fill="url(#logoGradient)" />
                      <circle cx="3" cy="0" r="1.2" fill="url(#logoGradient)" />
                      <rect x="-5" y="-4.5" width="2.5" height="1.5" rx="0.5" fill="white" opacity="0.7" />
                      <rect x="2.5" y="-4.5" width="2.5" height="1.5" rx="0.5" fill="white" opacity="0.7" />
                    </g>
                    
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

                {/* Donation Button */}
                <Button
                  onClick={() => setDonationPanelOpen(true)}
                  className="h-9 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
                >
                  <Heart className="h-4 w-4 mr-2 fill-current" />
                  <span className="hidden sm:inline">Donate</span>
                </Button>

                {/* Notifications Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNotificationPanelOpen(true)}
                  className="h-9 w-9 relative"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-2 border-background">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={refresh}
                  className="h-9 w-9"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>

                {/* Dark Mode Toggle */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="h-9 w-9"
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Bar */}
        <Navigation />

        {/* Main Content */}
        <main className="relative container mx-auto px-4 py-8 z-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/leaderboards" element={<LeaderboardsPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/donate/confirm" element={<DonateConfirmPage />} />
          </Routes>        </main>

        {/* Footer */}
        <footer className="relative border-t bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 mt-16 z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2024 WikiGames Analytics. Real-time gaming data from around the world.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Powered by Steam API</span>
                <span>•</span>
                <span>WebSocket Live Updates</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Notification Panel */}
        <NotificationPanel 
          isOpen={notificationPanelOpen} 
          onClose={() => setNotificationPanelOpen(false)} 
        />

        {/* Donation Panel */}
        <DonationPanel
          isOpen={donationPanelOpen}
          onClose={() => setDonationPanelOpen(false)}
        />

        {/* Toast Notifications */}
        <Toaster position="top-right" />

        {/* Vercel Analytics */}
        <Analytics />
      </div>
    </Router>
  )
}

export default App
