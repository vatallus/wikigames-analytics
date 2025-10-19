import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/layout/Navigation'
import HomePage from './pages/HomePage'
import AnalyticsPage from './pages/AnalyticsPage'
import DiscoverPage from './pages/DiscoverPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
