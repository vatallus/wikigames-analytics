# WikiGames.org - Task Breakdown

## 📋 Current Sprint: Foundation Setup

### Week 1: Days 1-3 (Project Setup)

#### ✅ Day 1: Project Initialization
- [ ] Create Vite project with React + TypeScript
- [ ] Install all core dependencies
- [ ] Configure Tailwind CSS
- [ ] Setup project folder structure
- [ ] Configure environment variables
- [ ] Setup basic routing
- [ ] Test that project runs locally

**Time**: 4-6 hours  
**Deliverable**: Project runs on localhost:5173

---

#### ✅ Day 2: Supabase Setup
- [ ] Create new Supabase project
- [ ] Save project URL and API keys
- [ ] Create initial database schema (`001_initial_schema.sql`)
  - [ ] Games table
  - [ ] Player history table
  - [ ] Regional stats table
  - [ ] Indexes for performance
  - [ ] Row Level Security policies
- [ ] Create seed data script (`002_seed_data.sql`)
  - [ ] Insert 11 games
  - [ ] Generate mock player history
  - [ ] Generate mock regional data
- [ ] Apply migrations using Supabase CLI
- [ ] Test database connection from frontend
- [ ] Test query: Fetch all games

**Time**: 4-6 hours  
**Deliverable**: Database ready with sample data

---

#### ✅ Day 3: Core UI Components
- [ ] Install Shadcn/ui CLI
- [ ] Add core Shadcn components:
  - [ ] Button
  - [ ] Card
  - [ ] Input
  - [ ] Select
  - [ ] Badge
  - [ ] Dropdown Menu
  - [ ] Avatar
  - [ ] Tabs
- [ ] Create layout components:
  - [ ] Navigation (top nav bar)
  - [ ] Footer
  - [ ] Container (max-width wrapper)
  - [ ] LoadingSkeleton
- [ ] Create feature components:
  - [ ] GameCard (display game info)
  - [ ] StatsCard (key metrics)
  - [ ] ChartWrapper (for Recharts)
  - [ ] FilterPanel (sidebar filters)
- [ ] Setup dark mode theme
- [ ] Configure color variables
- [ ] Test all components render correctly

**Time**: 6-8 hours  
**Deliverable**: Reusable UI component library

---

### Week 1: Days 4-7 (Core Features)

#### 📊 Day 4: Home Page - World Map
- [ ] Install map dependencies (react-simple-maps, d3-scale)
- [ ] Create WorldMap component
  - [ ] Load world map SVG
  - [ ] Add country tooltips
  - [ ] Implement color scale by player count
  - [ ] Add click handlers for countries
- [ ] Create GlobalStats component
  - [ ] Total players display
  - [ ] Top region
  - [ ] Top game
  - [ ] Real-time update indicator
- [ ] Create GameFilter sidebar
  - [ ] List all games with icons
  - [ ] Checkbox filters
  - [ ] Apply filter logic
- [ ] Integrate with Supabase:
  - [ ] Query regional stats
  - [ ] Aggregate player counts
  - [ ] Cache with React Query (5 min stale time)
- [ ] Make responsive for mobile
- [ ] Test all interactions

**Time**: 6-8 hours  
**Deliverable**: Interactive home page with world map

---

#### 📈 Day 5: Analytics Page
- [ ] Create Analytics page layout
- [ ] Top Games Leaderboard:
  - [ ] Sortable table
  - [ ] Current player counts
  - [ ] Change indicators (+/- %)
  - [ ] Real-time updates
- [ ] Player Trend Charts:
  - [ ] Line chart component
  - [ ] 24h, 7d, 30d toggle
  - [ ] Multi-game overlay option
  - [ ] Interactive tooltips
  - [ ] Area chart variant
- [ ] Peak Hours Heatmap:
  - [ ] 24x7 grid layout
  - [ ] Color intensity scale
  - [ ] Tooltip on hover
  - [ ] Timezone support
- [ ] Game Comparison Tool:
  - [ ] Select 2-4 games
  - [ ] Side-by-side stats
  - [ ] Overlaid charts
  - [ ] Export/share functionality
- [ ] Integrate all with Supabase queries
- [ ] Optimize performance (lazy loading, pagination)
- [ ] Mobile responsive layout

**Time**: 6-8 hours  
**Deliverable**: Comprehensive analytics page

---

#### 🔍 Day 6: Discover Page
- [ ] Create Discover page layout
- [ ] Trending Games Section:
  - [ ] Calculate growth percentage
  - [ ] Display biggest movers
  - [ ] Badges for categories
- [ ] New Releases Section:
  - [ ] Filter by recent additions
  - [ ] Game cards with info
