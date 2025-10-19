export interface Game {
  id: string
  name: string
  type: string
  logo?: string
  icon?: string
}

export interface CountryData {
  country: string
  countryCode: string
  games: {
    [gameId: string]: {
      playerCount: number
      playRate: number // percentage of country's gaming population
    }
  }
  totalPlayers: number
}

export const GAME_TYPES = [
  'All Types',
  'FPS',
  'MOBA',
  'Battle Royale',
  'RPG',
  'Strategy',
  'Sports',
  'Racing'
]

export const GAMES: Game[] = [
  { 
    id: 'valorant', 
    name: 'Valorant', 
    type: 'FPS',
    logo: 'https://media.rawg.io/media/games/1bd/1bd2657b81eb0c99338120ad444b24ff.jpg',
    icon: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1172620/b6453c45cb9cf5b49b3bccf5f5cf90f01ff405cd.jpg'
  },
  { 
    id: 'csgo', 
    name: 'CS:GO', 
    type: 'FPS',
    logo: 'https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg',
    icon: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg'
  },
  { 
    id: 'lol', 
    name: 'League of Legends', 
    type: 'MOBA',
    logo: 'https://media.rawg.io/media/games/78d/78dfae12fb8c5b16cd78648553071e0a.jpg',
    icon: 'https://static.developer.riotgames.com/img/logo-riot.png'
  },
  { 
    id: 'dota2', 
    name: 'Dota 2', 
    type: 'MOBA',
    logo: 'https://media.rawg.io/media/games/d07/d0790809a13027251b6d0f4dc7538c58.jpg',
    icon: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg'
  },
  { 
    id: 'fortnite', 
    name: 'Fortnite', 
    type: 'Battle Royale',
    logo: 'https://media.rawg.io/media/games/1f4/1f47a270b8f241e4676b14d39ec620f7.jpg',
    icon: 'https://cdn2.unrealengine.com/24br-s24-egs-launcher-blade-2560x1440-2560x1440-da4c30806e9f.jpg'
  },
  { 
    id: 'pubg', 
    name: 'PUBG', 
    type: 'Battle Royale',
    logo: 'https://media.rawg.io/media/games/1bd/1bd2657b81eb0c99338120ad444b24ff.jpg',
    icon: 'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg'
  },
  { 
    id: 'wow', 
    name: 'World of Warcraft', 
    type: 'RPG',
    logo: 'https://media.rawg.io/media/games/c81/c812e158129e00c9b0f096ae8a0bb7d6.jpg',
    icon: 'https://bnetcmsus-a.akamaihd.net/cms/page_media/w3/W3DL4Z5T77YQ1509650287190.jpg'
  },
  { 
    id: 'ffxiv', 
    name: 'Final Fantasy XIV', 
    type: 'RPG',
    logo: 'https://media.rawg.io/media/games/596/596a48ef3b62b63b4cc59633e28be903.jpg',
    icon: 'https://img.finalfantasyxiv.com/lds/promo/h/j/6jT4thuyEP93Z99xaJIg-uJ6-w.png'
  },
  { 
    id: 'starcraft', 
    name: 'StarCraft II', 
    type: 'Strategy',
    logo: 'https://media.rawg.io/media/games/a9a/a9a2472f862b041d2980103ddbb61c91.jpg',
    icon: 'https://bnetcmsus-a.akamaihd.net/cms/page_media/NO44N7DDJAPF1464983998729.png'
  },
  { 
    id: 'fifa', 
    name: 'FIFA 24', 
    type: 'Sports',
    logo: 'https://media.rawg.io/media/games/f87/f87457e8347484033cb34cde6101d08d.jpg',
    icon: 'https://media.contentapi.ea.com/content/dam/ea/fc/fc-24/common/featured-image-16x9.jpg.adapt.crop16x9.1023w.jpg'
  },
  { 
    id: 'f1', 
    name: 'F1 2024', 
    type: 'Racing',
    logo: 'https://media.rawg.io/media/games/23d/23d78acedbb5f40aa77132d9919a2668.jpg',
    icon: 'https://cdn-products.eneba.com/resized-products/hG7JRTinUFEpWKZ1h6ykEBc7S5vDT4vVvlXgYCugTdA_350x200_1x-0.jpeg'
  },
]

