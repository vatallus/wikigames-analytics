-- ============================================
-- WikiGames Simple Migration
-- Basic tables without complex triggers
-- Copy this SQL and run in Supabase SQL Editor
-- ============================================

-- Step 1: Create enums
DO $$ BEGIN
  CREATE TYPE user_rank AS ENUM ('newbie', 'member', 'contributor', 'veteran', 'moderator', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE post_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE channel_type AS ENUM ('text', 'voice', 'announcement');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Step 2: Alter profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rank user_rank DEFAULT 'newbie';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- Step 3: Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_id TEXT REFERENCES "Game"(id) ON DELETE SET NULL,
  status post_status DEFAULT 'pending',
  upvotes_count INTEGER DEFAULT 0,
  downvotes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create post_votes table
CREATE TABLE IF NOT EXISTS post_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_upvote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Step 5: Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 6: Create channels table
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type channel_type DEFAULT 'text',
  game_id TEXT REFERENCES "Game"(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 7: Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 8: Create channel_members table
CREATE TABLE IF NOT EXISTS channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Step 9: Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_game ON posts(game_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id);

-- Step 10: Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;

-- Step 11: Create RLS policies
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (status = 'approved' OR author_id = auth.uid());
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can vote" ON post_votes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Comments are viewable" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Channels are viewable" ON channels FOR SELECT USING (true);
CREATE POLICY "Messages viewable by members" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = messages.channel_id AND user_id = auth.uid())
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (
  auth.uid() = author_id AND
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = messages.channel_id AND user_id = auth.uid())
);

-- Step 12: Seed default channels
INSERT INTO channels (name, slug, description, game_id, type)
SELECT 
  name || ' Chat',
  'chat-' || LOWER(REPLACE(REPLACE(name, ' ', '-'), ':', '')),
  'Discuss ' || name,
  id,
  'text'
FROM "Game"
LIMIT 10
ON CONFLICT (slug) DO NOTHING;

INSERT INTO channels (name, slug, description, type)
VALUES 
  ('Global Chat', 'global-chat', 'General gaming discussion', 'text'),
  ('Announcements', 'announcements', 'Official news', 'announcement')
ON CONFLICT (slug) DO NOTHING;

-- DONE! Now you can use the app with blog and chat features.

