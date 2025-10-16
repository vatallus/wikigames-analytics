import fetch from 'node-fetch'

let accessToken: string | null = null
let tokenExpiry: number = 0

interface TwitchAuthResponse {
  access_token: string
  expires_in: number
  token_type: string
}

interface TwitchStream {
  user_name: string
  game_name: string
  viewer_count: number
}

/**
 * Get Twitch OAuth token (free - just need client ID/secret)
 */
async function getTwitchToken(clientId: string, clientSecret: string): Promise<string> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  try {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
    const response = await fetch(url, { method: 'POST' })
    const data = await response.json() as TwitchAuthResponse
    
    accessToken = data.access_token
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Refresh 1 min before expiry
    
    return accessToken
  } catch (error) {
    console.error('Error getting Twitch token:', error)
    throw error
  }
}

/**
 * Get viewer count for a game on Twitch (indicates popularity)
 */
export async function getTwitchViewersForGame(
  gameName: string,
  clientId: string,
  clientSecret: string
): Promise<number> {
  try {
    const token = await getTwitchToken(clientId, clientSecret)
    
    const url = `https://api.twitch.tv/helix/streams?game_id=${gameName}&first=100`
    const response = await fetch(url, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${token}`
      }
    })
    
    const data = await response.json() as { data: TwitchStream[] }
    const totalViewers = data.data.reduce((sum, stream) => sum + stream.viewer_count, 0)
    
    return totalViewers
  } catch (error) {
    console.error(`Error fetching Twitch data for ${gameName}:`, error)
    return 0
  }
}

/**
 * Get top games by viewer count on Twitch
 */
export async function getTopTwitchGames(
  clientId: string,
  clientSecret: string,
  limit: number = 20
): Promise<Array<{ name: string; viewers: number }>> {
  try {
    const token = await getTwitchToken(clientId, clientSecret)
    
    const url = `https://api.twitch.tv/helix/games/top?first=${limit}`
    const response = await fetch(url, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${token}`
      }
    })
    
    const data = await response.json() as { data: Array<{ name: string }> }
    
    // Get viewer counts for each game
    const gamesWithViewers = await Promise.all(
      data.data.map(async (game) => {
        const viewers = await getTwitchViewersForGame(game.name, clientId, clientSecret)
        return { name: game.name, viewers }
      })
    )
    
    return gamesWithViewers.sort((a, b) => b.viewers - a.viewers)
  } catch (error) {
    console.error('Error fetching top Twitch games:', error)
    return []
  }
}