// Generate mock data for countries
export const COUNTRY_DATA: CountryData[] = [
  {
    country: 'United States',
    countryCode: 'USA',
    totalPlayers: 25000000,
    games: {
      'valorant': { playerCount: 5500000, playRate: 22 },
      'csgo': { playerCount: 3200000, playRate: 12.8 },
      'lol': { playerCount: 4100000, playRate: 16.4 },
      'fortnite': { playerCount: 6800000, playRate: 27.2 },
      'pubg': { playerCount: 2100000, playRate: 8.4 },
      'wow': { playerCount: 1800000, playRate: 7.2 },
      'ffxiv': { playerCount: 920000, playRate: 3.68 },
      'fifa': { playerCount: 1200000, playRate: 4.8 },
    }
  },
  {
    country: 'China',
    countryCode: 'CHN',
    totalPlayers: 45000000,
    games: {
      'lol': { playerCount: 18000000, playRate: 40 },
      'dota2': { playerCount: 8500000, playRate: 18.9 },
      'pubg': { playerCount: 12000000, playRate: 26.7 },
      'csgo': { playerCount: 4200000, playRate: 9.3 },
      'wow': { playerCount: 1800000, playRate: 4 },
      'starcraft': { playerCount: 500000, playRate: 1.1 },
    }
  },
  {
    country: 'South Korea',
    countryCode: 'KOR',
    totalPlayers: 8500000,
    games: {
      'lol': { playerCount: 4250000, playRate: 50 },
      'valorant': { playerCount: 1700000, playRate: 20 },
      'starcraft': { playerCount: 1190000, playRate: 14 },
      'pubg': { playerCount: 850000, playRate: 10 },
      'fifa': { playerCount: 510000, playRate: 6 },
    }
  },
  {
    country: 'Japan',
    countryCode: 'JPN',
    totalPlayers: 6200000,
    games: {
      'ffxiv': { playerCount: 2480000, playRate: 40 },
      'valorant': { playerCount: 930000, playRate: 15 },
      'lol': { playerCount: 620000, playRate: 10 },
      'pubg': { playerCount: 558000, playRate: 9 },
      'fifa': { playerCount: 434000, playRate: 7 },
      'f1': { playerCount: 310000, playRate: 5 },
    }
  },
  {
    country: 'Germany',
    countryCode: 'DEU',
    totalPlayers: 5800000,
    games: {
      'csgo': { playerCount: 1740000, playRate: 30 },
      'lol': { playerCount: 1044000, playRate: 18 },
      'valorant': { playerCount: 870000, playRate: 15 },
      'fifa': { playerCount: 1160000, playRate: 20 },
      'fortnite': { playerCount: 696000, playRate: 12 },
      'f1': { playerCount: 290000, playRate: 5 },
    }
  },
  {
    country: 'United Kingdom',
    countryCode: 'GBR',
    totalPlayers: 4200000,
    games: {
      'fifa': { playerCount: 1260000, playRate: 30 },
      'fortnite': { playerCount: 840000, playRate: 20 },
      'valorant': { playerCount: 630000, playRate: 15 },
      'csgo': { playerCount: 504000, playRate: 12 },
      'lol': { playerCount: 420000, playRate: 10 },
      'f1': { playerCount: 336000, playRate: 8 },
    }
  },
  {
    country: 'Brazil',
    countryCode: 'BRA',
    totalPlayers: 12000000,
    games: {
      'lol': { playerCount: 3600000, playRate: 30 },
      'valorant': { playerCount: 2400000, playRate: 20 },
      'csgo': { playerCount: 2160000, playRate: 18 },
      'fortnite': { playerCount: 1800000, playRate: 15 },
      'fifa': { playerCount: 1440000, playRate: 12 },
      'pubg': { playerCount: 600000, playRate: 5 },
    }
  },
  {
    country: 'Russia',
    countryCode: 'RUS',
    totalPlayers: 9200000,
    games: {
      'csgo': { playerCount: 3680000, playRate: 40 },
      'dota2': { playerCount: 2760000, playRate: 30 },
      'valorant': { playerCount: 1104000, playRate: 12 },
      'pubg': { playerCount: 920000, playRate: 10 },
      'lol': { playerCount: 736000, playRate: 8 },
    }
  },
  {
    country: 'France',
    countryCode: 'FRA',
    totalPlayers: 4500000,
    games: {
      'lol': { playerCount: 900000, playRate: 20 },
      'csgo': { playerCount: 810000, playRate: 18 },
      'valorant': { playerCount: 675000, playRate: 15 },
      'fifa': { playerCount: 900000, playRate: 20 },
      'fortnite': { playerCount: 630000, playRate: 14 },
      'wow': { playerCount: 360000, playRate: 8 },
    }
  },
  {
    country: 'Canada',
    countryCode: 'CAN',
    totalPlayers: 3800000,
    games: {
      'valorant': { playerCount: 760000, playRate: 20 },
      'lol': { playerCount: 608000, playRate: 16 },
      'fortnite': { playerCount: 836000, playRate: 22 },
      'csgo': { playerCount: 456000, playRate: 12 },
      'fifa': { playerCount: 380000, playRate: 10 },
      'wow': { playerCount: 304000, playRate: 8 },
    }
  },
  {
    country: 'Australia',
    countryCode: 'AUS',
    totalPlayers: 2800000,
    games: {
      'fortnite': { playerCount: 700000, playRate: 25 },
      'valorant': { playerCount: 476000, playRate: 17 },
      'lol': { playerCount: 392000, playRate: 14 },
      'csgo': { playerCount: 336000, playRate: 12 },
      'fifa': { playerCount: 420000, playRate: 15 },
      'pubg': { playerCount: 280000, playRate: 10 },
    }
  },
  {
    country: 'Mexico',
    countryCode: 'MEX',
    totalPlayers: 5600000,
    games: {
      'fortnite': { playerCount: 1400000, playRate: 25 },
      'lol': { playerCount: 1008000, playRate: 18 },
      'valorant': { playerCount: 896000, playRate: 16 },
      'fifa': { playerCount: 840000, playRate: 15 },
      'csgo': { playerCount: 672000, playRate: 12 },
      'pubg': { playerCount: 448000, playRate: 8 },
    }
  },
  {
    country: 'Sweden',
    countryCode: 'SWE',
    totalPlayers: 1800000,
    games: {
      'csgo': { playerCount: 630000, playRate: 35 },
      'valorant': { playerCount: 324000, playRate: 18 },
      'lol': { playerCount: 270000, playRate: 15 },
      'dota2': { playerCount: 234000, playRate: 13 },
      'fifa': { playerCount: 216000, playRate: 12 },
    }
  },
  {
    country: 'Poland',
    countryCode: 'POL',
    totalPlayers: 3200000,
    games: {
      'csgo': { playerCount: 960000, playRate: 30 },
      'lol': { playerCount: 640000, playRate: 20 },
      'valorant': { playerCount: 512000, playRate: 16 },
      'dota2': { playerCount: 416000, playRate: 13 },
      'fifa': { playerCount: 384000, playRate: 12 },
    }
  },
  {
    country: 'Turkey',
    countryCode: 'TUR',
    totalPlayers: 4100000,
    games: {
      'valorant': { playerCount: 1230000, playRate: 30 },
      'lol': { playerCount: 902000, playRate: 22 },
      'csgo': { playerCount: 738000, playRate: 18 },
      'pubg': { playerCount: 574000, playRate: 14 },
      'fifa': { playerCount: 410000, playRate: 10 },
    }
  },
]

