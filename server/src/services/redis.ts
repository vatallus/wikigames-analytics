import Redis from 'ioredis'

// Initialize Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  lazyConnect: true,
})

// Connect to Redis
redis.connect().catch((err) => {
  console.warn('⚠️ Redis not available, running without cache:', err.message)
})

redis.on('error', (err) => {
  console.error('Redis error:', err.message)
})

redis.on('connect', () => {
  console.log('✅ Redis connected')
})

/**
 * Get cached data
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key)
    if (!data) return null
    
    return JSON.parse(data) as T
  } catch (error) {
    console.error(`Cache get error for ${key}:`, error)
    return null
  }
}

/**
 * Set cached data with TTL
 */
export async function setCache(key: string, value: any, ttlSeconds: number = 30): Promise<boolean> {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Cache set error for ${key}:`, error)
    return false
  }
}

/**
 * Delete cached data
 */
export async function deleteCache(key: string): Promise<boolean> {
  try {
    await redis.del(key)
    return true
  } catch (error) {
    console.error(`Cache delete error for ${key}:`, error)
    return false
  }
}

/**
 * Check if Redis is connected
 */
export function isRedisConnected(): boolean {
  return redis.status === 'ready'
}

/**
 * Get all keys matching pattern
 */
export async function getKeys(pattern: string): Promise<string[]> {
  try {
    return await redis.keys(pattern)
  } catch (error) {
    console.error(`Error getting keys for pattern ${pattern}:`, error)
    return []
  }
}

/**
 * Clear all cache (use with caution!)
 */
export async function clearAllCache(): Promise<boolean> {
  try {
    await redis.flushdb()
    console.log('🧹 All cache cleared')
    return true
  } catch (error) {
    console.error('Error clearing cache:', error)
    return false
  }
}

export default redis
