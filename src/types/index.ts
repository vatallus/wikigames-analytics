export interface Game {
  id: string
  name: string
  type: string
  icon_url?: string
  current_players: number
  peak_players_today: number
  created_at: string
  updated_at: string
}

export interface PlayerHistory {
  id: string
  game_id: string
  player_count: number
  recorded_at: string
}

export interface RegionalStats {
  id: string
  game_id: string
  country_code: string
  country_name: string
  player_count: number
  recorded_at: string
}
