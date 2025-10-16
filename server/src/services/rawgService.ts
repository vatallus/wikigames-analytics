import fetch from 'node-fetch'

const RAWG_API_BASE = 'https://api.rawg.io/api'

interface RawgGame {
  id: number
  name: string
  description: string
  description_raw: string
  background_image: string
  rating: number
  ratings_count: number
  metacritic: number
  genres: Array<{ name: string }>
  platforms: Array<{ platform: { name: string } }>
  released: string
  website: string
  reddit_url: string
  tags: Array<{ name: string }>
  screenshots: Array<{ image: string }>
}

interface GameInfo {
  name: string
  description: string
  shortDescription: string
  image: string
  rating: number
  metacritic: number
  genres: string[]
  platforms: string[]
  releaseDate: string
  website: string
  reddit: string
  tags: string[]
  screenshots: string[]
}

/**
 * Get detailed game information from RAWG
 */
export async function getGameInfo(gameName: string, apiKey?: string): Promise<GameInfo | null> {
  if (!apiKey) {
    console.warn('⚠️ RAWG API key not provided. Using mock data.')
    return getMockGameInfo(gameName)
  }

  try {
    // Search for game
    const searchUrl = `${RAWG_API_BASE}/games?key=${apiKey}&search=${encodeURIComponent(gameName)}&page_size=1`
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json() as { results: RawgGame[] }
    
    if (!searchData.results || searchData.results.length === 0) {
      return getMockGameInfo(gameName)
    }

    const gameId = searchData.results[0].id

    // Get detailed info
    const detailUrl = `${RAWG_API_BASE}/games/${gameId}?key=${apiKey}`
    const detailResponse = await fetch(detailUrl)
    const game = await detailResponse.json() as RawgGame

    // Get screenshots
    const screenshotsUrl = `${RAWG_API_BASE}/games/${gameId}/screenshots?key=${apiKey}`
    const screenshotsResponse = await fetch(screenshotsUrl)
    const screenshotsData = await screenshotsResponse.json() as { results: Array<{ image: string }> }

    return {
      name: game.name,
      description: game.description_raw || game.description || '',
      shortDescription: game.description_raw?.substring(0, 200) + '...' || '',
      image: game.background_image || '',
      rating: game.rating || 0,
      metacritic: game.metacritic || 0,
      genres: game.genres?.map(g => g.name) || [],
      platforms: game.platforms?.map(p => p.platform.name) || [],
      releaseDate: game.released || '',
      website: game.website || '',
      reddit: game.reddit_url || '',
      tags: game.tags?.slice(0, 10).map(t => t.name) || [],
      screenshots: screenshotsData.results?.slice(0, 5).map(s => s.image) || []
    }
  } catch (error) {
    console.error(`Error fetching RAWG data for ${gameName}:`, error)
    return getMockGameInfo(gameName)
  }
}

/**
 * Mock game info for when RAWG API is not available
 */
function getMockGameInfo(gameName: string): GameInfo {
  const mockData: { [key: string]: GameInfo } = {
    'Counter-Strike: Global Offensive': {
      name: 'Counter-Strike: Global Offensive',
      description: 'Counter-Strike: Global Offensive (CS:GO) expands upon the team-based action gameplay that it pioneered when it was launched 19 years ago. CS:GO features new maps, characters, weapons, and game modes, and delivers updated versions of the classic CS content.',
      shortDescription: 'Team-based tactical FPS featuring competitive gameplay, weapon economy, and strategic combat across classic and modern maps.',
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
      rating: 4.5,
      metacritic: 83,
      genres: ['FPS', 'Tactical', 'Competitive', 'Multiplayer'],
      platforms: ['PC', 'Mac', 'Linux'],
      releaseDate: '2012-08-21',
      website: 'https://blog.counter-strike.net/',
      reddit: 'https://reddit.com/r/GlobalOffensive',
      tags: ['FPS', 'Competitive', 'Tactical', 'Team-Based', 'eSports'],
      screenshots: []
    },
    'Dota 2': {
      name: 'Dota 2',
      description: 'Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes. And no matter if it\'s their 10th hour of play or 1,000th, there\'s always something new to discover. With regular updates that ensure a constant evolution of gameplay, features, and heroes, Dota 2 has taken on a life of its own.',
      shortDescription: 'Free-to-play MOBA with deep strategic gameplay, over 120 unique heroes, and competitive esports scene.',
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg',
      rating: 4.3,
      metacritic: 90,
      genres: ['MOBA', 'Strategy', 'Competitive', 'Free-to-Play'],
      platforms: ['PC', 'Mac', 'Linux'],
      releaseDate: '2013-07-09',
      website: 'https://www.dota2.com/',
      reddit: 'https://reddit.com/r/DotA2',
      tags: ['MOBA', 'Strategy', 'Team-Based', 'eSports', 'Free to Play'],
      screenshots: []
    },
    'PUBG': {
      name: 'PLAYERUNKNOWN\'S BATTLEGROUNDS',
      description: 'PUBG: BATTLEGROUNDS is a battle royale that pits 100 players against each other. Outplay your opponents to become the lone survivor. Survive epic 100-player battles in Classic Battle Royale, or test your skills in intense 8v8 Team Deathmatch and various Arcade modes.',
      shortDescription: 'Battle royale game where 100 players fight to be the last one standing on a massive island.',
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg',
      rating: 4.1,
      metacritic: 86,
      genres: ['Battle Royale', 'Shooter', 'Survival', 'Multiplayer'],
      platforms: ['PC', 'Xbox', 'PlayStation', 'Mobile'],
      releaseDate: '2017-12-21',
      website: 'https://www.pubg.com/',
      reddit: 'https://reddit.com/r/PUBATTLEGROUNDS',
      tags: ['Battle Royale', 'Survival', 'Shooter', 'Multiplayer', 'Competitive'],
      screenshots: []
    }
  }

  return mockData[gameName] || {
    name: gameName,
    description: `${gameName} is a popular multiplayer game with millions of active players worldwide.`,
    shortDescription: `Popular multiplayer game with competitive gameplay.`,
    image: '',
    rating: 4.0,
    metacritic: 75,
    genres: ['Multiplayer', 'Action'],
    platforms: ['PC'],
    releaseDate: '',
    website: '',
    reddit: '',
    tags: ['Multiplayer', 'Competitive'],
    screenshots: []
  }
}

export { GameInfo }