- [ ] Hidden Gems Section:
  - [ ] Algorithm for underrated games
  - [ ] Recommendation logic
- [ ] Game Search:
  - [ ] Search input with autocomplete
  - [ ] Full-text search via PostgreSQL
  - [ ] Instant results
- [ ] Filters & Sort:
  - [ ] Filter by type, players, etc.
  - [ ] Sort by popularity, name, players
  - [ ] Clear filters button
- [ ] Game Detail Modal:
  - [ ] Full game information
  - [ ] Stats overview
  - [ ] Link to analytics page
- [ ] Mobile responsive

**Time**: 4-6 hours  
**Deliverable**: Game discovery page

---

#### ✨ Day 7: Polish & Deploy
- [ ] Responsive Design:
  - [ ] Test on mobile devices
  - [ ] Fix layout issues
  - [ ] Mobile navigation menu
  - [ ] Touch-friendly interactions
- [ ] Performance Optimization:
  - [ ] Code splitting
  - [ ] Lazy load components
  - [ ] Optimize images
  - [ ] Reduce bundle size
- [ ] SEO Setup:
  - [ ] Meta tags (title, description)
  - [ ] Open Graph tags
  - [ ] Twitter Card tags
  - [ ] Create sitemap.xml
  - [ ] Create robots.txt
- [ ] Error Handling:
  - [ ] Error boundary component
  - [ ] Loading states
  - [ ] Empty states
  - [ ] User-friendly error messages
- [ ] Deploy to Vercel:
  - [ ] Connect GitHub repo to Vercel
  - [ ] Configure environment variables
  - [ ] Deploy to production
  - [ ] Test live site
- [ ] Setup Custom Domain:
  - [ ] Add wikigames.org to Vercel
  - [ ] Configure DNS records
  - [ ] Enable SSL
  - [ ] Verify domain works

**Time**: 6-8 hours  
**Deliverable**: MVP live at wikigames.org ✅

---

### Week 2: Days 8-10 (Authentication & Users)

#### 🔐 Day 8: Supabase Auth
- [ ] Create database migration for profiles table
- [ ] Setup auto-profile creation trigger
- [ ] Configure RLS policies for profiles
- [ ] Apply migration to Supabase
- [ ] Create AuthContext in React
- [ ] Create useAuth() custom hook
- [ ] Implement login modal:
  - [ ] Email/password form
  - [ ] OAuth buttons (Google, Discord)
  - [ ] Error handling
- [ ] Implement signup modal:
  - [ ] Registration form
  - [ ] Validation
  - [ ] Email confirmation
- [ ] Create UserMenu component:
  - [ ] Avatar dropdown
  - [ ] Profile link
  - [ ] Logout button
- [ ] Add auth state persistence
- [ ] Test login/logout flow

**Time**: 4-6 hours  
**Deliverable**: User authentication working

---

#### 👤 Day 9: User Profiles
- [ ] Create Profile page:
  - [ ] Display user info
  - [ ] Show activity stats
  - [ ] List posts/comments
  - [ ] Badges/achievements
- [ ] Create Edit Profile form:
  - [ ] Update username
  - [ ] Update display name
  - [ ] Update bio
  - [ ] Update social links
- [ ] Setup Supabase Storage for avatars
- [ ] Create avatar upload component:
  - [ ] File picker
  - [ ] Image preview
  - [ ] Upload to Storage
  - [ ] Update profile
- [ ] Create Settings page:
  - [ ] Change password
  - [ ] Email preferences
  - [ ] Privacy settings
  - [ ] Delete account
- [ ] Test all profile features

**Time**: 4-6 hours  
**Deliverable**: User profiles functional

---

#### 🧪 Day 10: Testing & Bug Fixes
- [ ] Manual testing checklist:
  - [ ] Test all pages load correctly
  - [ ] Test navigation works
  - [ ] Test filters and search
  - [ ] Test auth flow
  - [ ] Test profile updates
  - [ ] Test on Chrome, Firefox, Safari
  - [ ] Test on mobile (iOS, Android)
- [ ] Bug fixes:
  - [ ] Fix any critical bugs found
  - [ ] Improve loading states
  - [ ] Fix responsive issues
  - [ ] Improve error messages
- [ ] Performance improvements:
  - [ ] Analyze bundle size
  - [ ] Optimize queries
  - [ ] Add more caching
- [ ] Documentation:
  - [ ] Update README
  - [ ] Document API endpoints
  - [ ] Add code comments
  - [ ] Create deployment guide
- [ ] Prepare for Phase 2

**Time**: 6-8 hours  
**Deliverable**: Stable foundation ✅

---

## 🔄 Phase 2: Community Features (Days 11-24)

### Week 3: Blog/Forum System

