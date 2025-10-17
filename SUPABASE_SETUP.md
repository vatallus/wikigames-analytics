# 🗄️ Supabase Database Setup Guide

## ✅ Environment Variables Configured

Your Supabase credentials have been securely stored in `.env` file (not committed to git).

---

## 📊 Database Schema Setup

### **Step 1: Create Tables in Supabase**

Go to your Supabase dashboard: https://mbqzwqdqiowtsnutbrgl.supabase.co

Navigate to **SQL Editor** and run these queries:

#### **1. Games Table**
```sql
CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  current_players INTEGER DEFAULT 0,
  peak_players INTEGER DEFAULT 0,
  all_time_peak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_games_current_players ON games(current_players DESC);
CREATE INDEX IF NOT EXISTS idx_games_type ON games(type);
CREATE INDEX IF NOT EXISTS idx_games_updated_at ON games(updated_at DESC);

-- Add trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### **2. Player History Table** (for charts)
```sql
CREATE TABLE IF NOT EXISTS player_history (
  id BIGSERIAL PRIMARY KEY,
  game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_count INTEGER NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_player_history_game_id ON player_history(game_id);
CREATE INDEX IF NOT EXISTS idx_player_history_recorded_at ON player_history(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_player_history_game_recorded ON player_history(game_id, recorded_at DESC);
```

#### **3. User Favorites Table**
```sql
CREATE TABLE IF NOT EXISTS user_favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_game_id ON user_favorites(game_id);
```

#### **4. Notifications Table**
```sql
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('spike', 'drop', 'milestone', 'new', 'info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_game_id ON notifications(game_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read, created_at DESC);
```

---

## 🔄 Integrating Supabase with Your App

### **Option 1: Replace Mock Data with Real Data**

Update `src/services/apiService.ts` to fetch from Supabase:

```typescript
import { supabase } from '@/lib/supabase'

export async function fetchGameData() {
  try {
    // Fetch games from Supabase
    const { data: games, error } = await supabase
      .from('games')
      .select('*')
      .order('current_players', { ascending: false })

    if (error) throw error

    return {
      games: games || [],
      globalStats: {
        totalPlayers: games?.reduce((sum, g) => sum + g.current_players, 0) || 0,
        activeGames: games?.length || 0,
      },
      countries: [], // Will populate from player_history or separate table
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching from Supabase:', error)
    throw error
  }
}

// Subscribe to real-time changes
export function subscribeToGameUpdates(callback: (data: any) => void) {
  const subscription = supabase
    .channel('games-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'games' },
      (payload) => {
        console.log('Game data changed:', payload)
        // Refetch all data
        fetchGameData().then(callback)
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}
```

### **Option 2: Hybrid Approach (Recommended)**

Keep using mock data for demo, but add option to switch to Supabase:

```typescript
// src/config.ts
export const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === 'true'

// In apiService.ts
export async function fetchGameData() {
  if (USE_SUPABASE) {
    return fetchFromSupabase()
  } else {
    return fetchMockData()
  }
}
```

---

## 🔐 Security Setup

### **1. Row Level Security (RLS)**

Enable RLS on all tables:

```sql
-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read access for games and player_history
CREATE POLICY "Public read access" ON games FOR SELECT USING (true);
CREATE POLICY "Public read access" ON player_history FOR SELECT USING (true);

-- Users can only see their own favorites
CREATE POLICY "Users can view own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
```

### **2. Add Vercel Environment Variables**

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these PUBLIC variables (safe to expose):
```
VITE_SUPABASE_URL=https://mbqzwqdqiowtsnutbrgl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Example Usage

### **Fetch Games**
```typescript
import { supabase } from '@/lib/supabase'

// Get all games
const { data: games } = await supabase
  .from('games')
  .select('*')
  .order('current_players', { ascending: false })

// Get specific game
const { data: game } = await supabase
  .from('games')
  .select('*')
  .eq('id', 'csgo')
  .single()
```

### **Real-time Subscription**
```typescript
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useRealtimeGames() {
  useEffect(() => {
    const subscription = supabase
      .channel('games')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'games' },
        (payload) => {
          console.log('Change received!', payload)
          // Update your state
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])
}
```

### **User Favorites**
```typescript
// Add favorite
async function addFavorite(gameId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('user_favorites')
    .insert({ user_id: user.id, game_id: gameId })
}

// Get user favorites
async function getUserFavorites() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('user_favorites')
    .select('game_id')
    .eq('user_id', user.id)

  return data?.map(f => f.game_id) || []
}
```

---

## 🚀 Deployment Checklist

### **Vercel:**
- [x] `.env` added to `.gitignore` ✅
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy with `vercel --prod`

### **Supabase:**
- [ ] Create tables (run SQL queries above)
- [ ] Enable Row Level Security
- [ ] Set up policies
- [ ] Test connections

---

## 🔄 Data Migration

### **Seed Initial Data**

```typescript
// scripts/seedSupabase.ts
import { supabase } from './src/lib/supabase'
import { GAMES } from './src/data/mockData'

async function seedGames() {
  for (const game of GAMES) {
    await supabase.from('games').upsert({
      id: game.id,
      name: game.name,
      type: game.type,
      current_players: Math.floor(Math.random() * 1000000),
      peak_players: Math.floor(Math.random() * 2000000),
    })
  }
  console.log('✅ Seeded games!')
}

seedGames()
```

Run with:
```bash
npx tsx scripts/seedSupabase.ts
```

---

## 📊 Monitoring

### **View Your Data:**
```
Supabase Dashboard: https://mbqzwqdqiowtsnutbrgl.supabase.co
→ Table Editor: View and edit data
→ SQL Editor: Run custom queries
→ Logs: Monitor real-time activity
```

---

## ⚠️ Security Notes

1. **NEVER commit `.env` file to git** ✅ (already in .gitignore)
2. **Only use ANON_KEY in frontend** (service role key is for backend only)
3. **Always use RLS** to protect user data
4. **Use parameterized queries** to prevent SQL injection

---

## 🎯 Next Steps

1. **Create tables** in Supabase (run SQL above)
2. **Test connection**:
   ```typescript
   import { supabase } from '@/lib/supabase'
   const { data, error } = await supabase.from('games').select('*')
   console.log(data, error)
   ```
3. **Integrate with app** (replace mock data or hybrid approach)
4. **Add authentication** (optional - for user favorites)
5. **Deploy to Vercel** with env variables

---

**Your Supabase is ready to use! 🎉**
