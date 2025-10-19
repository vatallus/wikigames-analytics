# 🔧 Code Optimization & Refactoring Plan

## 📊 Current Issues Analysis

### **1. Structure Problems:**
- ❌ Components không được organize tốt (42 files trong 1 folder)
- ❌ Pages có duplicate logic
- ❌ No proper separation of concerns
- ❌ Auth logic scattered across components
- ❌ No reusable hooks for common patterns

### **2. Security Issues:**
- ❌ API keys có thể bị expose
- ❌ No input sanitization
- ❌ No rate limiting on client
- ❌ Auth state có thể bị bypass
- ❌ XSS vulnerabilities trong user-generated content

### **3. Maintainability Issues:**
- ❌ Large components (>200 lines)
- ❌ Duplicate code
- ❌ No TypeScript strict mode
- ❌ Missing error boundaries
- ❌ No logging/monitoring

### **4. Performance Issues:**
- ❌ No code splitting
- ❌ Large bundle size (1.26MB)
- ❌ No lazy loading
- ❌ Unnecessary re-renders
- ❌ No memoization

---

## 🎯 Optimization Plan

### **Phase 1: Structure Reorganization** (Priority: HIGH)

#### **1.1 Components Folder Structure**

**Before:**
```
src/components/
  ├── Component1.tsx (42 files mixed)
  ├── Component2.tsx
  └── ...
```

**After:**
```
src/components/
  ├── features/          # Feature-specific components
  │   ├── analytics/
  │   │   ├── StatsPanel.tsx
  │   │   ├── PlayerTrendChart.tsx
  │   │   └── PeakHoursHeatmap.tsx
  │   ├── games/
  │   │   ├── GameCard.tsx
  │   │   ├── GameDetails.tsx
  │   │   ├── GameFilter.tsx
  │   │   ├── GameSearch.tsx
  │   │   └── GameComparison.tsx
  │   ├── leaderboard/
  │   │   ├── GameLeaderboard.tsx
  │   │   └── DonorLeaderboard.tsx
  │   ├── profile/
  │   │   ├── AchievementStats.tsx
  │   │   ├── PlayerMilestones.tsx
  │   │   └── GameRecommendations.tsx
  │   └── donation/
  │       ├── DonationPanel.tsx
  │       ├── VerifyTransactionModal.tsx
  │       └── DonorLeaderboard.tsx
  │
  ├── layout/            # Layout components
  │   ├── Navigation.tsx
  │   ├── Header.tsx
  │   ├── Footer.tsx
  │   └── Breadcrumbs.tsx
  │
  ├── common/            # Reusable components
  │   ├── LoadingSkeleton.tsx
  │   ├── ErrorBoundary.tsx
  │   ├── ShareButton.tsx
  │   ├── FavoriteButton.tsx
  │   ├── AnimatedNumber.tsx
  │   └── SEO.tsx
  │
  ├── auth/              # Authentication (keep as is)
  │   ├── AuthButtons.tsx
  │   ├── AuthModal.tsx
  │   └── UserMenu.tsx
  │
  ├── notifications/     # Notifications
  │   └── NotificationPanel.tsx
  │
  ├── visualizations/    # Charts & maps
  │   ├── WorldMap.tsx
  │   ├── LiveStatsBar.tsx
  │   └── RegionalRivalry.tsx
  │
  └── ui/               # Base UI components (keep as is)
      ├── button.tsx
      ├── card.tsx
      ├── input.tsx
      └── ...
```

#### **1.2 Create Hooks Folder**

```
src/hooks/
  ├── useAuth.ts              # Auth state management
  ├── useRealTimeData.ts      # (exists, optimize)
  ├── useNotifications.ts     # (exists, optimize)
  ├── useLocalStorage.ts      # Persistent state
  ├── useDebounce.ts          # Debounce search
  ├── useIntersectionObserver.ts  # Lazy load
  ├── useClickOutside.ts      # Close dropdowns
  └── useFetch.ts             # API calls with caching
```

#### **1.3 Create Utils Folder**

```
src/utils/
  ├── validation/
  │   ├── transactionHash.ts   # Crypto validation
  │   ├── email.ts             # Email validation
  │   └── sanitize.ts          # Input sanitization
  ├── formatting/
  │   ├── numbers.ts           # Format numbers
  │   ├── dates.ts             # Format dates
  │   └── currency.ts          # Format currency
  ├── api/
  │   ├── client.ts            # Axios instance with interceptors
  │   ├── auth.ts              # Auth API calls
  │   └── analytics.ts         # Analytics API calls
  ├── security/
  │   ├── xss.ts               # XSS prevention
  │   ├── rateLimiter.ts       # Client-side rate limiting
  │   └── encryption.ts        # Sensitive data encryption
  └── constants.ts             # Global constants
```

---

### **Phase 2: Security Improvements** (Priority: CRITICAL)

#### **2.1 Input Sanitization**

Create `src/utils/security/sanitize.ts`:
```typescript
import DOMPurify from 'isomorphic-dompurify'

export const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  })
}

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .slice(0, 500) // Max length
}
```

#### **2.2 Environment Variables Protection**

Create `src/config/env.ts`:
```typescript
// Only expose safe env vars
export const config = {
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
}

// Validate on startup
if (!config.supabase.url || !config.supabase.anonKey) {
  console.error('Missing required environment variables')
}
```

#### **2.3 CSP Headers**

