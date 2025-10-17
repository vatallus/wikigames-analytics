/**
 * Game Logo Service
 * Fetches real game logos from RAWG API and other sources
 */

// RAWG API (Free tier: 20,000 requests/month)
const RAWG_API_KEY = 'YOUR_API_KEY_HERE' // Get from https://rawg.io/apidocs
const RAWG_BASE_URL = 'https://api.rawg.io/api'

export interface GameLogo {
  id: string
  name: string
  backgroundImage: string
  icon?: string
  screenshots?: string[]
}

/**
 * Search game on RAWG and get logo
 */
export async function searchGameLogo(gameName: string): Promise<GameLogo | null> {
  try {
    const response = await fetch(
      `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(gameName)}&page_size=1`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch from RAWG API')
    }
    
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const game = data.results[0]
      return {
        id: game.slug,
        name: game.name,
        backgroundImage: game.background_image,
        icon: game.background_image,
        screenshots: []
      }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching game logo:', error)
    return null
  }
}

/**
 * Get Steam game header image
 * No API key needed!
 */
export function getSteamHeaderImage(appId: string): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`
}

/**
 * Steam App IDs for popular games
 */
export const STEAM_APP_IDS: { [gameId: string]: string } = {
  'csgo': '730',
  'dota2': '570',
  'pubg': '578080',
  'rust': '252490',
  'apex': '1172470',
  'tf2': '440',
  'left4dead2': '550'
}

/**
 * Fallback logo URLs from various sources
 */
export const FALLBACK_LOGOS: { [gameId: string]: string } = {
  // RAWG API images
  'valorant': 'https://media.rawg.io/media/games/1bd/1bd2657b81eb0c99338120ad444b24ff.jpg',
  'csgo': 'https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg',
  'lol': 'https://media.rawg.io/media/games/78d/78dfae12fb8c5b16cd78648553071e0a.jpg',
  'dota2': 'https://media.rawg.io/media/games/d07/d0790809a13027251b6d0f4dc7538c58.jpg',
  'fortnite': 'https://media.rawg.io/media/games/1f4/1f47a270b8f241e4676b14d39ec620f7.jpg',
  'pubg': 'https://media.rawg.io/media/games/1bd/1bd2657b81eb0c99338120ad444b24ff.jpg',
  'wow': 'https://media.rawg.io/media/games/c81/c812e158129e00c9b0f096ae8a0bb7d6.jpg',
  'ffxiv': 'https://media.rawg.io/media/games/596/596a48ef3b62b63b4cc59633e28be903.jpg',
  'starcraft': 'https://media.rawg.io/media/games/a9a/a9a2472f862b041d2980103ddbb61c91.jpg',
  'fifa': 'https://media.rawg.io/media/games/f87/f87457e8347484033cb34cde6101d08d.jpg',
  'apex': 'https://media.rawg.io/media/games/b72/b7233d5d5b1e75e86bb860ccc7aeca85.jpg',
  'overwatch': 'https://media.rawg.io/media/games/4ea/4ea507ceebeabb43edbc09468a5c9dbb.jpg',
  'minecraft': 'https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec66bbf75375c4847a2b.jpg',
  'gta5': 'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg',
}

/**
 * Get logo URL for a game
 * Priority: 1. Custom logo, 2. Steam, 3. RAWG fallback
 */
export function getGameLogoUrl(gameId: string): string | null {
  // Check fallback logos first
  if (FALLBACK_LOGOS[gameId]) {
    return FALLBACK_LOGOS[gameId]
  }
  
  // Check Steam
  if (STEAM_APP_IDS[gameId]) {
    return getSteamHeaderImage(STEAM_APP_IDS[gameId])
  }
  
  return null
}

/**
 * Cache game logos in localStorage
 */
export function cacheGameLogo(gameId: string, logoUrl: string) {
  try {
    const cache = JSON.parse(localStorage.getItem('game_logos_cache') || '{}')
    cache[gameId] = {
      url: logoUrl,
      timestamp: Date.now()
    }
    localStorage.setItem('game_logos_cache', JSON.stringify(cache))
  } catch (error) {
    console.error('Error caching logo:', error)
  }
}

/**
 * Get cached logo
 */
export function getCachedGameLogo(gameId: string): string | null {
  try {
    const cache = JSON.parse(localStorage.getItem('game_logos_cache') || '{}')
    const cached = cache[gameId]
    
    if (cached) {
      // Cache expires after 30 days
      const isExpired = Date.now() - cached.timestamp > 30 * 24 * 60 * 60 * 1000
      if (!isExpired) {
        return cached.url
      }
    }
  } catch (error) {
    console.error('Error reading cache:', error)
  }
  
  return null
}

/**
 * Example usage:
 * 
 * // Get logo from cache or fallback
 * const logoUrl = getCachedGameLogo('csgo') || getGameLogoUrl('csgo')
 * 
 * // Search for new game
 * const logo = await searchGameLogo('Elden Ring')
 * if (logo) {
 *   cacheGameLogo('eldenring', logo.backgroundImage)
 * }
 */
