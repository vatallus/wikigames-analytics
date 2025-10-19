import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart3, Compass } from 'lucide-react'

export default function Navigation() {
  const location = useLocation()
  
  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/discover', label: 'Discover', icon: Compass },
  ]
  
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary-500">
            WikiGames.org
          </Link>
          
          <div className="flex space-x-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.to
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