Update `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://mbqzwqdqiowtsnutbrgl.supabase.co https://postgres-production-959d.up.railway.app wss://postgres-production-959d.up.railway.app"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

#### **2.4 Rate Limiting**

Create `src/utils/security/rateLimiter.ts`:
```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  canMakeRequest(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    // Filter out old requests
    const recentRequests = requests.filter(time => now - time < windowMs)
    
    if (recentRequests.length >= maxRequests) {
      return false
    }
    
    recentRequests.push(now)
    this.requests.set(key, recentRequests)
    return true
  }
}

export const rateLimiter = new RateLimiter()
```

---

### **Phase 3: Performance Optimization** (Priority: HIGH)

#### **3.1 Code Splitting**

```typescript
// src/App.tsx - Lazy load pages
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('./pages/HomePage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

// Use with Suspense
<Suspense fallback={<LoadingSkeleton />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/analytics" element={<AnalyticsPage />} />
  </Routes>
</Suspense>
```

#### **3.2 Bundle Size Reduction**

```json
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
          'charts': ['recharts', 'd3-geo', 'react-simple-maps'],
          'supabase': ['@supabase/supabase-js']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
```

#### **3.3 Memoization**

```typescript
// Use React.memo for expensive components
export const GameCard = React.memo(({ game }: Props) => {
  // Component code
}, (prevProps, nextProps) => {
  return prevProps.game.id === nextProps.game.id &&
         prevProps.game.currentPlayers === nextProps.game.currentPlayers
})

// Use useMemo for expensive calculations
const sortedGames = useMemo(() => {
  return games.sort((a, b) => b.currentPlayers - a.currentPlayers)
}, [games])

// Use useCallback for event handlers
const handleClick = useCallback((gameId: string) => {
  // Handle click
}, [])
```

---

### **Phase 4: Code Quality** (Priority: MEDIUM)

#### **4.1 TypeScript Strict Mode**

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### **4.2 ESLint Rules**

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "max-lines": ["error", 300],
    "max-lines-per-function": ["error", 50],
    "complexity": ["error", 10],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

#### **4.3 Error Boundaries**

```typescript
// src/components/common/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to monitoring service
    console.error('Error caught:', error, errorInfo)
    // Send to Sentry/LogRocket
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

---

### **Phase 5: Testing** (Priority: MEDIUM)

#### **5.1 Unit Tests**

```typescript
// src/utils/__tests__/validation.test.ts
import { validateTransactionHash } from '../validation/transactionHash'

describe('validateTransactionHash', () => {
  it('should validate USDT hash', () => {
    const hash = 'a'.repeat(64)
    expect(validateTransactionHash(hash, 'usdt_trc20')).toBe(true)
  })
  
  it('should reject invalid hash', () => {
    expect(validateTransactionHash('invalid', 'usdt_trc20')).toBe(false)
  })
})
```

#### **5.2 Integration Tests**

```typescript
// src/pages/__tests__/ProfilePage.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { ProfilePage } from '../ProfilePage'

describe('ProfilePage', () => {
  it('should show login prompt when not authenticated', () => {
    render(<ProfilePage />)
    expect(screen.getByText(/login required/i)).toBeInTheDocument()
  })
})
```

---

## 📋 Implementation Checklist

### **Week 1: Critical Security & Structure**
- [ ] Setup folder structure
- [ ] Move components to new folders
- [ ] Create security utils (sanitize, rate limiter)
- [ ] Add CSP headers
- [ ] Environment variables protection
- [ ] Update imports across all files

### **Week 2: Performance & Code Quality**
- [ ] Implement code splitting
- [ ] Add lazy loading for pages
- [ ] Optimize bundle size
- [ ] Add React.memo to expensive components
- [ ] Enable TypeScript strict mode
- [ ] Fix all TypeScript errors

### **Week 3: Refactoring & DRY**
- [ ] Extract common hooks
- [ ] Create reusable utilities
- [ ] Remove duplicate code
- [ ] Add error boundaries
- [ ] Improve error handling

### **Week 4: Testing & Documentation**
- [ ] Write unit tests for utils
- [ ] Write integration tests for pages
- [ ] Update documentation
- [ ] Add JSDoc comments
- [ ] Performance testing

---

## 🎯 Expected Results

### **Before:**
- Bundle size: 1.26 MB
- Load time: ~3s
- Security score: 70/100
- Maintainability: Low
- Test coverage: 0%

### **After:**
- Bundle size: ~600 KB (52% reduction)
- Load time: ~1.5s (50% faster)
- Security score: 95/100
- Maintainability: High
- Test coverage: 80%+

---

## 🚀 Quick Wins (Can do now)

### **1. Move files to organized structure**
```bash
mkdir -p src/components/{features,layout,common,visualizations}
mkdir -p src/utils/{validation,formatting,api,security}
mkdir -p src/hooks
```

### **2. Add security headers (vercel.json)**
Already documented above - just update file

### **3. Enable lazy loading**
Add React.lazy() to App.tsx for pages

### **4. Add input sanitization**
Create sanitize utility and use in all forms

### **5. Environment variables protection**
Create config/env.ts

---

## 📚 Resources

- **Security**: OWASP Top 10
- **Performance**: Lighthouse CI
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier + SonarQube
- **Monitoring**: Sentry + LogRocket

---

**Priority Order:**
1. 🔴 Security fixes (XSS, CSP, input sanitization)
2. 🟡 Structure reorganization
3. 🟡 Performance optimization
4. 🟢 Testing & documentation
