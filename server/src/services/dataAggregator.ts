import { getAllSteamPlayerCounts, STEAM_GAMES } from './steamService.js'
import { getGameInfo, GameInfo } from './rawgService.js'
import { getLatestNews, getUpcomingTournaments } from './gameNewsService.js'
import { AggregatedData, GameData, CountryPlayerData } from '../types.js'

// Cache for data
let cachedData: AggregatedData | null = null
let lastUpdate = 0
const CACHE_DURATION = 30000 // 30 seconds

/**
 * Estimate regional distribution based on player counts
 * This is a simplified model - real data would come from game APIs
 */
function estimateRegionalDistribution(totalPlayers: number): CountryPlayerData[] {
  // Regional distribution percentages (based on gaming market research)
  const regions = [
    { code: 'USA', name: 'United States', share: 0.18 },
    { code: 'CHN', name: 'China', share: 0.25 },
    { code: 'JPN', name: 'Japan', share: 0.08 },
    { code: 'KOR', name: 'South Korea', share: 0.07 },
    { code: 'DEU', name: 'Germany', share: 0.05 },
    { code: 'GBR', name: 'United Kingdom', share: 0.04 },
    { code: 'BRA', name: 'Brazil', share: 0.06 },
    { code: 'RUS', name: 'Russia', share: 0.08 },
    { code: 'FRA', name: 'France', share: 0.04 },
    { code: 'CAN', name: 'Canada', share: 0.03 },
    { code: 'AUS', name: 'Australia', share: 0.02 },
    { code: 'MEX', name: 'Mexico', share: 0.03 },
    { code: 'SWE', name: 'Sweden', share: 0.02 },
    { code: 'POL', name: 'Poland', share: 0.02 },
    { code: 'TUR', name: 'Turkey', share: 0.03 },
  ]

  return regions.map(region => ({
    countryCode: region.code,
    countryName: region.name,
    games: {},
    totalPlayers: Math.floor(totalPlayers * region.share),
    lastUpdate: new Date().toISOString()
  }))
}

/**
 * Aggregate data from all free sources
 */
export async function aggregateGameData(): Promise<AggregatedData> {
  // Return cached data if still fresh
  const now = Date.now()
  if (cachedData && (now - lastUpdate) < CACHE_DURATION) {
    return cachedData
  }

  console.log('📊 Aggregating data from free sources...')

  try {
    // Get Steam data (completely free, no API key needed!)
    const steamData = await getAllSteamPlayerCounts()
    
    // Build game data
    const games: GameData[] = []
    let totalPlayers = 0

    for (const [gameId, game] of Object.entries(STEAM_GAMES)) {
      const playerCount = steamData.get(gameId) || 0
      totalPlayers += playerCount

      // Get game info from RAWG (with fallback to mock data)
      const gameInfo = await getGameInfo(game.name, process.env.RAWG_API_KEY)

      games.push({
        gameId,
        gameName: game.name,
        currentPlayers: playerCount,
        peakPlayers24h: Math.floor(playerCount * 1.3), // Estimate
        trend: 'stable',
        lastUpdate: new Date().toISOString(),
        sources: ['Steam API'],
        description: gameInfo?.shortDescription,
        rating: gameInfo?.rating,
        metacritic: gameInfo?.metacritic,
        genres: gameInfo?.genres,
        image: gameInfo?.image
      })
    }

    // Estimate regional distribution
    const countries = estimateRegionalDistribution(totalPlayers)

    // Get latest news and tournaments
    const news = await getLatestNews()
    const tournaments = await getUpcomingTournaments()

    // Distribute game players across regions
    games.forEach(game => {
      countries.forEach(country => {
        const regionalPlayers = Math.floor(game.currentPlayers * (country.totalPlayers / totalPlayers))
        if (regionalPlayers > 0) {
          country.games[game.gameId] = {
            playerCount: regionalPlayers,
            playRate: (regionalPlayers / country.totalPlayers) * 100
          }
        }
      })
    })

    cachedData = {
      games: games.sort((a, b) => b.currentPlayers - a.currentPlayers),
      countries,
      globalStats: {
        totalPlayers,
        activeGames: games.length,
        lastUpdate: new Date().toISOString()
      },
      news,
      tournaments
    }

    lastUpdate = now
    console.log(`✅ Data aggregated: ${totalPlayers.toLocaleString()} total players across ${games.length} games`)

    return cachedData
  } catch (error) {
    console.error('❌ Error aggregating data:', error)
    
    // Return cached data if available, even if stale
    if (cachedData) {
      console.log('⚠️ Returning stale cached data')
      return cachedData
    }
    
    throw error
  }
}

/**
 * Force refresh data (bypass cache)
 */
export async function forceRefresh(): Promise<AggregatedData> {
  lastUpdate = 0
  return aggregateGameData()
}

/**
 * Get cached data without refresh
 */
export function getCachedData(): AggregatedData | null {
  return cachedData
}
