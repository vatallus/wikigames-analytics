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

    // New 30 games logos (csgo already defined above)
    'apex': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="apexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DA291C" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="#000" />
        <path d="M16 4 L8 14 L10 24 L22 24 L24 14 Z" fill="url(#apexGrad)" />
        <path d="M16 8 L12 14 L14 20 L18 20 L20 14 Z" fill="#000" />
      </svg>
    ),
    'tf2': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="tf2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CF6A32" />
            <stop offset="100%" stopColor="#9B4F24" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#tf2Grad)" />
        <text x="16" y="23" fontFamily="Arial Black" fontSize="12" fontWeight="900" fill="white" textAnchor="middle">TF2</text>
      </svg>
    ),
    'cod-warzone': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <rect width="32" height="32" rx="6" fill="#000" />
        <circle cx="16" cy="16" r="8" fill="none" stroke="#5CDB5C" strokeWidth="2" />
        <line x1="16" y1="8" x2="16" y2="24" stroke="#5CDB5C" strokeWidth="2" />
        <line x1="8" y1="16" x2="24" y2="16" stroke="#5CDB5C" strokeWidth="2" />
      </svg>
    ),
    'destiny2': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <rect width="32" height="32" rx="6" fill="#1a1a1a" />
        <circle cx="16" cy="16" r="10" fill="none" stroke="#A3D9E9" strokeWidth="2" />
        <path d="M16 6 L16 26 M11 11 L21 21 M11 21 L21 11" stroke="#A3D9E9" strokeWidth="2" />
      </svg>
    ),
    'paladins': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="paladinsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8C00" />
            <stop offset="100%" stopColor="#FF4500" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#paladinsGrad)" />
        <circle cx="16" cy="16" r="8" fill="white" opacity="0.9" />
        <circle cx="16" cy="16" r="4" fill="url(#paladinsGrad)" />
      </svg>
    ),
    'smite': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <rect width="32" height="32" rx="6" fill="#2D2D2D" />
        <path d="M16 6 L22 16 L16 26 L10 16 Z" fill="#00AEEF" />
        <circle cx="16" cy="16" r="3" fill="white" />
      </svg>
    ),
    'naraka': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="narakaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC143C" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="#1a1a1a" />
        <path d="M16 6 L24 16 L16 12 L8 16 Z" fill="url(#narakaGrad)" />
        <path d="M16 12 L24 16 L16 26 L8 16 Z" fill="url(#narakaGrad)" opacity="0.7" />
      </svg>
    ),
    'rust': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="rustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CE422B" />
            <stop offset="100%" stopColor="#8B2A1B" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#rustGrad)" />
        <circle cx="16" cy="16" r="8" fill="none" stroke="white" strokeWidth="2" />
        <rect x="12" y="12" width="8" height="8" fill="white" />
      </svg>
    ),
    'ark': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <rect width="32" height="32" rx="6" fill="#1F4529" />
        <path d="M16 6 L24 26 L8 26 Z" fill="#5CB85C" />
        <path d="M16 12 L20 22 L12 22 Z" fill="#1F4529" />
      </svg>
    ),
    'valheim': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <rect width="32" height="32" rx="6" fill="#2C3E50" />
        <circle cx="16" cy="16" r="10" fill="none" stroke="#ECF0F1" strokeWidth="2" />
        <path d="M16 6 L16 26 M6 16 L26 16" stroke="#ECF0F1" strokeWidth="2" />
      </svg>
    ),
    'enshrouded': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="enshroudedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6A0DAD" />
            <stop offset="100%" stopColor="#4B0082" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#enshroudedGrad)" />
        <circle cx="16" cy="16" r="6" fill="white" opacity="0.3" />
      </svg>
    ),
    'palworld': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="palworldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A90E2" />
            <stop offset="100%" stopColor="#357ABD" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#palworldGrad)" />
        <circle cx="16" cy="14" r="6" fill="white" />
        <ellipse cx="16" cy="22" rx="8" ry="4" fill="white" />
      </svg>
    ),
    'lost-ark': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="lostarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="#1a1a1a" />
        <path d="M16 4 L20 12 L28 14 L22 20 L24 28 L16 24 L8 28 L10 20 L4 14 L12 12 Z" fill="url(#lostarkGrad)" />
      </svg>
    ),
    'new-world': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="newworldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#654321" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#newworldGrad)" />
        <circle cx="16" cy="16" r="8" fill="none" stroke="#FFD700" strokeWidth="2" />
        <path d="M16 8 L18 14 L24 14 L19 18 L21 24 L16 20 L11 24 L13 18 L8 14 L14 14 Z" fill="#FFD700" />
      </svg>
    ),
    'albion': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <rect width="32" height="32" rx="6" fill="#2C3E50" />
        <path d="M16 6 L22 16 L16 22 L10 16 Z" fill="#3498DB" />
        <path d="M16 10 L19 16 L16 19 L13 16 Z" fill="white" />
      </svg>
    ),
    'warframe': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <rect width="32" height="32" rx="6" fill="#1a1a1a" />
        <path d="M16 4 L24 16 L16 28 L8 16 Z" fill="#34A7C1" />
        <path d="M16 8 L20 16 L16 24 L12 16 Z" fill="#1a1a1a" />
      </svg>
    ),
    'hoi4': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="hoi4Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B0000" />
            <stop offset="100%" stopColor="#DC143C" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#hoi4Grad)" />
        <text x="16" y="20" fontFamily="serif" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">HOI4</text>
      </svg>
    ),
    'civ6': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="civ6Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4169E1" />
            <stop offset="100%" stopColor="#191970" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#civ6Grad)" />
        <path d="M8 16 L16 8 L24 16 L16 24 Z" fill="white" />
        <path d="M12 16 L16 12 L20 16 L16 20 Z" fill="url(#civ6Grad)" />
      </svg>
    ),
    'aoe2': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="aoe2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#654321" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#aoe2Grad)" />
        <path d="M16 6 L20 12 L16 18 L12 12 Z" fill="#FFD700" />
        <rect x="12" y="18" width="8" height="8" fill="#FFD700" />
      </svg>
    ),
    'fifa23': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="fifa23Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A0DC" />
            <stop offset="100%" stopColor="#0077B6" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#fifa23Grad)" />
        <circle cx="16" cy="16" r="8" fill="white" />
        <path d="M16 8 L18 14 L24 14 L19 18 L21 24 L16 20 L11 24 L13 18 L8 14 L14 14 Z" fill="url(#fifa23Grad)" />
      </svg>
    ),
    'f1-23': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="f123Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E10600" />
            <stop offset="100%" stopColor="#B00500" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#f123Grad)" />
        <text x="16" y="23" fontFamily="Arial Black" fontSize="18" fontWeight="900" fill="white" textAnchor="middle">F1</text>
      </svg>
    ),
    'iracing': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="iracingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#005CAB" />
            <stop offset="100%" stopColor="#003A70" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#iracingGrad)" />
        <text x="16" y="21" fontFamily="Arial Black" fontSize="12" fontWeight="900" fill="white" textAnchor="middle">iR</text>
      </svg>
    ),
    'gta5': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <rect width="32" height="32" rx="6" fill="#1a1a1a" />
        <text x="16" y="20" fontFamily="Pricedown, Arial Black" fontSize="14" fontWeight="900" fill="#00FF00" textAnchor="middle">GTA</text>
      </svg>
    ),
    'rocketleague': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="rlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0077FF" />
            <stop offset="100%" stopColor="#004ECC" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#rlGrad)" />
        <circle cx="16" cy="16" r="8" fill="white" />
        <circle cx="16" cy="16" r="4" fill="url(#rlGrad)" />
      </svg>
    ),
    'terraria': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="terrariaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6A9955" />
            <stop offset="100%" stopColor="#4A7735" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#terrariaGrad)" />
        <path d="M8 24 L16 8 L24 24 Z" fill="#8B4513" />
        <rect x="14" y="20" width="4" height="4" fill="#654321" />
      </svg>
    ),
    'unturned': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <rect width="32" height="32" rx="6" fill="#2C3E50" />
        <circle cx="16" cy="16" r="8" fill="#27AE60" />
        <path d="M16 8 L20 16 L16 24 L12 16 Z" fill="white" />
      </svg>
    ),
    'war-thunder': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="wtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A4A4A" />
            <stop offset="100%" stopColor="#2A2A2A" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#wtGrad)" />
        <path d="M16 6 L24 16 L16 12 L8 16 Z" fill="#FF4500" />
        <circle cx="16" cy="20" r="4" fill="#FF4500" />
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
