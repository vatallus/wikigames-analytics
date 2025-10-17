import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart3, Trophy, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Leaderboards', href: '/leaderboards', icon: Trophy },
  { name: 'Discover', href: '/discover', icon: Sparkles },
  { name: 'Profile', href: '/profile', icon: User },
]

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-1 py-2 overflow-x-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
