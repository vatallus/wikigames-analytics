import { getAllSteamPlayerCounts, STEAM_GAMES } from './steamService.js'
import { getGameInfo, GameInfo } from './rawgService.js'
import { getLatestNews, getUpcomingTournaments } from './gameNewsService.js'
import { getSteamSpyGameDetails } from './steamSpyService.js'
import { AggregatedData, GameData, CountryPlayerData } from '../types.js'
import { getCache, setCache, isRedisConnected } from './redis.js'
import { upsertGame, upsertCountry, savePlayerHistory, getAllGames, getAllCountries } from './database.js'

// In-memory cache as fallback
let cachedData: AggregatedData | null = null
let lastUpdate = 0
const CACHE_DURATION = 30000 // 30 seconds
const REDIS_CACHE_KEY = 'wikigames:aggregated_data'

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
  const now = Date.now()
  
  // ✅ Try Redis cache first (fastest)
  if (isRedisConnected()) {
    const cachedFromRedis = await getCache<AggregatedData>(REDIS_CACHE_KEY)
    if (cachedFromRedis) {
      console.log('⚡ Serving from Redis cache')
      return cachedFromRedis
    }
  }
  
  // ✅ Try memory cache (fast)
  if (cachedData && (now - lastUpdate) < CACHE_DURATION) {
    console.log('💾 Serving from memory cache')
    return cachedData
  }

  console.log('📊 Aggregating fresh data from sources...')

  try {
    // Get Steam data (completely free, no API key needed!)
    const steamData = await getAllSteamPlayerCounts()
    
    // Build game data - PARALLELIZED for 6x performance!
    let totalPlayers = 0
    
    // ✅ Process all games in parallel instead of sequentially
    const gamePromises = Object.entries(STEAM_GAMES).map(async ([gameId, game]) => {
      const playerCount = steamData.get(gameId) || 0
      
      // ✅ Fetch both APIs in parallel with Promise.all
      const [steamSpyData, gameInfo] = await Promise.all([
        getSteamSpyGameDetails(game.appId).catch(() => null),
        getGameInfo(game.name, process.env.RAWG_API_KEY).catch(() => null)
      ])

      // Calculate trend based on SteamSpy data
      let trend: 'up' | 'down' | 'stable' = 'stable'
      if (steamSpyData) {
        const ratio = steamSpyData.average_2weeks / (steamSpyData.average_forever || 1)
        if (ratio > 1.1) trend = 'up'
        else if (ratio < 0.9) trend = 'down'
      }

      return {
        gameId,
        gameName: game.name,
        currentPlayers: playerCount,
        peakPlayers24h: Math.floor(playerCount * 1.3), // Estimate
        trend,
        lastUpdate: new Date().toISOString(),
        sources: ['Steam API', 'SteamSpy'],
        description: gameInfo?.shortDescription || steamSpyData?.name,
        rating: gameInfo?.rating,
        metacritic: gameInfo?.metacritic,
        genres: gameInfo?.genres || (steamSpyData?.genre ? [steamSpyData.genre] : undefined),
        image: gameInfo?.image,
        // SteamSpy exclusive data
        owners: steamSpyData?.owners,
        positiveReviews: steamSpyData?.positive,
        negativeReviews: steamSpyData?.negative,
        userScore: steamSpyData?.userscore,
        averagePlaytime: steamSpyData?.average_forever,
        recentPlaytime: steamSpyData?.average_2weeks,
        price: steamSpyData?.price,
        tags: steamSpyData?.tags ? Object.keys(steamSpyData.tags).slice(0, 5) : undefined
      }
    })

    // ✅ Wait for all games to complete
    const games = await Promise.all(gamePromises)
    totalPlayers = games.reduce((sum, game) => sum + game.currentPlayers, 0)

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

    // Sort games by player count
    const sortedGames = games.sort((a, b) => b.currentPlayers - a.currentPlayers)
    
    cachedData = {
      games: sortedGames,
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
    
    // ✅ Save to database (async, don't wait)
    saveToDatabase(sortedGames, countries).catch(err => 
      console.error('Background DB save error:', err)
    )
    
    // ✅ Save to Redis cache
    if (isRedisConnected()) {
      await setCache(REDIS_CACHE_KEY, cachedData, 30)
      console.log('💾 Saved to Redis cache')
    }
    
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

/**
 * Save data to database (background task)
 */
async function saveToDatabase(games: GameData[], countries: CountryPlayerData[]): Promise<void> {
  try {
    // Save all games to database
    const gamePromises = games.map(game => {
      // Save game data
      const gamePromise = upsertGame({
        ...game,
        appId: STEAM_GAMES[game.gameId as keyof typeof STEAM_GAMES]?.appId || game.gameId,
        type: STEAM_GAMES[game.gameId as keyof typeof STEAM_GAMES]?.type || 'Unknown',
      })
      
      // Save player history
      const historyPromise = savePlayerHistory(game.gameId, game.currentPlayers)
      
      return Promise.all([gamePromise, historyPromise])
    })
    
    await Promise.all(gamePromises)
    
    // Save country data
    const countryPromises = countries.map(country =>
      upsertCountry(country.countryCode, country.countryName, country.totalPlayers, country.games)
    )
    
    await Promise.all(countryPromises)
    
    console.log('💾 Saved to database')
  } catch (error) {
    console.error('Error saving to database:', error)
  }
}
