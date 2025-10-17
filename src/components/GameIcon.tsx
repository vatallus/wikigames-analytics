import { GAMES } from '@/data/mockData'
import { useState } from 'react'

interface GameIconProps {
  gameId: string
  size?: number
  className?: string
}

export function GameIcon({ gameId, size = 32, className = '' }: GameIconProps) {
  const [imageError, setImageError] = useState(false)
  
  // Get game from data
  const game = GAMES.find(g => g.id === gameId)
  const logoUrl = game?.icon || game?.logo
  
  // If we have a real logo and no error, use it
  if (logoUrl && !imageError) {
    return (
      <img 
        src={logoUrl} 
        alt={game?.name || gameId}
        className={`rounded-lg object-cover ${className}`}
        style={{ width: size, height: size }}
        onError={() => setImageError(true)}
      />
    )
  }
  
  // Fallback to SVG icons
  const icons: { [key: string]: JSX.Element } = {
    valorant: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="valorantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4655" />
            <stop offset="100%" stopColor="#DC143C" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#valorantGrad)" />
        <path d="M16 4L6 28h6l4-8 4 8h6L16 4z" fill="white" />
      </svg>
    ),
    
    csgo: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="csgoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="16" fill="url(#csgoGrad)" />
        <g transform="translate(8, 10)">
          <circle cx="8" cy="6" r="5" fill="none" stroke="white" strokeWidth="1.5" />
          <line x1="8" y1="1" x2="8" y2="11" stroke="white" strokeWidth="1.5" />
          <line x1="3" y1="6" x2="13" y2="6" stroke="white" strokeWidth="1.5" />
          <circle cx="8" cy="6" r="1.5" fill="white" />
        </g>
      </svg>
    ),
    
    lol: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="lolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C89B3C" />
            <stop offset="100%" stopColor="#785A28" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="#0A1428" />
        <path d="M16 6L22 12v8l-6 6-6-6v-8l6-6z" fill="url(#lolGrad)" />
        <path d="M16 10L19 13v6l-3 3-3-3v-6l3-3z" fill="#0A1428" />
      </svg>
    ),
    
    dota2: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="dotaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#AF1F26" />
            <stop offset="100%" stopColor="#7A1419" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="16" fill="url(#dotaGrad)" />
        <path d="M16 6 L11 12 L11 20 L16 26 L21 20 L21 12 Z" fill="white" />
        <path d="M16 10 L13 14 L13 18 L16 22 L19 18 L19 14 Z" fill="url(#dotaGrad)" />
      </svg>
    ),
    
    fortnite: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="fortniteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D1FF" />
            <stop offset="100%" stopColor="#0080FF" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#fortniteGrad)" />
        <text x="16" y="22" fontFamily="Arial Black" fontSize="20" fontWeight="900" fill="white" textAnchor="middle">F</text>
      </svg>
    ),
    
    pubg: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="pubgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="#1a1a1a" />
        <circle cx="16" cy="16" r="10" fill="none" stroke="url(#pubgGrad)" strokeWidth="2" />
        <circle cx="16" cy="16" r="6" fill="none" stroke="url(#pubgGrad)" strokeWidth="2" />
        <circle cx="16" cy="16" r="2" fill="url(#pubgGrad)" />
      </svg>
    ),
    
    wow: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="wowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B4FF" />
            <stop offset="100%" stopColor="#0080D6" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="16" fill="url(#wowGrad)" />
        <path d="M16 6 L12 14 L8 10 L10 18 L6 20 L12 22 L10 26 L16 22 L22 26 L20 22 L26 20 L22 18 L24 10 L20 14 Z" fill="white" />
      </svg>
    ),
    
    ffxiv: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="ffxivGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9B59B6" />
            <stop offset="100%" stopColor="#663399" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#ffxivGrad)" />
        <text x="16" y="23" fontFamily="serif" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">XIV</text>
      </svg>
    ),
    
    starcraft: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="scGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#0080B3" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="16" fill="#0A0E27" />
        <polygon points="16,6 22,12 22,20 16,26 10,20 10,12" fill="url(#scGrad)" />
        <polygon points="16,10 19,13 19,19 16,22 13,19 13,13" fill="#0A0E27" />
        <circle cx="16" cy="16" r="3" fill="url(#scGrad)" />
      </svg>
    ),
    
    fifa: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="fifaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A0DC" />
            <stop offset="100%" stopColor="#0077B6" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#fifaGrad)" />
        <circle cx="16" cy="16" r="8" fill="white" />
        <path d="M16 8 L18 14 L24 14 L19 18 L21 24 L16 20 L11 24 L13 18 L8 14 L14 14 Z" fill="url(#fifaGrad)" />
      </svg>
    ),
    
    f1: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="f1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E10600" />
            <stop offset="100%" stopColor="#B00500" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#f1Grad)" />
        <text x="16" y="23" fontFamily="Arial Black" fontSize="18" fontWeight="900" fill="white" textAnchor="middle">F1</text>
      </svg>
    ),
  }

  return icons[gameId] || (
    <div 
      className={`flex items-center justify-center bg-gray-600 rounded ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-white text-xs">?</span>
    </div>
  )
}
