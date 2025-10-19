# 🚀 Quick Start Guide - WikiGames.org

## Bắt Đầu Ngay (15 phút)

### 1. Setup Project (5 phút)

```bash
# Khởi tạo Vite project
npm create vite@latest . -- --template react-ts

# Cài đặt dependencies
npm install

# Cài đặt routing và state management
npm install react-router-dom @tanstack/react-query zustand

# Cài đặt Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Cài đặt UI components
npm install lucide-react class-variance-authority clsx tailwind-merge

# Cài đặt Supabase
npm install @supabase/supabase-js

# Cài đặt charting libraries
npm install recharts d3 react-simple-maps
```

### 2. Configure Tailwind (2 phút)

Cập nhật `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Cập nhật `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Setup Supabase (5 phút)

Tạo `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Tạo `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 4. Test Run (3 phút)

```bash
# Start dev server
npm run dev

# Mở browser: http://localhost:5173
```

---

## Project Structure

```
wikigames-analytics/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Shadcn components
│   │   ├── layout/     # Layout (Nav, Footer)
│   │   └── features/   # Feature components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities
│   ├── hooks/          # Custom hooks
│   ├── types/          # TypeScript types
│   ├── services/       # API services
│   ├── App.tsx         # Main app
│   └── main.tsx        # Entry point
├── supabase/
│   └── migrations/     # Database migrations
├── .env.local          # Environment variables
└── package.json        # Dependencies
```

---

## Development Workflow

### Daily Workflow
1. Pull latest changes: `git pull`
2. Install deps if needed: `npm install`
3. Start dev server: `npm run dev`
4. Make changes, test locally
5. Commit: `git add . && git commit -m "feat: description"`
6. Push: `git push`

### Before Deploying
1. ✅ Test all features locally
2. ✅ Check console for errors
3. ✅ Test on mobile (responsive)
4. ✅ Build successful: `npm run build`
5. ✅ Preview build: `npm run preview`

### Deployment to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code

# Supabase
supabase login           # Login to Supabase
supabase link            # Link to project
supabase db push         # Apply migrations
supabase db reset        # Reset database (local)

# Git
git status               # Check status
git add .                # Stage all changes
git commit -m "message"  # Commit with message
git push                 # Push to remote
git pull                 # Pull latest changes
```

---

## Debugging Tips

### Issue: Supabase connection fails
- ✅ Check `.env.local` variables
- ✅ Verify Supabase project is active
- ✅ Check API keys are correct

### Issue: Build fails
- ✅ Run `npm install` to update deps
- ✅ Check for TypeScript errors
- ✅ Clear node_modules: `rm -rf node_modules && npm install`

### Issue: Styles not working
- ✅ Check Tailwind config
- ✅ Verify `@tailwind` directives in CSS
- ✅ Restart dev server

---

## Resource Links

- **Project Plan**: `PROJECT_RESTART_PLAN.md`
- **Full Documentation**: `WikiGames.org - Kế Hoạch Triển Khai Hoàn Chỉnh.md`
- **React Docs**: https://react.dev
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

---

## Need Help?

1. Check `PROJECT_RESTART_PLAN.md` for detailed guide
2. Search error in Google/StackOverflow
3. Ask in project Discord/chat
4. Create GitHub issue

---

**Ready to code? Let's go! 🚀**
