import { supabase } from '../lib/supabase'
import type { Game, PlayerHistory } from '../types'

export const gameService = {
  // Fetch all games (using existing Game table)
  async getGames(): Promise<Game[]> {
    const { data, error } = await supabase
      .from('Game')
      .select('*')
      .order('currentPlayers', { ascending: false })
    
    if (error) throw error
    
    // Map camelCase to our snake_case types
    return (data || []).map(game => ({
      id: game.id,
      name: game.name,
      type: game.type,
      icon_url: game.image,
      current_players: game.currentPlayers || 0,
      peak_players_today: game.peakPlayers24h || 0,
      created_at: game.lastUpdate,
      updated_at: game.lastUpdate
    }))
  },

  // Fetch single game
  async getGame(id: string): Promise<Game | null> {
    const { data, error } = await supabase
      .from('Game')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    if (!data) return null
    
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      icon_url: data.image,
      current_players: data.currentPlayers || 0,
      peak_players_today: data.peakPlayers24h || 0,
      created_at: data.lastUpdate,
      updated_at: data.lastUpdate
    }
  },

  // Fetch player history for a game
  async getPlayerHistory(gameId: string, hours: number = 24): Promise<PlayerHistory[]> {
    const since = new Date()
    since.setHours(since.getHours() - hours)
    
    const { data, error } = await supabase
      .from('PlayerHistory')
      .select('*')
      .eq('gameId', gameId)
      .gte('timestamp', since.toISOString())
      .order('timestamp', { ascending: true })
    
    if (error) throw error
    
    return (data || []).map(row => ({
      id: row.id,
      game_id: row.gameId,
      player_count: row.playerCount,
      recorded_at: row.timestamp
    }))
  },

  // Get aggregated stats by country
  async getCountryStats(): Promise<{ country_code: string; country_name: string; total_players: number }[]> {
    const { data, error } = await supabase
      .from('Country')
      .select('code, name, totalPlayers')
      .order('totalPlayers', { ascending: false })
    
    if (error) throw error
    
    return (data || []).map(country => ({
      country_code: country.code,
      country_name: country.name,
      total_players: country.totalPlayers || 0
    }))
  },

  // Get global stats
  async getGlobalStats() {
    const { data: games, error } = await supabase
      .from('Game')
      .select('currentPlayers, peakPlayers24h')
    
    if (error) throw error
    
    const totalPlayers = games?.reduce((sum, game) => sum + (game.currentPlayers || 0), 0) || 0
    const totalPeak = games?.reduce((sum, game) => sum + (game.peakPlayers24h || 0), 0) || 0
    
    const { data: countries } = await supabase
      .from('Country')
      .select('code', { count: 'exact', head: true })
    
    return {
      totalPlayers,
      totalPeak,
      totalGames: games?.length || 0,
      totalCountries: countries?.length || 0
    }
  }
}
