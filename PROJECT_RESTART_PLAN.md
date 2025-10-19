# WikiGames.org - Kế Hoạch Khởi Động Lại Dự Án

**Ngày**: 19 Tháng 10, 2025  
**Trạng thái**: 🚀 Starting Fresh  
**Phương pháp**: Incremental, Test-Driven, Stable-First

---

## 📌 Tổng Quan

Dự án được khởi động lại từ đầu với kinh nghiệm từ lần triển khai trước. Mục tiêu:
- ✅ Code sạch, có cấu trúc tốt
- ✅ Triển khai từng bước, test kỹ
- ✅ Database migrations được quản lý cẩn thận
- ✅ Deployment process ổn định

---

## 🎯 Mục Tiêu Ngắn Hạn (Week 1-2)

### MVP Features
1. **Home Page**: World map + global analytics
2. **Analytics Page**: Charts và leaderboards
3. **Discover Page**: Game discovery
4. **Basic Layout**: Navigation, responsive design

### Technical Foundation
- React 18 + TypeScript + Vite
- Tailwind CSS + Shadcn/ui
- Supabase (Database + Auth + Realtime)
- Vercel deployment

---

## 📋 Phase 1: Foundation Setup (Days 1-3)

### Day 1: Project Setup ⏱️ 4-6 hours

#### 1.1 Initialize Project
```bash
# Create Vite project with React + TypeScript
npm create vite@latest . -- --template react-ts

# Install core dependencies
npm install react-router-dom @tanstack/react-query zustand

# Install UI dependencies
npm install -D tailwindcss postcss autoprefixer
npm install @radix-ui/react-* lucide-react
npm install class-variance-authority clsx tailwind-merge

# Install data visualization
npm install recharts d3 react-simple-maps

# Install Supabase
npm install @supabase/supabase-js

# Install dev tools
npm install -D @types/node @types/react-router-dom
```

#### 1.2 Configure Tailwind CSS
- Setup `tailwind.config.js` với theme tùy chỉnh
- Configure `postcss.config.js`
- Create `src/index.css` với base styles

#### 1.3 Setup Project Structure
```
src/
├── components/        # Reusable components
│   ├── ui/           # Shadcn components
│   ├── layout/       # Layout components (Nav, Footer)
│   └── features/     # Feature-specific components
├── pages/            # Page components
├── lib/              # Utilities
│   ├── supabase.ts   # Supabase client
│   ├── utils.ts      # Helper functions
│   └── queryClient.ts # React Query config
├── hooks/            # Custom hooks
├── types/            # TypeScript types
├── services/         # API services
├── contexts/         # React contexts
└── App.tsx           # Main app component
```

#### 1.4 Setup Environment Variables
```env
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

#### 1.5 Basic Routing Setup
- Setup React Router with all routes
- Create placeholder pages
- Basic navigation component

**Checkpoint**: ✅ Project runs on localhost, navigation works

---

### Day 2: Supabase Setup ⏱️ 4-6 hours

#### 2.1 Create Supabase Project
- New project on supabase.com
- Note down: Project URL, API Keys
- Enable Row Level Security (RLS)

#### 2.2 Initial Database Schema
Create file: `supabase/migrations/001_initial_schema.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Games table (mock data for now)
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  icon_url TEXT,
  current_players INTEGER DEFAULT 0,
  peak_players_today INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player history (for analytics)
CREATE TABLE player_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id TEXT REFERENCES games(id) ON DELETE CASCADE,
  player_count INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regional data
