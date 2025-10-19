-- ============================================
-- WikiGames Add Features Migration V2
-- Safe migration that ALTERs existing tables
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER RANKS ENUM
-- ============================================

DO $$ BEGIN
  CREATE TYPE user_rank AS ENUM (
    'newbie',      -- 0-100 points
    'member',      -- 101-500 points
    'contributor', -- 501-1000 points
    'veteran',     -- 1001-5000 points
    'moderator',   -- Can moderate posts
    'admin'        -- Full access
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- ALTER PROFILES TABLE
-- ============================================

-- Add new columns to profiles if they don't exist
DO $$ 
BEGIN
  -- Add display_name
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='display_name') THEN
    ALTER TABLE profiles ADD COLUMN display_name TEXT;
  END IF;
  
  -- Add rank
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='rank') THEN
    ALTER TABLE profiles ADD COLUMN rank user_rank DEFAULT 'newbie';
  END IF;
  
  -- Add points
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='points') THEN
    ALTER TABLE profiles ADD COLUMN points INTEGER DEFAULT 0;
  END IF;
  
  -- Add stats columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='posts_count') THEN
    ALTER TABLE profiles ADD COLUMN posts_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='comments_count') THEN
    ALTER TABLE profiles ADD COLUMN comments_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='upvotes_received') THEN
    ALTER TABLE profiles ADD COLUMN upvotes_received INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='downvotes_received') THEN
    ALTER TABLE profiles ADD COLUMN downvotes_received INTEGER DEFAULT 0;
  END IF;
  
  -- Add settings columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email_notifications') THEN
    ALTER TABLE profiles ADD COLUMN email_notifications BOOLEAN DEFAULT TRUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='show_online_status') THEN
    ALTER TABLE profiles ADD COLUMN show_online_status BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- ============================================
-- CREATE NEW TABLES
-- ============================================

-- Post status enum
DO $$ BEGIN
  CREATE TYPE post_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_id TEXT REFERENCES "Game"(id) ON DELETE SET NULL,
  status post_status DEFAULT 'pending',
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  views_count INTEGER DEFAULT 0,
  upvotes_count INTEGER DEFAULT 0,
  downvotes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  meta_description TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  CONSTRAINT title_length CHECK (char_length(title) >= 10 AND char_length(title) <= 200),
  CONSTRAINT content_length CHECK (char_length(content) >= 100)
);

-- Post votes
CREATE TABLE IF NOT EXISTS post_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_upvote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes_count INTEGER DEFAULT 0,
  downvotes_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT comment_length CHECK (char_length(content) >= 1 AND char_length(content) <= 10000)
);

-- Comment votes
CREATE TABLE IF NOT EXISTS comment_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_upvote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Channel type enum
DO $$ BEGIN
  CREATE TYPE channel_type AS ENUM ('text', 'voice', 'announcement');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Channels
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type channel_type DEFAULT 'text',
  game_id TEXT REFERENCES "Game"(id) ON DELETE CASCADE,
  is_private BOOLEAN DEFAULT FALSE,
  required_rank user_rank DEFAULT 'newbie',
  messages_count INTEGER DEFAULT 0,
  members_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT channel_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 50)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  file_url TEXT,
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT message_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
);

-- Channel members
CREATE TABLE IF NOT EXISTS channel_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_muted BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Direct messages
CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  file_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT dm_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  CONSTRAINT different_users CHECK (sender_id != receiver_id)
);

-- Moderation logs
CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  moderator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_rank ON profiles(rank);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON profiles(points DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_game ON posts(game_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_post_votes_post ON post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_user ON post_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comment_votes_comment ON comment_votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_user ON comment_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_channels_game ON channels(game_id);
CREATE INDEX IF NOT EXISTS idx_channels_type ON channels(type);
CREATE INDEX IF NOT EXISTS idx_channels_slug ON channels(slug);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_author ON messages(author_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_channel_members_channel ON channel_members(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_members_user ON channel_members(user_id);
CREATE INDEX IF NOT EXISTS idx_dm_sender ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_dm_receiver ON direct_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_dm_created ON direct_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Approved posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Moderators can update any post" ON posts;

-- Posts policies
CREATE POLICY "Approved posts are viewable by everyone" ON posts FOR SELECT USING (
  status = 'approved' OR 
  author_id = auth.uid() OR 
  (SELECT rank FROM profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Moderators can update any post" ON posts FOR UPDATE USING (
  (SELECT rank FROM profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
);

-- Post votes policies
DROP POLICY IF EXISTS "Post votes are viewable by everyone" ON post_votes;
DROP POLICY IF EXISTS "Users can vote on posts" ON post_votes;
DROP POLICY IF EXISTS "Users can update own votes" ON post_votes;
DROP POLICY IF EXISTS "Users can delete own votes" ON post_votes;

CREATE POLICY "Post votes are viewable by everyone" ON post_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote on posts" ON post_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON post_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON post_votes FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = author_id);

-- Comment votes policies
DROP POLICY IF EXISTS "Comment votes are viewable by everyone" ON comment_votes;
DROP POLICY IF EXISTS "Users can vote on comments" ON comment_votes;
DROP POLICY IF EXISTS "Users can update own comment votes" ON comment_votes;
DROP POLICY IF EXISTS "Users can delete own comment votes" ON comment_votes;

CREATE POLICY "Comment votes are viewable by everyone" ON comment_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote on comments" ON comment_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comment votes" ON comment_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comment votes" ON comment_votes FOR DELETE USING (auth.uid() = user_id);

-- Channels policies
DROP POLICY IF EXISTS "Public channels are viewable by everyone" ON channels;
CREATE POLICY "Public channels are viewable by everyone" ON channels FOR SELECT USING (
  is_private = false OR 
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = channels.id AND user_id = auth.uid())
);

-- Messages policies
DROP POLICY IF EXISTS "Channel messages are viewable by members" ON messages;
DROP POLICY IF EXISTS "Users can send messages to joined channels" ON messages;

CREATE POLICY "Channel messages are viewable by members" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = messages.channel_id AND user_id = auth.uid())
);
CREATE POLICY "Users can send messages to joined channels" ON messages FOR INSERT WITH CHECK (
  auth.uid() = author_id AND
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = messages.channel_id AND user_id = auth.uid() AND is_muted = false)
);

-- Direct messages policies
DROP POLICY IF EXISTS "Users can view own DMs" ON direct_messages;
DROP POLICY IF EXISTS "Users can send DMs" ON direct_messages;

CREATE POLICY "Users can view own DMs" ON direct_messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can send DMs" ON direct_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- SEED DEFAULT CHANNELS
-- ============================================

INSERT INTO channels (name, slug, description, game_id, type)
SELECT 
  'General - ' || name,
  'general-' || LOWER(REPLACE(name, ' ', '-')),
  'General discussion about ' || name,
  id,
  'text'
FROM "Game"
WHERE id IS NOT NULL
ON CONFLICT (slug) DO NOTHING;

INSERT INTO channels (name, slug, description, type)
VALUES 
  ('Global Chat', 'global-chat', 'General gaming discussion', 'text'),
  ('Announcements', 'announcements', 'Official announcements', 'announcement')
ON CONFLICT (slug) DO NOTHING;

