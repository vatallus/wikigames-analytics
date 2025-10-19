import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useClickOutside } from '@/hooks/useClickOutside'
import { 
  User, 
  LogOut, 
  Settings, 
  Crown, 
  Trophy, 
  MessageCircle,
  ChevronDown,
  Zap
} from 'lucide-react'

export function UserMenu() {
  const { user, profile, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useClickOutside(menuRef, () => setIsOpen(false))

  // Show basic menu even if profile not loaded yet
  if (!user) return null

  const getMembershipBadge = () => {
    if (!profile) return null
    switch (profile.membership_tier) {
      case 'gold':
        return { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/20', label: 'Gold Legend' }
      case 'silver':
        return { icon: Trophy, color: 'text-gray-300', bg: 'bg-gray-300/20', label: 'Silver Pro' }
      case 'bronze':
        return { icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400/20', label: 'Bronze Gamer' }
      default:
        return null
    }
  }

  const badge = getMembershipBadge()
  const username = profile?.username || user.email?.split('@')[0] || 'User'
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => {
          console.log('UserMenu button clicked, toggling:', !isOpen)
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-colors"
      >
        {/* Avatar */}
        <div className="relative">
          <img
            src={avatarUrl}
            alt={username}
            className="w-8 h-8 rounded-full"
          />
          {profile?.is_online && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
          )}
        </div>

        {/* Info */}
        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{username}</span>
            {badge && (
              <badge.icon className={`w-3.5 h-3.5 ${badge.color}`} />
            )}
          </div>
          {profile && (
            <span className="text-xs text-gray-400">Level {profile.gaming_level}</span>
          )}
        </div>

        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl py-2 z-[9999]">
          {/* Profile header */}
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={username}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-white">{username}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            
            {badge && (
              <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-1 ${badge.bg} rounded-full`}>
                <badge.icon className={`w-3.5 h-3.5 ${badge.color}`} />
                <span className={`text-xs font-medium ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
            )}
          </div>

          {/* Menu items */}
          <div className="py-2">
            <a
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">My Profile</span>
            </a>

            <a
              href="/chat"
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Chat</span>
            </a>

            {profile?.membership_tier === 'free' && (
              <a
                href="/membership"
                className="flex items-center gap-3 px-4 py-2 text-gradient-to-r from-blue-400 to-purple-400 hover:bg-slate-700/50 transition-colors"
              >
                <Crown className="w-4 h-4" />
                <span className="text-sm font-medium">Upgrade to Premium</span>
              </a>
            )}

            <a
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </a>
          </div>

          {/* Sign out */}
          <div className="border-t border-slate-700 pt-2">
            <button
              onClick={async () => {
                console.log('Sign Out button clicked!')
                try {
                  await signOut()
                  console.log('Sign Out successful')
                  setIsOpen(false)
                  window.location.href = '/'
                } catch (error) {
                  console.error('Sign Out error:', error)
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-slate-700/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