CREATE TABLE regional_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id TEXT REFERENCES games(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  country_name TEXT,
  player_count INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_player_history_game ON player_history(game_id, recorded_at DESC);
CREATE INDEX idx_player_history_recorded ON player_history(recorded_at DESC);
CREATE INDEX idx_regional_stats_game ON regional_stats(game_id);
CREATE INDEX idx_regional_stats_country ON regional_stats(country_code);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_stats ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view analytics)
CREATE POLICY "Public read access games" ON games FOR SELECT USING (true);
CREATE POLICY "Public read access history" ON player_history FOR SELECT USING (true);
CREATE POLICY "Public read access regional" ON regional_stats FOR SELECT USING (true);
```

#### 2.3 Seed Data
Create file: `supabase/migrations/002_seed_data.sql`

```sql
-- Insert sample games
INSERT INTO games (id, name, type) VALUES
('dota2', 'Dota 2', 'MOBA'),
('csgo', 'CS:GO', 'FPS'),
('pubg', 'PUBG', 'Battle Royale'),
('apex', 'Apex Legends', 'Battle Royale'),
('valorant', 'Valorant', 'FPS'),
('lol', 'League of Legends', 'MOBA'),
('fortnite', 'Fortnite', 'Battle Royale'),
('minecraft', 'Minecraft', 'Sandbox'),
('gta5', 'GTA V', 'Action'),
('rust', 'Rust', 'Survival'),
('overwatch2', 'Overwatch 2', 'FPS');

-- Generate mock player history (last 30 days)
INSERT INTO player_history (game_id, player_count, recorded_at)
SELECT 
  g.id,
  (RANDOM() * 1000000)::INTEGER,
  NOW() - (i || ' hours')::INTERVAL
FROM games g
CROSS JOIN generate_series(0, 720, 6) AS i; -- Every 6 hours for 30 days

-- Generate mock regional data
INSERT INTO regional_stats (game_id, country_code, country_name, player_count)
SELECT 
  g.id,
  c.code,
  c.name,
  (RANDOM() * 100000)::INTEGER
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
  ('VN', 'Vietnam')
) AS c(code, name);
```

#### 2.4 Apply Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

#### 2.5 Test Supabase Connection
Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Checkpoint**: ✅ Database ready, can query data from frontend

---

### Day 3: Core UI Components ⏱️ 6-8 hours

#### 3.1 Install Shadcn/ui Components
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select badge
npx shadcn-ui@latest add dropdown-menu avatar tabs
```

#### 3.2 Build Layout Components
- **Navigation**: Top nav với logo, links, search
- **Footer**: Links, social, credits
- **Container**: Max-width wrapper
- **LoadingSkeleton**: Loading states

#### 3.3 Build Feature Components
- **GameCard**: Display game info
- **StatsCard**: Show key metrics
- **ChartWrapper**: Wrapper for Recharts
- **FilterPanel**: Sidebar filters

#### 3.4 Setup Theme & Styling
- Dark mode support
- Color variables
- Typography system
- Spacing utilities

**Checkpoint**: ✅ UI components ready, looks professional

---

## 📋 Phase 2: Core Features (Days 4-7)

### Day 4: Home Page (World Map) ⏱️ 6-8 hours

#### 4.1 Install Map Dependencies
```bash
npm install react-simple-maps d3-scale
```

#### 4.2 Implement World Map
- Interactive SVG map
- Country tooltips
- Color scale by player count
- Click handlers

#### 4.3 Global Stats Panel
- Total players
- Top region
- Top game
- Live updates

#### 4.4 Game Filter Sidebar
- List of games với icons
- Checkboxes
- Filter logic

**Deliverable**: Home page với interactive world map ✅

---

### Day 5: Analytics Page ⏱️ 6-8 hours

#### 5.1 Top Games Leaderboard
- Real-time player counts
- Sortable table
- Change indicators (+/- from yesterday)

#### 5.2 Player Trend Charts
- Line chart: 24h, 7d, 30d trends
- Area chart for multiple games
- Interactive tooltips

#### 5.3 Peak Hours Heatmap
- 24x7 grid
- Color intensity
- Timezone support

#### 5.4 Game Comparison Tool
- Select 2-4 games
- Side-by-side comparison
- Overlaid charts

**Deliverable**: Analytics page với comprehensive charts ✅

---

### Day 6: Discover Page ⏱️ 4-6 hours

