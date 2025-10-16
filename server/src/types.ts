export interface GameData {
  gameId: string
  gameName: string
  currentPlayers: number
  peakPlayers24h: number
  trend: 'up' | 'down' | 'stable'
  lastUpdate: string
  sources: string[]
  description?: string
  rating?: number
  metacritic?: number
  genres?: string[]
  image?: string
}

export interface CountryPlayerData {
  countryCode: string
  countryName: string
  games: {
    [gameId: string]: {
      playerCount: number
      playRate: number
    }
  }
  totalPlayers: number
  lastUpdate: string
}

export interface NewsArticle {
  id: string
  title: string
  summary: string
  url: string
  image: string
  source: string
  publishedAt: string
  game?: string
  category: string
}

export interface Tournament {
  id: string
  name: string
  game: string
  gameId: string
  prizePool: string
  startDate: string
  endDate: string
  location: string
  teams: number
  status: string
  url: string
}

export interface AggregatedData {
  games: GameData[]
  countries: CountryPlayerData[]
  globalStats: {
    totalPlayers: number
    activeGames: number
    lastUpdate: string
  }
  news?: NewsArticle[]
  tournaments?: Tournament[]
}
