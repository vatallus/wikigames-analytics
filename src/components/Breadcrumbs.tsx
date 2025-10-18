import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

export function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  const breadcrumbNameMap: { [key: string]: string } = {
    '': 'Home',
    'analytics': 'Analytics',
    'leaderboards': 'Leaderboards',
    'discover': 'Discover',
    'profile': 'Profile',
    'blog': 'Blog',
    'donate-confirm': 'Donate'
  }

  if (pathnames.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground py-3">
      <Link 
        to="/" 
        className="hover:text-foreground transition-colors flex items-center gap-1"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const displayName = breadcrumbNameMap[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1)

        return (
          <motion.div
            key={routeTo}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="text-foreground font-medium">{displayName}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-foreground transition-colors"
              >
                {displayName}
              </Link>
            )}
          </motion.div>
        )
      })}
    </nav>
  )
}
