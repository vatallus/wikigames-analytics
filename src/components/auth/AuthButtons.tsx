import { useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { AuthModal } from './AuthModal'
import { useAuth } from '@/contexts/AuthContext'
import { UserMenu } from './UserMenu'

export function AuthButtons() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-20 h-10 bg-slate-800/50 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (user) {
    return <UserMenu />
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setAuthMode('login')
            setShowAuthModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Sign In</span>
        </button>

        <button
          onClick={() => {
            setAuthMode('register')
            setShowAuthModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Up</span>
        </button>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </>
  )
}
