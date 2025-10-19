-- ============================================
-- WikiGames Complete Features Migration
-- Blog/Forum + Chat + Authentication + Ranks
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER PROFILES & RANKS
-- ============================================

-- User ranks enum
CREATE TYPE user_rank AS ENUM (
  'newbie',      -- 0-100 points
  'member',      -- 101-500 points
  'contributor', -- 501-1000 points
  'veteran',     -- 1001-5000 points
  'moderator',   -- Can moderate posts
  'admin'        -- Full access
);

-- Extended profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  rank user_rank DEFAULT 'newbie',
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Stats
  posts_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  upvotes_received INTEGER DEFAULT 0,
  downvotes_received INTEGER DEFAULT 0,
  
  -- Settings
  email_notifications BOOLEAN DEFAULT TRUE,
  show_online_status BOOLEAN DEFAULT TRUE,
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20)
);

-- ============================================
-- BLOG/FORUM SYSTEM
-- ============================================

-- Post status enum
CREATE TYPE post_status AS ENUM (
  'pending',   -- Waiting for approval
  'approved',  -- Published
  'rejected',  -- Rejected by moderator
  'flagged'    -- Flagged for review
);

-- Posts table (blog articles)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  
  -- Author
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Game association (optional - can be about any game)
  game_id TEXT REFERENCES "Game"(id) ON DELETE SET NULL,
  
  -- Status & moderation
  status post_status DEFAULT 'pending',
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Stats
  views_count INTEGER DEFAULT 0,
  upvotes_count INTEGER DEFAULT 0,
  downvotes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  
  -- SEO
  meta_description TEXT,
  tags TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  CONSTRAINT title_length CHECK (char_length(title) >= 10 AND char_length(title) <= 200),
  CONSTRAINT content_length CHECK (char_length(content) >= 100)
);

-- Post votes table
CREATE TABLE IF NOT EXISTS post_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_upvote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(post_id, user_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For threading
  
  content TEXT NOT NULL,
  
  -- Stats
  upvotes_count INTEGER DEFAULT 0,
  downvotes_count INTEGER DEFAULT 0,
  
  -- Moderation
  is_deleted BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT comment_length CHECK (char_length(content) >= 1 AND char_length(content) <= 10000)
);

-- Comment votes table
CREATE TABLE IF NOT EXISTS comment_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_upvote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(comment_id, user_id)
);

-- ============================================
-- CHAT SYSTEM (Discord-style)
-- ============================================

-- Channel type enum
CREATE TYPE channel_type AS ENUM (
  'text',
  'voice',
  'announcement'
);

-- Channels table (game-specific channels)
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type channel_type DEFAULT 'text',
  
  -- Game association (each game has channels)
  game_id TEXT REFERENCES "Game"(id) ON DELETE CASCADE,
  
  -- Settings
  is_private BOOLEAN DEFAULT FALSE,
  required_rank user_rank DEFAULT 'newbie',
  
  -- Stats
  messages_count INTEGER DEFAULT 0,
  members_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT channel_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 50)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  file_url TEXT,
  
  -- Reply/Thread
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  
  -- Moderation
  is_deleted BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT message_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
);

-- Channel members (who joined which channel)
CREATE TABLE IF NOT EXISTS channel_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Permissions
  is_muted BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(channel_id, user_id)
);

-- Direct messages (1-on-1 chat)
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

-- ============================================
-- MODERATION SYSTEM
-- ============================================

-- Moderation actions log
CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  moderator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- What was moderated
  action_type TEXT NOT NULL, -- 'approve_post', 'reject_post', 'delete_comment', 'ban_user', etc.
  target_type TEXT NOT NULL, -- 'post', 'comment', 'user', 'message'
  target_id UUID NOT NULL,
  
  reason TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- What is being reported
  target_type TEXT NOT NULL, -- 'post', 'comment', 'user', 'message'
  target_id UUID NOT NULL,
  
  reason TEXT NOT NULL,
  description TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
  resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL, -- 'post_approved', 'comment_reply', 'upvote', 'mention', 'dm', etc.
  title TEXT NOT NULL,
  message TEXT,
  
  -- Link to related content
  link_url TEXT,
  
  is_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Profiles
CREATE INDEX idx_profiles_rank ON profiles(rank);
CREATE INDEX idx_profiles_points ON profiles(points DESC);
CREATE INDEX idx_profiles_username ON profiles(username);

