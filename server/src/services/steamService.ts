import fetch from 'node-fetch'

// Steam App IDs for popular games
export const STEAM_GAMES = {
  'csgo': { appId: '730', name: 'Counter-Strike: Global Offensive' },
  'dota2': { appId: '570', name: 'Dota 2' },
  'pubg': { appId: '578080', name: 'PLAYERUNKNOWN\'S BATTLEGROUNDS' },
  'rust': { appId: '252490', name: 'Rust' },
  'tf2': { appId: '440', name: 'Team Fortress 2' },
  'apex': { appId: '1172470', name: 'Apex Legends' },
}

interface SteamPlayerCount {
  response: {
    player_count: number
    result: number
  }
}

/**
 * Get current player count for a Steam game (NO API KEY NEEDED!)
 */
export async function getSteamPlayerCount(appId: string): Promise<number> {
  try {
    const url = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`
    const response = await fetch(url)
    const data = await response.json() as SteamPlayerCount
    
    if (data.response.result === 1) {
      return data.response.player_count
    }
    return 0
  } catch (error) {
    console.error(`Error fetching Steam data for app ${appId}:`, error)
    return 0
  }
}

/**
 * Get player counts for all Steam games
 */
export async function getAllSteamPlayerCounts(): Promise<Map<string, number>> {
  const results = new Map<string, number>()
  
  const promises = Object.entries(STEAM_GAMES).map(async ([gameId, game]) => {
    const count = await getSteamPlayerCount(game.appId)
    results.set(gameId, count)
  })
  
  await Promise.all(promises)
  return results
}

/**
 * Get game details from Steam (optional - requires API key for some data)
 */
export async function getSteamGameDetails(appId: string) {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`
    const response = await fetch(url)
    const data = await response.json()
    return data[appId]?.data || null
  } catch (error) {
    console.error(`Error fetching Steam game details for ${appId}:`, error)
    return null
  }
}
