-- Insert sample games (11 popular games)
INSERT INTO games (id, name, type, current_players, peak_players_today) VALUES
('dota2', 'Dota 2', 'MOBA', 450000, 750000),
('csgo', 'Counter-Strike 2', 'FPS', 850000, 1200000),
('pubg', 'PUBG: Battlegrounds', 'Battle Royale', 320000, 580000),
('apex', 'Apex Legends', 'Battle Royale', 280000, 450000),
('valorant', 'Valorant', 'FPS', 650000, 920000),
('lol', 'League of Legends', 'MOBA', 2500000, 3800000),
('fortnite', 'Fortnite', 'Battle Royale', 1200000, 1800000),
('minecraft', 'Minecraft', 'Sandbox', 900000, 1100000),
('gta5', 'GTA V', 'Action', 180000, 250000),
('rust', 'Rust', 'Survival', 120000, 180000),
('overwatch2', 'Overwatch 2', 'FPS', 380000, 520000)
ON CONFLICT (id) DO NOTHING;

-- Generate mock player history (last 30 days, every 6 hours)
INSERT INTO player_history (game_id, player_count, recorded_at)
SELECT 
  g.id,
  FLOOR(RANDOM() * (g.peak_players_today - (g.current_players * 0.5)) + (g.current_players * 0.5))::INTEGER,
  NOW() - (i || ' hours')::INTERVAL
FROM games g
CROSS JOIN generate_series(0, 720, 6) AS i
ON CONFLICT DO NOTHING;

-- Generate mock regional data (top 20 countries)
INSERT INTO regional_stats (game_id, country_code, country_name, player_count, recorded_at)
SELECT 
  g.id,
  c.code,
  c.name,
  FLOOR(RANDOM() * (g.current_players * 0.3))::INTEGER,
  NOW()
FROM games g
CROSS JOIN (VALUES 
  ('US', 'United States'),
  ('CN', 'China'),
  ('JP', 'Japan'),
  ('KR', 'South Korea'),
  ('DE', 'Germany'),
  ('BR', 'Brazil'),
  ('RU', 'Russia'),
  ('GB', 'United Kingdom'),
  ('FR', 'France'),
  ('VN', 'Vietnam'),
  ('TH', 'Thailand'),
  ('PH', 'Philippines'),
  ('ID', 'Indonesia'),
  ('MY', 'Malaysia'),
  ('SG', 'Singapore'),
  ('AU', 'Australia'),
  ('CA', 'Canada'),
  ('MX', 'Mexico'),
  ('ES', 'Spain'),
  ('IT', 'Italy')
) AS c(code, name)
ON CONFLICT DO NOTHING;
