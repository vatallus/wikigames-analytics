-- WikiGames Analytics - Gaming Community Features
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER PROFILES & AUTHENTICATION
-- ============================================

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  favorite_games TEXT[] DEFAULT '{}',
  gaming_level INTEGER DEFAULT 1 CHECK (gaming_level >= 1 AND gaming_level <= 100),
  total_playtime INTEGER DEFAULT 0,
  membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'bronze', 'silver', 'gold')),
  discord_id TEXT,
  twitch_id TEXT,
  steam_id TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEMBERSHIP SYSTEM
-- ============================================

-- Memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHAT SYSTEM
-- ============================================

-- Chat channels
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  game_id TEXT, -- 'csgo', 'dota2', etc.
  type TEXT NOT NULL DEFAULT 'public' CHECK (type IN ('public', 'strategy', 'vip')),
  required_tier TEXT DEFAULT 'free' CHECK (required_tier IN ('free', 'bronze', 'silver', 'gold')),
  created_by UUID REFERENCES profiles(id),
  member_count INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Channel members
CREATE TABLE IF NOT EXISTS channel_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 2000),
  mentions UUID[], -- mentioned user IDs
  reactions JSONB DEFAULT '{}', -- {emoji: [user_ids]}
  attachments JSONB, -- file URLs
  reply_to UUID REFERENCES messages(id),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Direct messages
CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_user UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 2000),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (from_user != to_user)
);

-- ============================================
-- GAMIFICATION & ACHIEVEMENTS
-- ============================================

-- User achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'first_chat', 'tournament_win', etc.
  game_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points INTEGER DEFAULT 0,
  metadata JSONB,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TOURNAMENTS (FUTURE)
-- ============================================

CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  game_id TEXT NOT NULL,
  hosted_by UUID REFERENCES profiles(id),
  max_players INTEGER,
  current_players INTEGER DEFAULT 0,
  prize_pool INTEGER,
  entry_fee INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'cancelled')),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  rules JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_membership_tier ON profiles(membership_tier);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_channels_type ON channels(type);
CREATE INDEX IF NOT EXISTS idx_channels_game_id ON channels(game_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_direct_messages_users ON direct_messages(from_user, to_user);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Memberships policies
CREATE POLICY "Users can view own membership" 
  ON memberships FOR SELECT 
  USING (auth.uid() = user_id);

-- Channels policies
CREATE POLICY "Public channels viewable by everyone"
  ON channels FOR SELECT
  USING (type = 'public' OR required_tier = 'free');

CREATE POLICY "Strategy channels viewable by silver+"
  ON channels FOR SELECT
  USING (
    type = 'strategy' AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND membership_tier IN ('silver', 'gold')
    )
  );

CREATE POLICY "VIP channels viewable by gold only"
  ON channels FOR SELECT
  USING (
    type = 'vip' AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND membership_tier = 'gold'
    )
  );

-- Messages policies
CREATE POLICY "Messages viewable by channel members"
  ON messages FOR SELECT
  USING (
    channel_id IN (
      SELECT channel_id FROM channel_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Bronze+ users can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND membership_tier IN ('bronze', 'silver', 'gold')
    )
  );

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (auth.uid() = user_id);

-- Direct messages policies
CREATE POLICY "Users can view own DMs"
  ON direct_messages FOR SELECT
  USING (auth.uid() = from_user OR auth.uid() = to_user);

CREATE POLICY "Bronze+ can send DMs"
  ON direct_messages FOR INSERT
  WITH CHECK (
    auth.uid() = from_user AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND membership_tier IN ('bronze', 'silver', 'gold')
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- SEED DATA - DEFAULT CHANNELS
-- ============================================

INSERT INTO channels (name, slug, description, game_id, type, required_tier) VALUES
  ('General Chat', 'general', 'Welcome! Chat about anything gaming related', NULL, 'public', 'free'),
  ('CS2 General', 'csgo-general', 'Counter-Strike 2 discussions', 'csgo', 'public', 'free'),
  ('Dota 2 General', 'dota2-general', 'Dota 2 community chat', 'dota2', 'public', 'free'),
  ('Valorant General', 'valorant-general', 'Valorant players unite', 'valorant', 'public', 'free'),
  ('Apex Legends', 'apex-general', 'Apex Legends squad up', 'apex', 'public', 'free'),
  ('CS2 Strategy', 'csgo-strategy', 'Advanced CS2 tactics and meta', 'csgo', 'strategy', 'silver'),
  ('Dota 2 Meta', 'dota2-meta', 'Current patch analysis', 'dota2', 'strategy', 'silver'),
  ('Gold Legends Lounge', 'gold-lounge', 'Exclusive chat for Gold members', NULL, 'vip', 'gold'),
  ('Dev Chat', 'dev-chat', 'Talk directly with the dev team', NULL, 'vip', 'gold')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE direct_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

COMMIT;
