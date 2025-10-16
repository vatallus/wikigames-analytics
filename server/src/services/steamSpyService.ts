import fetch from 'node-fetch'

/**
 * SteamSpy API - FREE, no API key needed!
 * Provides game data including owners, average playtime, positive ratings, etc.
 */

interface SteamSpyGame {
  appid: number
  name: string
  developer: string
  publisher: string
  score_rank: string
  owners: string
  average_forever: number
  average_2weeks: number
  median_forever: number
  median_2weeks: number
  ccu: number
  price: string
  initialprice: string
  discount: string
  languages: string
  genre: string
  tags: { [key: string]: number }
  positive: number
  negative: number
  userscore: number
}

/**
 * Get game details from SteamSpy
 */
export async function getSteamSpyGameDetails(appId: string): Promise<SteamSpyGame | null> {
  try {
    const url = `https://steamspy.com/api.php?request=appdetails&appid=${appId}`
    const response = await fetch(url)
    const data = await response.json() as SteamSpyGame
    
    return data
  } catch (error) {
    console.error(`Error fetching SteamSpy data for ${appId}:`, error)
    return null
  }
}

/**
 * Get top 100 games by player count (last 2 weeks)
 */
export async function getSteamSpyTop100(): Promise<any[]> {
  try {
    const url = 'https://steamspy.com/api.php?request=top100in2weeks'
    const response = await fetch(url)
    const data = await response.json() as { [key: string]: any }
    
    return Object.values(data)
  } catch (error) {
    console.error('Error fetching SteamSpy top 100:', error)
    return []
  }
}

/**
 * Get trending games (games with increasing playtime)
 */
export async function getSteamSpyTrending(): Promise<any[]> {
  try {
    const url = 'https://steamspy.com/api.php?request=top100forever'
    const response = await fetch(url)
    const data = await response.json() as { [key: string]: any }
    
    return Object.values(data)
  } catch (error) {
    console.error('Error fetching SteamSpy trending:', error)
    return []
  }
}

/**
 * Get games by genre
 */
export async function getSteamSpyByGenre(genre: string): Promise<any[]> {
  try {
    const url = `https://steamspy.com/api.php?request=genre&genre=${encodeURIComponent(genre)}`
    const response = await fetch(url)
    const data = await response.json() as { [key: string]: any }
    
    return Object.values(data)
  } catch (error) {
    console.error(`Error fetching SteamSpy genre ${genre}:`, error)
    return []
  }
}
