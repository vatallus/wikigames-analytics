import { config } from '@/config/env'

const API_BASE_URL = `${config.api.url}/api`
const WS_URL = config.api.wsUrl

export interface RealTimeGameData {
  gameId: string
  gameName: string
  currentPlayers: number
  peakPlayers24h: number
  trend: 'up' | 'down' | 'stable'
  lastUpdate: string
  sources: string[]
}

export interface RealTimeCountryData {
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

export interface AggregatedDataResponse {
  games: RealTimeGameData[]
  countries: RealTimeCountryData[]
  globalStats: {
    totalPlayers: number
    activeGames: number
    lastUpdate: string
  }
  news?: NewsArticle[]
  tournaments?: Tournament[]
}

/**
 * Fetch all aggregated data from backend
 */
export async function fetchGameData(): Promise<AggregatedDataResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/data`)
    const result = await response.json()
    
    if (result.success) {
      return result.data
    }
    throw new Error('Failed to fetch data')
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

/**
 * Fetch specific game data
 */
export async function fetchGameById(gameId: string): Promise<RealTimeGameData> {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}`)
  const result = await response.json()
  
  if (result.success) {
    return result.data
  }
  throw new Error('Game not found')
}

/**
 * Fetch country data
 */
export async function fetchCountryData(countryCode: string): Promise<RealTimeCountryData> {
  const response = await fetch(`${API_BASE_URL}/countries/${countryCode}`)
  const result = await response.json()
  
  if (result.success) {
    return result.data
  }
  throw new Error('Country not found')
}

/**
 * Force refresh data
 */
export async function refreshData(): Promise<AggregatedDataResponse> {
  const response = await fetch(`${API_BASE_URL}/refresh`, { method: 'POST' })
  const result = await response.json()
  
  if (result.success) {
    return result.data
  }
  throw new Error('Failed to refresh data')
}

/**
 * Create WebSocket connection for real-time updates
 */
export function createWebSocketConnection(
  onMessage: (data: AggregatedDataResponse) => void,
  onError?: (error: Event) => void
): WebSocket {
  const ws = new WebSocket(WS_URL)
  
  ws.onopen = () => {
    console.log('🔌 WebSocket connected')
  }
  
  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data)
      
      if (message.type === 'initial' || message.type === 'update') {
        onMessage(message.data)
      }
    } catch (error) {
      console.error('WebSocket message error:', error)
    }
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
    if (onError) onError(error)
  }
  
  ws.onclose = () => {
    console.log('🔌 WebSocket disconnected')
  }
  
  return ws
}

/**
 * Check server health
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${config.api.url}/health`)
    const data = await response.json()
    return data.status === 'ok'
  } catch {
    return false
  }
}