#### 📝 Day 11: Database Schema
- [ ] Create posts table migration
- [ ] Create post_votes table
- [ ] Create comments table
- [ ] Create comment_votes table
- [ ] Add indexes for performance
- [ ] Setup RLS policies
- [ ] Test policies with different user roles
- [ ] Apply migration

**Time**: 4-6 hours

---

#### 📰 Day 12-13: Blog UI
- [ ] Post List Page:
  - [ ] Card grid layout
  - [ ] Pagination
  - [ ] Filters (game, tag, sort)
  - [ ] Search bar
- [ ] Post Detail Page:
  - [ ] Full post display
  - [ ] Author info
  - [ ] Voting buttons
  - [ ] Share buttons
  - [ ] Related posts
- [ ] Create Post Page:
  - [ ] Rich text editor (TipTap)
  - [ ] Title input
  - [ ] Tag selector
  - [ ] Game selector
  - [ ] Image upload
  - [ ] Preview mode
  - [ ] Draft saving

**Time**: 12-16 hours

---

#### 💬 Day 14-15: Voting & Comments
- [ ] Implement voting system:
  - [ ] Upvote/downvote buttons
  - [ ] Vote count display
  - [ ] Optimistic updates
  - [ ] Database integration
- [ ] Create comment system:
  - [ ] Comment list
  - [ ] Nested comments (max 3 levels)
  - [ ] Reply functionality
  - [ ] Edit/delete comments
  - [ ] Comment voting
  - [ ] Sort options (best, new, old)

**Time**: 12-16 hours

---

#### 🛡️ Day 16-17: Moderation
- [ ] Create moderation queue:
  - [ ] Pending posts list
  - [ ] Approve/reject actions
  - [ ] Moderator dashboard
- [ ] Implement user ranks:
  - [ ] Points calculation
  - [ ] Rank badges
  - [ ] Permissions per rank
- [ ] Create report system:
  - [ ] Report button
  - [ ] Report queue
  - [ ] Moderation actions
- [ ] Admin tools:
  - [ ] Ban/mute users
  - [ ] Delete content
  - [ ] Moderation logs

**Time**: 12-16 hours

---

### Week 4: Chat System

#### 💬 Day 18-19: Chat Database
- [ ] Create channels table
- [ ] Create messages table
- [ ] Create channel_members table
- [ ] Setup RLS policies
- [ ] Create default channels
- [ ] Apply migration
- [ ] Test real-time subscriptions

**Time**: 8-12 hours

---

#### 💬 Day 20-22: Chat UI
- [ ] Chat Layout:
  - [ ] Discord-style layout
  - [ ] Channel sidebar
  - [ ] Message area
  - [ ] User list
- [ ] Setup Supabase Realtime:
  - [ ] Subscribe to channels
  - [ ] Broadcast messages
  - [ ] Handle events
- [ ] Message sending:
  - [ ] Input box
  - [ ] Send on Enter
  - [ ] Character limit
- [ ] Message display:
  - [ ] Message list
  - [ ] User avatars
  - [ ] Timestamps
  - [ ] Scroll to bottom
- [ ] Typing indicators
- [ ] Channel management:
  - [ ] Create channel
  - [ ] Join/leave
  - [ ] Channel settings

**Time**: 18-24 hours

---

#### 💬 Day 23-24: Chat Features
- [ ] Direct Messages:
  - [ ] DM list
  - [ ] Start DM
  - [ ] Private conversations
- [ ] User Presence:
  - [ ] Online/offline status
  - [ ] Last seen
  - [ ] Active indicator
- [ ] Message Features:
  - [ ] Edit messages
  - [ ] Delete messages
  - [ ] @mentions
  - [ ] Emoji reactions
  - [ ] Link previews
- [ ] Chat moderation:
  - [ ] Delete messages
  - [ ] Mute users
  - [ ] Ban from channel

**Time**: 12-16 hours

---

## ✅ Definition of Done

Each task is considered "done" when:

- [ ] Code is written and tested locally
- [ ] No console errors
- [ ] Works on desktop and mobile
- [ ] TypeScript types are correct
- [ ] Code is committed with meaningful message
- [ ] Documentation is updated (if needed)
- [ ] Deployed to staging (if applicable)

---

## 📊 Progress Tracking

**Phase 1 Progress**: 0/10 days  
**Phase 2 Progress**: 0/14 days  
**Total Progress**: 0/24 days

**Estimated Completion**: 4-6 weeks

---

## 🚨 Blockers & Notes

**Current Blockers**: None

**Notes**:
- Remember to test each feature thoroughly before moving on
- Keep commits atomic and descriptive
- Update this file as you complete tasks
- Take breaks every 2-3 hours to avoid burnout

---

**Last Updated**: Oct 19, 2025
