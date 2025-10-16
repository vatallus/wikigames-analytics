import fetch from 'node-fetch'

// Steam App IDs for popular games (All FREE to track - no API key needed!)
export const STEAM_GAMES = {
  // FPS Games
  'csgo': { appId: '730', name: 'Counter-Strike 2', type: 'FPS' },
  'apex': { appId: '1172470', name: 'Apex Legends', type: 'FPS' },
  'tf2': { appId: '440', name: 'Team Fortress 2', type: 'FPS' },
  'cod-warzone': { appId: '1938090', name: 'Call of Duty: Warzone', type: 'FPS' },
  'destiny2': { appId: '1085660', name: 'Destiny 2', type: 'FPS' },
  'paladins': { appId: '444090', name: 'Paladins', type: 'FPS' },
  
  // MOBA Games
  'dota2': { appId: '570', name: 'Dota 2', type: 'MOBA' },
  'smite': { appId: '386360', name: 'SMITE', type: 'MOBA' },
  
  // Battle Royale
  'pubg': { appId: '578080', name: 'PUBG: BATTLEGROUNDS', type: 'Battle Royale' },
  'naraka': { appId: '1203220', name: 'NARAKA: BLADEPOINT', type: 'Battle Royale' },
  
  // Survival/Crafting
  'rust': { appId: '252490', name: 'Rust', type: 'Survival' },
  'ark': { appId: '346110', name: 'ARK: Survival Evolved', type: 'Survival' },
  'valheim': { appId: '892970', name: 'Valheim', type: 'Survival' },
  'enshrouded': { appId: '1203620', name: 'Enshrouded', type: 'Survival' },
  'palworld': { appId: '1623730', name: 'Palworld', type: 'Survival' },
  
  // MMO/RPG
  'lost-ark': { appId: '1599340', name: 'Lost Ark', type: 'MMO' },
  'new-world': { appId: '1063730', name: 'New World', type: 'MMO' },
  'albion': { appId: '761890', name: 'Albion Online', type: 'MMO' },
  'warframe': { appId: '230410', name: 'Warframe', type: 'MMO' },
  
  // Strategy
  'hoi4': { appId: '394360', name: 'Hearts of Iron IV', type: 'Strategy' },
  'civ6': { appId: '289070', name: 'Civilization VI', type: 'Strategy' },
  'aoe2': { appId: '813780', name: 'Age of Empires II: DE', type: 'Strategy' },
  
  // Sports/Racing
  'fifa23': { appId: '1811260', name: 'EA SPORTS FC 24', type: 'Sports' },
  'f1-23': { appId: '2108330', name: 'F1 23', type: 'Racing' },
  'iracing': { appId: '266410', name: 'iRacing', type: 'Racing' },
  
  // Popular Multiplayer
  'gta5': { appId: '271590', name: 'Grand Theft Auto V', type: 'Action' },
  'rocketleague': { appId: '252950', name: 'Rocket League', type: 'Sports' },
  'terraria': { appId: '105600', name: 'Terraria', type: 'Sandbox' },
  'unturned': { appId: '304930', name: 'Unturned', type: 'Survival' },
  'war-thunder': { appId: '236390', name: 'War Thunder', type: 'Action' },
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
