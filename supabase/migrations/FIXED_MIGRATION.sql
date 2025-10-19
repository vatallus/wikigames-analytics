-- ============================================
-- WikiGames Fixed Migration
-- Run this in Supabase SQL Editor
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

-- Step 2: Alter profiles table (add new columns)
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rank user_rank DEFAULT 'newbie';
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;
END $$;

-- Step 3: Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_id TEXT,
  status post_status DEFAULT 'pending',
  upvotes_count INTEGER DEFAULT 0,
  downvotes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  tags TEXT[],
  excerpt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 6: Create comment_votes table
CREATE TABLE IF NOT EXISTS comment_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_upvote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Step 7: Create channels table
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type channel_type DEFAULT 'text',
  game_id TEXT,
  members_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 8: Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 9: Create channel_members table
CREATE TABLE IF NOT EXISTS channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_muted BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Step 10: Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_game ON posts(game_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_votes_post ON post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_user ON post_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_author ON messages(author_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_channel_members_channel ON channel_members(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_members_user ON channel_members(user_id);

-- Step 11: Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;

-- Step 12: Drop existing policies if they exist
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can vote" ON post_votes;
DROP POLICY IF EXISTS "Post votes are viewable" ON post_votes;
DROP POLICY IF EXISTS "Comments are viewable" ON comments;
DROP POLICY IF EXISTS "Users can comment" ON comments;
DROP POLICY IF EXISTS "Comment votes are viewable" ON comment_votes;
DROP POLICY IF EXISTS "Users can vote on comments" ON comment_votes;
DROP POLICY IF EXISTS "Channels are viewable" ON channels;
DROP POLICY IF EXISTS "Messages viewable by members" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Channel members viewable" ON channel_members;

-- Step 13: Create RLS policies
-- Posts policies
CREATE POLICY "Posts are viewable by everyone" ON posts 
  FOR SELECT USING (status = 'approved' OR author_id = auth.uid());

CREATE POLICY "Users can create posts" ON posts 
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON posts 
  FOR UPDATE USING (auth.uid() = author_id);

-- Post votes policies
CREATE POLICY "Post votes are viewable" ON post_votes 
  FOR SELECT USING (true);

CREATE POLICY "Users can vote" ON post_votes 
  FOR ALL USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable" ON comments 
  FOR SELECT USING (true);

CREATE POLICY "Users can comment" ON comments 
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Comment votes policies
CREATE POLICY "Comment votes are viewable" ON comment_votes 
  FOR SELECT USING (true);

CREATE POLICY "Users can vote on comments" ON comment_votes 
  FOR ALL USING (auth.uid() = user_id);

-- Channels policies
CREATE POLICY "Channels are viewable" ON channels 
  FOR SELECT USING (true);

-- Messages policies
CREATE POLICY "Messages viewable by members" ON messages 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM channel_members 
      WHERE channel_id = messages.channel_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages" ON messages 
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM channel_members 
      WHERE channel_id = messages.channel_id 
      AND user_id = auth.uid() 
      AND is_muted = false
    )
  );

-- Channel members policies
CREATE POLICY "Channel members viewable" ON channel_members 
  FOR SELECT USING (true);

CREATE POLICY "Users can join channels" ON channel_members 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Step 14: Seed default channels
INSERT INTO channels (name, slug, description, type)
VALUES 
  ('Global Chat', 'global-chat', 'General gaming discussion', 'text'),
  ('Announcements', 'announcements', 'Official news and updates', 'announcement')
ON CONFLICT (slug) DO NOTHING;

-- Create channels for existing games
INSERT INTO channels (name, slug, description, game_id, type)
SELECT 
  name || ' Chat',
  'chat-' || LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9 ]', '', 'g'), ' ', '-', 'g')),
  'Discuss ' || name || ' with other players',
  id,
  'text'
FROM "Game"
WHERE id IS NOT NULL
ON CONFLICT (slug) DO NOTHING;

-- DONE! You can now use Blog and Chat features.