#### 6.1 Trending Games Section
- Biggest growth %
- New releases
- Hidden gems

#### 6.2 Game Search
- Full-text search
- Filters (type, players, etc.)
- Sort options

#### 6.3 Game Detail Modal
- Full game info
- Stats overview
- Link to analytics

**Deliverable**: Discover page functional ✅

---

### Day 7: Polish & Deploy ⏱️ 6-8 hours

#### 7.1 Responsive Design
- Mobile menu
- Touch-friendly
- Adaptive layouts

#### 7.2 Performance Optimization
- Code splitting
- Lazy loading
- Image optimization

#### 7.3 SEO Setup
- Meta tags
- Open Graph
- Sitemap

#### 7.4 Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### 7.5 Setup Custom Domain
- Add domain to Vercel
- Configure DNS
- Enable SSL

**Checkpoint**: ✅ Phase 1 MVP live at wikigames.org

---

## 📋 Phase 3: Authentication & User System (Days 8-10)

### Day 8: Supabase Auth Setup ⏱️ 4-6 hours

#### 8.1 Database Schema for Users
```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

#### 8.2 Auth Context & Hooks
- Create `AuthContext` with login/logout
- Custom hook: `useAuth()`
- Persistent session

#### 8.3 UI Components
- Login/Signup modal
- User menu dropdown
- Profile avatar

**Checkpoint**: ✅ Users can sign up/login

---

### Day 9: User Profiles ⏱️ 4-6 hours

#### 9.1 Profile Page
- Display user info
- Show activity (posts, comments)
- Edit profile form

#### 9.2 Avatar Upload
- Supabase Storage setup
- File upload component
- Image cropping

#### 9.3 User Settings
- Change password
- Email preferences
- Privacy settings

**Checkpoint**: ✅ User system functional

---

### Day 10: Testing & Bug Fixes ⏱️ 6-8 hours

#### 10.1 Manual Testing
- Test all pages
- Test auth flow
- Test on mobile

#### 10.2 Bug Fixes
- Fix critical bugs
- Improve UX
- Performance tweaks

#### 10.3 Documentation
- Update README
- API documentation
- Deployment guide

**Checkpoint**: ✅ Stable foundation ready for Phase 4

---

## 📋 Phase 4: Blog/Forum System (Days 11-17)

### Day 11: Database Schema ⏱️ 4-6 hours

```sql
-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_id TEXT REFERENCES games(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  upvotes_count INTEGER DEFAULT 0,
  downvotes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post votes
CREATE TABLE post_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_upvote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_game ON posts(game_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);

-- RLS Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved posts viewable" ON posts
  FOR SELECT USING (status = 'approved' OR author_id = auth.uid());

CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);
```

### Day 12-13: Blog UI ⏱️ 12-16 hours

#### 12.1 Post List Page
- Card grid layout
- Filters (game, tag, sort)
- Pagination
- Search

#### 12.2 Post Detail Page
- Full post display
- Comments section
- Voting buttons
- Share buttons

#### 12.3 Create Post Page
- Rich text editor (TipTap or similar)
- Image upload
- Tag selector
- Preview mode

### Day 14-15: Voting & Comments ⏱️ 12-16 hours

#### 14.1 Voting System
- Upvote/downvote logic
- Optimistic updates
- Vote count display

#### 14.2 Comment System
- Nested comments (max 3 levels)
- Reply functionality
- Comment voting
- Delete/edit

### Day 16-17: Moderation ⏱️ 12-16 hours

#### 16.1 Moderation Queue
- Pending posts list
- Approve/reject actions
- Moderator permissions

#### 16.2 User Points System
- Points for activities
- Rank calculation
- Badges/achievements

**Checkpoint**: ✅ Blog/Forum fully functional

---

## 📋 Phase 5: Chat System (Days 18-24)

### Day 18-19: Chat Database ⏱️ 8-12 hours

```sql
-- Channels
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'announcement')),
  game_id TEXT REFERENCES games(id),
  members_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (LENGTH(content) <= 2000),
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Channel members
CREATE TABLE channel_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_muted BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Indexes
CREATE INDEX idx_messages_channel ON messages(channel_id, created_at DESC);
CREATE INDEX idx_channel_members ON channel_members(channel_id, user_id);
```

### Day 20-22: Chat UI ⏱️ 18-24 hours

#### 20.1 Chat Layout
- Discord-style layout
- Channel sidebar
- Message area
- User list

#### 20.2 Real-time Messaging
- Supabase Realtime setup
- Message sending
- Message receiving
- Typing indicators

#### 20.3 Channel Management
- Create channel
- Join/leave channel
- Channel settings

### Day 23-24: Chat Features ⏱️ 12-16 hours

#### 23.1 Direct Messages
- DM UI
- DM list
- Private conversations

#### 23.2 User Presence
- Online/offline status
- Last seen
- Active indicator

#### 23.3 Message Features
- Edit/delete messages
- @mentions
- Emoji reactions
- Link previews

**Checkpoint**: ✅ Chat system fully functional

---

## 🎯 Success Criteria

### Technical Metrics
- ✅ Page load < 2s
- ✅ No critical bugs
- ✅ 99%+ uptime
- ✅ Mobile responsive
- ✅ Accessible (WCAG AA)

### Feature Completion
- ✅ All MVP features working
- ✅ User authentication
- ✅ Blog/Forum functional
- ✅ Chat system working
- ✅ Admin moderation tools

### Quality Standards
- ✅ Clean, maintainable code
- ✅ TypeScript coverage
- ✅ Error handling
- ✅ Loading states
- ✅ User feedback

---

## 🚀 Deployment Strategy

### Environment Setup
- **Development**: localhost:5173
- **Staging**: staging-wikigames.vercel.app
- **Production**: wikigames.org

### CI/CD Pipeline
1. Push to `dev` branch → Deploy to staging
2. Test on staging
3. Merge to `main` → Deploy to production
4. Monitor errors via Sentry

### Rollback Plan
- Keep previous deployment active
- Vercel instant rollback
- Database migration rollback scripts

---

## 📊 Risk Management

### High Priority Risks
1. **Database migration failures**
   - Solution: Test locally first, backup before migration
   
2. **Supabase RLS complexity**
   - Solution: Start simple, add complexity gradually

3. **Performance issues**
   - Solution: Implement caching, pagination, indexes early

### Medium Priority Risks
1. **Spam/abuse**
   - Solution: Rate limiting, moderation tools, captcha

2. **Content moderation overhead**
   - Solution: Auto-moderation, community moderators

3. **User adoption**
   - Solution: SEO, marketing, community building

---

## 📝 Daily Checklist Template

### Start of Day
- [ ] Review previous day's work
- [ ] Check for any production issues
- [ ] Review task list for today
- [ ] Pull latest changes

### During Development
- [ ] Write clean, documented code
- [ ] Test locally before committing
- [ ] Create meaningful commit messages
- [ ] Review code before pushing

### End of Day
- [ ] Test all changes thoroughly
- [ ] Commit and push code
- [ ] Update task progress
- [ ] Document any issues/blockers
- [ ] Plan tomorrow's tasks

---

## 📞 Support & Resources

### Documentation
- **React**: https://react.dev
- **Supabase**: https://supabase.com/docs
- **Tailwind**: https://tailwindcss.com/docs
- **Shadcn/ui**: https://ui.shadcn.com

### Community
- **GitHub Issues**: For bug reports
- **Discord**: For discussions
- **Email**: For direct support

---

## ✅ Next Immediate Actions

1. **Read and approve this plan**
2. **Setup development environment**
3. **Create Supabase project**
4. **Start Day 1 tasks**

**Estimated Timeline**: 4-6 weeks for complete implementation  
**Effort**: ~8 hours/day × 24 days = ~192 hours total

---

**Let's build this right! 🚀**
