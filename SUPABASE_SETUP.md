# Supabase Setup Guide

## 🚀 Quick Setup (10 minutes)

### Step 1: Create Supabase Project (3 min)

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Click "New Project"
4. Fill in details:
   - **Name**: WikiGames Analytics
   - **Database Password**: (create strong password - SAVE IT!)
   - **Region**: Choose closest to you
5. Wait for project to initialize (~2 minutes)

### Step 2: Get API Credentials (1 min)

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Create .env.local File (1 min)

In project root, create `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 2.

### Step 4: Apply Database Migrations (5 min)

#### Option A: Using Supabase Dashboard (Recommended for first time)

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New query"
3. Copy content from `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"
5. Repeat for `002_seed_data.sql`

#### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Step 5: Verify Setup (1 min)

1. In Supabase dashboard, go to **Table Editor**
2. You should see 3 tables:
   - `games` (11 rows)
   - `player_history` (~1,400 rows)
   - `regional_stats` (~220 rows)

### Step 6: Test Connection (1 min)

```bash
# Restart dev server to load new env variables
# Press Ctrl+C to stop current server, then:
npm run dev
```

Open http://localhost:5174 and check browser console for errors.

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] API credentials copied
- [ ] `.env.local` file created with credentials
- [ ] Database migrations applied
- [ ] Tables visible in Supabase dashboard
- [ ] Dev server restarted
- [ ] No console errors

---

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure `.env.local` file exists in project root
- Check variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after creating `.env.local`

### Error: "relation does not exist"
- Migrations not applied yet
- Go to Supabase SQL Editor and run migrations manually

### Can't see data in app
- Check browser console for errors
- Verify RLS policies are set (they should be from migration)
- Check Supabase logs in dashboard

---

## 📚 Next Steps

After setup complete:
- Data will be fetched from Supabase
- World map will show regional stats
- Analytics charts will display player history
- All data is mock/sample for now (will integrate real APIs later)

---

**Need help?** Check the main PROJECT_RESTART_PLAN.md or create an issue.
