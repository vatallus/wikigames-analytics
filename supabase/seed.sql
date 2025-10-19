-- Sample data for WikiGames Analytics

-- Insert sample games
INSERT INTO games (id, app_id, name, type, current_players, peak_players_24h, trend, description, rating, metacritic, genres, tags, image, owners, positive_reviews, negative_reviews, average_playtime, price)
VALUES 
  ('csgo', '730', 'Counter-Strike 2', 'FPS', 964105, 1253336, 'down', 'Popular tactical shooter', 4.5, 81, ARRAY['FPS', 'Shooter', 'Multiplayer'], ARRAY['Competitive', 'Tactical', 'Team-Based'], '', '100,000,000 .. 200,000,000', 7642084, 1173003, 33009, '0'),
  ('dota2', '570', 'Dota 2', 'MOBA', 456789, 623456, 'stable', 'Popular MOBA game', 4.2, 90, ARRAY['MOBA', 'Strategy'], ARRAY['Competitive', 'Team-Based'], '', '100,000,000 .. 200,000,000', 5234123, 892341, 42567, '0'),
  ('pubg', '578080', 'PUBG: BATTLEGROUNDS', 'Battle Royale', 234567, 456789, 'up', 'Battle Royale shooter', 3.8, 72, ARRAY['Battle Royale', 'Shooter'], ARRAY['Survival', 'PvP'], '', '50,000,000 .. 100,000,000', 3456789, 1234567, 25678, '0'),
  ('apex', '1172470', 'Apex Legends', 'FPS', 189234, 298765, 'up', 'Free-to-play battle royale', 4.1, 88, ARRAY['FPS', 'Battle Royale'], ARRAY['Free to Play', 'Hero Shooter'], '', '20,000,000 .. 50,000,000', 2345678, 456789, 18900, '0'),
  ('rust', '252490', 'Rust', 'Survival', 98765, 156789, 'stable', 'Survival crafting game', 4.0, 69, ARRAY['Survival', 'Crafting'], ARRAY['Multiplayer', 'Open World'], '', '10,000,000 .. 20,000,000', 1234567, 345678, 45600, '39.99')
ON CONFLICT (id) DO UPDATE SET
  current_players = EXCLUDED.current_players,
  peak_players_24h = EXCLUDED.peak_players_24h,
  trend = EXCLUDED.trend,
  last_update = NOW();

-- Insert sample countries
INSERT INTO countries (code, name, total_players, games_data)
VALUES 
  ('USA', 'United States', 5000000, '{"csgo": {"playerCount": 180000, "playRate": 18}, "dota2": {"playerCount": 95000, "playRate": 10}}'::jsonb),
  ('CHN', 'China', 12000000, '{"dota2": {"playerCount": 450000, "playRate": 25}, "pubg": {"playerCount": 380000, "playRate": 22}}'::jsonb),
  ('RUS', 'Russia', 3500000, '{"csgo": {"playerCount": 250000, "playRate": 28}, "dota2": {"playerCount": 180000, "playRate": 15}}'::jsonb),
  ('BRA', 'Brazil', 2800000, '{"csgo": {"playerCount": 120000, "playRate": 15}, "pubg": {"playerCount": 95000, "playRate": 12}}'::jsonb),
  ('DEU', 'Germany', 2100000, '{"csgo": {"playerCount": 85000, "playRate": 14}, "apex": {"playerCount": 67000, "playRate": 11}}'::jsonb)
ON CONFLICT (code) DO UPDATE SET
  total_players = EXCLUDED.total_players,
  games_data = EXCLUDED.games_data,
  last_update = NOW();

-- Insert sample player history
INSERT INTO player_history (game_id, player_count, timestamp)
SELECT 
  game_id,
  current_players + (random() * 100000 - 50000)::integer,
  NOW() - (interval '1 hour' * series)
FROM games, generate_series(1, 24) as series;
