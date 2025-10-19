-- WikiGames Analytics - Supabase Schema
-- Enable Row Level Security on all tables

-- Games table - stores current game data
CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  current_players INTEGER DEFAULT 0,
  peak_players_24h INTEGER DEFAULT 0,
  trend TEXT DEFAULT 'stable', -- 'up', 'down', 'stable'
  last_update TIMESTAMPTZ DEFAULT NOW(),
  
  -- Additional metadata
  description TEXT,
  rating REAL,
  metacritic INTEGER,
  genres TEXT[],
  tags TEXT[],
  image TEXT,
  
  -- Steam stats
  owners TEXT,
  positive_reviews INTEGER,
  negative_reviews INTEGER,
  average_playtime INTEGER,
  price TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player history - time series data
CREATE TABLE IF NOT EXISTS player_history (
  id BIGSERIAL PRIMARY KEY,
  game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_count INTEGER NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Countries table - regional statistics
CREATE TABLE IF NOT EXISTS countries (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  total_players INTEGER DEFAULT 0,
  games_data JSONB DEFAULT '{}'::jsonb, -- { gameId: { playerCount, playRate } }
  last_update TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News cache table
CREATE TABLE IF NOT EXISTS news_cache (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL, -- 'news' or 'tournament'
  title TEXT NOT NULL,
  content TEXT,
  url TEXT,
  image TEXT,
  game TEXT,
  date TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_current_players ON games(current_players DESC);
CREATE INDEX IF NOT EXISTS idx_games_trend ON games(trend);
CREATE INDEX IF NOT EXISTS idx_games_updated ON games(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_history_game_timestamp ON player_history(game_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_history_timestamp ON player_history(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);

CREATE INDEX IF NOT EXISTS idx_news_type_created ON news_cache(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_expires ON news_cache(expires_at);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_cache ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read access on games"
  ON games FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on player_history"
  ON player_history FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on countries"
  ON countries FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on news_cache"
  ON news_cache FOR SELECT
  USING (true);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_countries_updated_at
  BEFORE UPDATE ON countries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Clean up old player history (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_player_history()
RETURNS void AS $$
BEGIN
  DELETE FROM player_history
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Clean up expired news
CREATE OR REPLACE FUNCTION cleanup_expired_news()
RETURNS void AS $$
BEGIN
  DELETE FROM news_cache
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
