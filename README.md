# WikiGames.org

**Gaming Analytics Platform** - Real-time player statistics, community forums, and chat

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)

---

## 🎮 Features

### Phase 1 - Analytics (MVP) ✅
- 🗺️ **Interactive World Map** - Global player distribution
- 📊 **Analytics Dashboard** - Charts, trends, and leaderboards
- 🔍 **Game Discovery** - Find trending and new games
- 📈 **Real-time Stats** - Live player counts

### Phase 2 - Community (In Progress) 🔄
- 📝 **Blog/Forum** - Share gaming insights
- 💬 **Chat System** - Discord-style real-time chat
- 👤 **User Profiles** - Rank, points, and achievements
- 🔐 **Authentication** - Secure login via Supabase Auth

### Phase 3 - Advanced (Planned) 📅
- 🏆 **Gamification** - Achievements, quests, badges
- 🔔 **Notifications** - Real-time updates
- 🛠️ **Admin Dashboard** - Moderation and analytics
- 📱 **PWA Support** - Mobile app experience

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Shadcn/ui |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime) |
| **Hosting** | Vercel |
| **Charts** | Recharts, D3.js |
| **State** | TanStack Query, Zustand |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/wikigames-analytics.git
cd wikigames-analytics

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

Visit `http://localhost:5173`

### Environment Variables

Create `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📖 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get started in 15 minutes
- **[Project Restart Plan](PROJECT_RESTART_PLAN.md)** - Detailed implementation plan
- **[Full Documentation](WikiGames.org%20-%20Kế%20Hoạch%20Triển%20Khai%20Hoàn%20Chỉnh.md)** - Complete project specification

---

## 🗂️ Project Structure

```
wikigames-analytics/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── lib/           # Utilities and configs
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript types
│   └── services/      # API services
├── supabase/
│   └── migrations/    # Database migrations
├── public/            # Static assets
└── docs/              # Documentation
```

---

## 🔧 Development

### Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

### Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

---

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables on Vercel
Add these in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## 📊 Roadmap

- [x] Phase 1: Core Analytics (Week 1-2)
- [ ] Phase 2: Community Features (Week 3-4)
  - [ ] Blog/Forum system
  - [ ] Chat system
  - [ ] User authentication
- [ ] Phase 3: Enhancements (Week 5-6)
  - [ ] Rich text editor
  - [ ] Image uploads
  - [ ] Notifications
- [ ] Phase 4: Advanced Features (Week 7-8)
  - [ ] Gamification
  - [ ] Admin dashboard
- [ ] Phase 5: Mobile & PWA (Week 9-10)
- [ ] Phase 6: Scale & Optimize (Week 11-12)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Project Lead**: [Your Name]
- **Contributors**: See [CONTRIBUTORS.md](CONTRIBUTORS.md)

---

## 📞 Support

- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Community chat (coming soon)
- **Email**: support@wikigames.org

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [Vercel](https://vercel.com) - Hosting platform
- [Shadcn/ui](https://ui.shadcn.com) - UI components
- Gaming APIs: Steam, RAWG, etc.

---

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/wikigames-analytics?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/wikigames-analytics?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/wikigames-analytics?style=social)

---

**Built with ❤️ for the gaming community**

[Website](https://wikigames.org) · [Documentation](./docs) · [Report Bug](https://github.com/yourusername/wikigames-analytics/issues) · [Request Feature](https://github.com/yourusername/wikigames-analytics/issues)
