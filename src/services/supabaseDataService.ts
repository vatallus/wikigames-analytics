import { supabase } from '@/lib/supabase'
import { AggregatedDataResponse } from './apiService'

export interface GameData {
  id: string
  appId?: string
  app_id?: string
  name: string
  type: string
  currentPlayers?: number
  current_players?: number
  peakPlayers24h?: number
  peak_players_24h?: number
  trend: string
  lastUpdate?: string
  last_update?: string
  description?: string
  rating?: number
  metacritic?: number
  genres?: string[]
  tags?: string[]
  image?: string
  owners?: string
  positiveReviews?: number
  positive_reviews?: number
  negativeReviews?: number
  negative_reviews?: number
  averagePlaytime?: number
  average_playtime?: number
  price?: string
}

export interface CountryData {
  id: number
  code: string
  name: string
  totalPlayers?: number
  total_players?: number
  gamesData?: Record<string, { playerCount: number; playRate: number }>
  games_data?: Record<string, { playerCount: number; playRate: number }>
  lastUpdate?: string
  last_update?: string
}

/**
 * Fetch all games from Supabase
 */
export async function fetchGamesFromSupabase(): Promise<GameData[]> {
  const { data, error } = await supabase
    .from('Game')
    .select('*')
    .order('currentPlayers', { ascending: false })

  if (error) {
    console.error('Error fetching games:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch all countries from Supabase
 */
export async function fetchCountriesFromSupabase(): Promise<CountryData[]> {
  const { data, error } = await supabase
    .from('Country')
    .select('*')
    .order('totalPlayers', { ascending: false })

  if (error) {
    console.error('Error fetching countries:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch player history for a game
 */
export async function fetchPlayerHistory(gameId: string, limit: number = 100) {
  const { data, error } = await supabase
    .from('PlayerHistory')
    .select('*')
    .eq('gameId', gameId)
    .order('timestamp', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching player history:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch aggregated data (replacement for backend API)
 */
export async function fetchAggregatedData(): Promise<AggregatedDataResponse> {
  try {
    const [games, countries] = await Promise.all([
      fetchGamesFromSupabase(),
      fetchCountriesFromSupabase()
    ])

    // Transform to match expected format
    const transformedGames = games.map(game => ({
      gameId: game.id,
      gameName: game.name,
      currentPlayers: game.currentPlayers || game.current_players || 0,
      peakPlayers24h: game.peakPlayers24h || game.peak_players_24h || 0,
      trend: game.trend as 'up' | 'down' | 'stable',
      lastUpdate: game.lastUpdate || game.last_update || new Date().toISOString(),
      sources: ['Supabase'],
      description: game.description,
      rating: game.rating,
      metacritic: game.metacritic,
      genres: game.genres || [],
      tags: game.tags || [],
      image: game.image,
      owners: game.owners,
      positiveReviews: game.positiveReviews || game.positive_reviews,
      negativeReviews: game.negativeReviews || game.negative_reviews,
      averagePlaytime: game.averagePlaytime || game.average_playtime,
      price: game.price
    }))

    const transformedCountries = countries.map(country => ({
      countryCode: country.code,
      countryName: country.name,
      totalPlayers: country.totalPlayers || country.total_players || 0,
      games: country.gamesData || country.games_data || {},
      lastUpdate: country.lastUpdate || country.last_update || new Date().toISOString()
    }))

    const totalPlayers = transformedCountries.reduce((sum, c) => sum + c.totalPlayers, 0)

    return {
      games: transformedGames,
      countries: transformedCountries,
      globalStats: {
        totalPlayers,
        activeGames: transformedGames.length,
        lastUpdate: new Date().toISOString()
      },
      news: [],
      tournaments: []
    }
  } catch (error) {
    console.error('Error fetching aggregated data:', error)
    throw error
  }
}

/**
 * Subscribe to real-time game updates
 */
export function subscribeToGames(callback: (games: GameData[]) => void) {
  const channel = supabase
    .channel('games-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'Game'
      },
      async () => {
        // Fetch fresh data when any change occurs
        const games = await fetchGamesFromSupabase()
        callback(games)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
