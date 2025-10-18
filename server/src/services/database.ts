import { PrismaClient } from '../generated/prisma/index.js'

// Initialize Prisma Client with connection pooling
export const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'minimal',
})

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

/**
 * Save or update game data in database
 */
export async function upsertGame(gameData: any) {
  try {
    return await prisma.game.upsert({
      where: { id: gameData.gameId },
      update: {
        currentPlayers: gameData.currentPlayers,
        peakPlayers24h: gameData.peakPlayers24h,
        trend: gameData.trend,
        lastUpdate: new Date(),
        description: gameData.description,
        rating: gameData.rating,
        metacritic: gameData.metacritic,
        genres: gameData.genres || [],
        image: gameData.image,
        owners: gameData.owners,
        positiveReviews: gameData.positiveReviews,
        negativeReviews: gameData.negativeReviews,
        userScore: gameData.userScore,
        averagePlaytime: gameData.averagePlaytime,
        recentPlaytime: gameData.recentPlaytime,
        price: gameData.price,
        tags: gameData.tags || [],
      },
      create: {
        id: gameData.gameId,
        appId: gameData.appId || gameData.gameId,
        name: gameData.gameName,
        type: gameData.type || 'Unknown',
        currentPlayers: gameData.currentPlayers,
        peakPlayers24h: gameData.peakPlayers24h,
        trend: gameData.trend,
        description: gameData.description,
        rating: gameData.rating,
        metacritic: gameData.metacritic,
        genres: gameData.genres || [],
        image: gameData.image,
        owners: gameData.owners,
        positiveReviews: gameData.positiveReviews,
        negativeReviews: gameData.negativeReviews,
        userScore: gameData.userScore,
        averagePlaytime: gameData.averagePlaytime,
        recentPlaytime: gameData.recentPlaytime,
        price: gameData.price,
        tags: gameData.tags || [],
      },
    })
  } catch (error) {
    console.error(`Error upserting game ${gameData.gameId}:`, error)
    return null
  }
}

/**
 * Save player count history
 */
export async function savePlayerHistory(gameId: string, playerCount: number) {
  try {
    return await prisma.playerHistory.create({
      data: {
        gameId,
        playerCount,
      },
    })
  } catch (error) {
    console.error(`Error saving history for ${gameId}:`, error)
    return null
  }
}

/**
 * Get player history for a game
 */
export async function getPlayerHistory(gameId: string, hours: number = 24) {
  try {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000)
    
    return await prisma.playerHistory.findMany({
      where: {
        gameId,
        timestamp: {
          gte: since,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    })
  } catch (error) {
    console.error(`Error fetching history for ${gameId}:`, error)
    return []
  }
}

/**
 * Get all games from database
 */
export async function getAllGames() {
  try {
    return await prisma.game.findMany({
      orderBy: {
        currentPlayers: 'desc',
      },
    })
  } catch (error) {
    console.error('Error fetching games:', error)
    return []
  }
}

/**
 * Upsert country data
 */
export async function upsertCountry(code: string, name: string, totalPlayers: number, gamesData: any) {
  try {
    return await prisma.country.upsert({
      where: { code },
      update: {
        totalPlayers,
        gamesData,
        lastUpdate: new Date(),
      },
      create: {
        code,
        name,
        totalPlayers,
        gamesData,
      },
    })
  } catch (error) {
    console.error(`Error upserting country ${code}:`, error)
    return null
  }
}

/**
 * Get all countries
 */
export async function getAllCountries() {
  try {
    return await prisma.country.findMany({
      orderBy: {
        totalPlayers: 'desc',
      },
    })
  } catch (error) {
    console.error('Error fetching countries:', error)
    return []
  }
}

/**
 * Clean old player history (keep last 7 days)
 */
export async function cleanOldHistory() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const result = await prisma.playerHistory.deleteMany({
      where: {
        timestamp: {
          lt: sevenDaysAgo,
        },
      },
    })
    
    console.log(`🧹 Cleaned ${result.count} old history records`)
    return result.count
  } catch (error) {
    console.error('Error cleaning history:', error)
    return 0
  }
}

/**
 * Log API request for monitoring
 */
export async function logApiRequest(endpoint: string, method: string, statusCode: number, responseTime: number, ip?: string) {
  try {
    await prisma.apiLog.create({
      data: {
        endpoint,
        method,
        statusCode,
        responseTime,
        ip,
      },
    })
  } catch (error) {
    // Silent fail for logging
  }
}
