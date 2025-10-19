-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Games table (mock data for now, will integrate real APIs later)
CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  icon_url TEXT,
  current_players INTEGER DEFAULT 0,
  peak_players_today INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player history (for analytics and charts)
CREATE TABLE IF NOT EXISTS player_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id TEXT REFERENCES games(id) ON DELETE CASCADE,
  player_count INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regional data (for world map)
CREATE TABLE IF NOT EXISTS regional_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id TEXT REFERENCES games(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  country_name TEXT,
  player_count INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_player_history_game ON player_history(game_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_player_history_recorded ON player_history(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_regional_stats_game ON regional_stats(game_id);
CREATE INDEX IF NOT EXISTS idx_regional_stats_country ON regional_stats(country_code);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_stats ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view analytics)
CREATE POLICY "Public read access games" ON games FOR SELECT USING (true);
CREATE POLICY "Public read access history" ON player_history FOR SELECT USING (true);
CREATE POLICY "Public read access regional" ON regional_stats FOR SELECT USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
