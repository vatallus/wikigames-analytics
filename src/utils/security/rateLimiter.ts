/**
 * Client-side Rate Limiter
 * Prevents abuse by limiting request frequency
 */

class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  /**
   * Check if a request can be made
   * @param key - Unique identifier (e.g., 'api:submit', 'login:user@email.com')
   * @param maxRequests - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns true if request is allowed, false if rate limit exceeded
   */
  canMakeRequest(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    // Filter out old requests outside the time window
    const recentRequests = requests.filter(time => now - time < windowMs)
    
    if (recentRequests.length >= maxRequests) {
      console.warn(`🚫 Rate limit exceeded for: ${key}`)
      return false
    }
    
    // Add current request
    recentRequests.push(now)
    this.requests.set(key, recentRequests)
    
    // Cleanup old entries periodically
    if (Math.random() < 0.1) { // 10% chance
      this.cleanup()
    }
    
    return true
  }
  
  /**
   * Get remaining requests for a key
   */
  getRemainingRequests(key: string, maxRequests: number, windowMs: number): number {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    const recentRequests = requests.filter(time => now - time < windowMs)
    return Math.max(0, maxRequests - recentRequests.length)
  }
  
  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.requests.delete(key)
  }
  
  /**
   * Cleanup old entries
   */
  private cleanup(): void {
    const now = Date.now()
    const maxAge = 5 * 60 * 1000 // 5 minutes
    
    for (const [key, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(time => now - time < maxAge)
      if (recentRequests.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, recentRequests)
      }
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter()

// Preset configurations
export const RATE_LIMITS = {
  LOGIN: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute
  SIGNUP: { maxRequests: 3, windowMs: 60 * 1000 }, // 3 per minute
  API_CALL: { maxRequests: 60, windowMs: 60 * 1000 }, // 60 per minute
  TRANSACTION_VERIFY: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
  SEARCH: { maxRequests: 30, windowMs: 60 * 1000 } // 30 per minute
}