// Function to get country data by country code
export function getCountryData(countryCode: string): CountryData | undefined {
  return COUNTRY_DATA.find(c => c.countryCode === countryCode)
}

// Function to get total players for a specific game across all countries
export function getTotalPlayersForGame(gameId: string): number {
  return COUNTRY_DATA.reduce((total, country) => {
    return total + (country.games[gameId]?.playerCount || 0)
  }, 0)
}

// Function to get top countries for a specific game
export function getTopCountriesForGame(gameId: string, limit: number = 5): Array<{country: string, playerCount: number}> {
  return COUNTRY_DATA
    .map(c => ({
      country: c.country,
      playerCount: c.games[gameId]?.playerCount || 0
    }))
    .filter(c => c.playerCount > 0)
    .sort((a, b) => b.playerCount - a.playerCount)
    .slice(0, limit)
}

// Generate mock aggregated data for offline mode
export function getMockAggregatedData() {
  const games = GAMES.map(game => {
    const totalPlayers = getTotalPlayersForGame(game.id)
    const trends = ['up', 'down', 'stable'] as const
    return {
      gameId: game.id,
      gameName: game.name,
      currentPlayers: totalPlayers,
      peakPlayers24h: Math.floor(totalPlayers * 1.2),
      trend: trends[Math.floor(Math.random() * trends.length)],
      lastUpdate: new Date().toISOString(),
      sources: ['mock']
    }
  })

  const countries = COUNTRY_DATA.map(country => ({
    countryCode: country.countryCode,
    countryName: country.country,
    games: country.games,
    totalPlayers: country.totalPlayers,
    lastUpdate: new Date().toISOString()
  }))

  const totalPlayers = countries.reduce((sum, c) => sum + c.totalPlayers, 0)

  return {
    games,
    countries,
    globalStats: {
      totalPlayers,
      activeGames: games.length,
      lastUpdate: new Date().toISOString()
    },
    news: [],
    tournaments: []
  }
}