-- Posts
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_game ON posts(game_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- Post votes
CREATE INDEX idx_post_votes_post ON post_votes(post_id);
CREATE INDEX idx_post_votes_user ON post_votes(user_id);

-- Comments
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_created ON comments(created_at DESC);

-- Comment votes
CREATE INDEX idx_comment_votes_comment ON comment_votes(comment_id);
CREATE INDEX idx_comment_votes_user ON comment_votes(user_id);

-- Channels
CREATE INDEX idx_channels_game ON channels(game_id);
CREATE INDEX idx_channels_type ON channels(type);
CREATE INDEX idx_channels_slug ON channels(slug);

-- Messages
CREATE INDEX idx_messages_channel ON messages(channel_id);
CREATE INDEX idx_messages_author ON messages(author_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Channel members
CREATE INDEX idx_channel_members_channel ON channel_members(channel_id);
CREATE INDEX idx_channel_members_user ON channel_members(user_id);

-- Direct messages
CREATE INDEX idx_dm_sender ON direct_messages(sender_id);
CREATE INDEX idx_dm_receiver ON direct_messages(receiver_id);
CREATE INDEX idx_dm_created ON direct_messages(created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
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

-- Profiles: Everyone can read, users can update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Posts: Approved posts are public, pending posts only visible to author and moderators
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

-- Post votes: Users can vote
CREATE POLICY "Post votes are viewable by everyone" ON post_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote on posts" ON post_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON post_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON post_votes FOR DELETE USING (auth.uid() = user_id);

-- Comments: Public for approved posts
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = author_id);

-- Comment votes: Users can vote
CREATE POLICY "Comment votes are viewable by everyone" ON comment_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote on comments" ON comment_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON comment_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON comment_votes FOR DELETE USING (auth.uid() = user_id);

-- Channels: Public channels are viewable by everyone
CREATE POLICY "Public channels are viewable by everyone" ON channels FOR SELECT USING (
  is_private = false OR 
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = channels.id AND user_id = auth.uid())
);

-- Messages: Only channel members can see messages
CREATE POLICY "Channel messages are viewable by members" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = messages.channel_id AND user_id = auth.uid())
);
CREATE POLICY "Users can send messages to joined channels" ON messages FOR INSERT WITH CHECK (
  auth.uid() = author_id AND
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = messages.channel_id AND user_id = auth.uid() AND is_muted = false)
);

-- Direct messages: Only sender and receiver can see
CREATE POLICY "Users can view own DMs" ON direct_messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can send DMs" ON direct_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications: Users can only see their own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

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
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update post vote counts
CREATE OR REPLACE FUNCTION update_post_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_upvote THEN
      UPDATE posts SET upvotes_count = upvotes_count + 1 WHERE id = NEW.post_id;
    ELSE
      UPDATE posts SET downvotes_count = downvotes_count + 1 WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_upvote != NEW.is_upvote THEN
      IF NEW.is_upvote THEN
        UPDATE posts SET upvotes_count = upvotes_count + 1, downvotes_count = downvotes_count - 1 WHERE id = NEW.post_id;
      ELSE
        UPDATE posts SET upvotes_count = upvotes_count - 1, downvotes_count = downvotes_count + 1 WHERE id = NEW.post_id;
      END IF;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.is_upvote THEN
      UPDATE posts SET upvotes_count = upvotes_count - 1 WHERE id = OLD.post_id;
    ELSE
      UPDATE posts SET downvotes_count = downvotes_count - 1 WHERE id = OLD.post_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_vote_counts_trigger
AFTER INSERT OR UPDATE OR DELETE ON post_votes
FOR EACH ROW EXECUTE FUNCTION update_post_vote_counts();

-- Function to update comment counts
CREATE OR REPLACE FUNCTION update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    UPDATE profiles SET comments_count = comments_count + 1 WHERE id = NEW.author_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    UPDATE profiles SET comments_count = comments_count - 1 WHERE id = OLD.author_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_counts_trigger
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_comment_counts();

-- Function to update user points based on activity
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Award points for creating posts (+10)
  IF TG_TABLE_NAME = 'posts' AND TG_OP = 'INSERT' THEN
    UPDATE profiles SET points = points + 10, posts_count = posts_count + 1 WHERE id = NEW.author_id;
  END IF;
  
  -- Award points for receiving upvotes (+5)
  IF TG_TABLE_NAME = 'post_votes' AND TG_OP = 'INSERT' AND NEW.is_upvote THEN
    UPDATE profiles SET points = points + 5, upvotes_received = upvotes_received + 1 
    WHERE id = (SELECT author_id FROM posts WHERE id = NEW.post_id);
  END IF;
  
  -- Deduct points for receiving downvotes (-2)
  IF TG_TABLE_NAME = 'post_votes' AND TG_OP = 'INSERT' AND NOT NEW.is_upvote THEN
    UPDATE profiles SET points = points - 2, downvotes_received = downvotes_received + 1 
    WHERE id = (SELECT author_id FROM posts WHERE id = NEW.post_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_points_trigger
AFTER INSERT ON posts
FOR EACH ROW EXECUTE FUNCTION update_user_points();

CREATE TRIGGER user_points_votes_trigger
AFTER INSERT ON post_votes
FOR EACH ROW EXECUTE FUNCTION update_user_points();

-- Function to auto-update user rank based on points
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.points >= 5000 THEN
    NEW.rank = 'veteran';
  ELSIF NEW.points >= 1000 THEN
    NEW.rank = 'contributor';
  ELSIF NEW.points >= 500 THEN
    NEW.rank = 'member';
  ELSE
    NEW.rank = 'newbie';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_rank_trigger
BEFORE UPDATE OF points ON profiles
FOR EACH ROW EXECUTE FUNCTION update_user_rank();

-- ============================================
-- SEED DEFAULT CHANNELS
-- ============================================

-- Create general channels for each game
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

-- Create a global general channel
INSERT INTO channels (name, slug, description, type)
VALUES 
  ('Global Chat', 'global-chat', 'General gaming discussion', 'text'),
  ('Announcements', 'announcements', 'Official announcements', 'announcement')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- DONE
-- ============================================

