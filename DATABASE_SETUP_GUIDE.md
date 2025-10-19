# WikiGames Database Setup Guide

Vì Supabase SQL Editor chạy từng statement riêng lẻ, bạn cần chạy từng bước theo thứ tự.

## Cách Nhanh Nhất: Tắt RLS Tạm Thời

Chạy toàn bộ script này một lần:

```sql
-- Create all tables WITHOUT RLS first
CREATE TYPE user_rank AS ENUM ('newbie', 'member', 'contributor', 'veteran', 'moderator', 'admin');
CREATE TYPE post_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
CREATE TYPE channel_type AS ENUM ('text', 'voice', 'announcement');

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rank user_rank DEFAULT 'newbie';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

CREATE TABLE posts (
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

CREATE TABLE post_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_upvote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE comments (
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

CREATE TABLE comment_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_upvote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type channel_type DEFAULT 'text',
  game_id TEXT,
  members_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_muted BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_game ON posts(game_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_post_votes_post ON post_votes(post_id);
CREATE INDEX idx_post_votes_user ON post_votes(user_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_messages_channel ON messages(channel_id);
CREATE INDEX idx_messages_author ON messages(author_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_channel_members_channel ON channel_members(channel_id);
CREATE INDEX idx_channel_members_user ON channel_members(user_id);

INSERT INTO channels (name, slug, description, type)
VALUES 
  ('Global Chat', 'global-chat', 'General gaming discussion', 'text'),
  ('Announcements', 'announcements', 'Official news and updates', 'announcement');
```

## Sau đó Enable RLS (chạy riêng):

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone" ON posts 
  FOR SELECT USING (status = 'approved' OR author_id = auth.uid());

CREATE POLICY "Users can create posts" ON posts 
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON posts 
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Post votes are viewable" ON post_votes 
  FOR SELECT USING (true);

CREATE POLICY "Users can vote" ON post_votes 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Comments are viewable" ON comments 
  FOR SELECT USING (true);

CREATE POLICY "Users can comment" ON comments 
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Comment votes are viewable" ON comment_votes 
  FOR SELECT USING (true);

CREATE POLICY "Users can vote on comments" ON comment_votes 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Channels are viewable" ON channels 
  FOR SELECT USING (true);

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

CREATE POLICY "Channel members viewable" ON channel_members 
  FOR SELECT USING (true);

CREATE POLICY "Users can join channels" ON channel_members 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Verify

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('posts', 'post_votes', 'comments', 'channels', 'messages', 'channel_members')
ORDER BY table_name;

SELECT name, slug, type FROM channels;
```

Nếu thấy 6 tables và 2 channels → ✅ DONE!

