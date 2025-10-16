/**
 * Game News Service - Aggregate gaming news from multiple sources
 */

export interface NewsArticle {
  id: string
  title: string
  summary: string
  url: string
  image: string
  source: string
  publishedAt: string
  game?: string
  category: 'update' | 'tournament' | 'patch' | 'news' | 'announcement'
}

/**
 * Get latest gaming news
 * In production, this would fetch from RSS feeds, Steam News API, or gaming news sites
 */
export async function getLatestNews(gameId?: string): Promise<NewsArticle[]> {
  // Mock data - replace with real API calls
  const mockNews: NewsArticle[] = [
    {
      id: '1',
      title: 'CS:GO Major Championship 2024 Announced',
      summary: 'Valve announces the next CS:GO Major with $1M prize pool. Teams from around the world will compete in Copenhagen, Denmark.',
      url: 'https://blog.counter-strike.net/',
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
      source: 'Counter-Strike Blog',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      game: 'csgo',
      category: 'tournament'
    },
    {
      id: '2',
      title: 'Dota 2: The International 2024 Prize Pool Exceeds $40M',
      summary: 'The largest esports prize pool in history continues to grow as fans support their favorite teams through the Battle Pass.',
      url: 'https://www.dota2.com/',
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg',
      source: 'Dota 2 Official',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      game: 'dota2',
      category: 'tournament'
    },
    {
      id: '3',
      title: 'PUBG Season 25: New Map and Weapons',
      summary: 'Experience the new Rondo map featuring urban combat zones and introducing the EMT Gear for enhanced tactical gameplay.',
      url: 'https://www.pubg.com/',
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg',
      source: 'PUBG Official',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      game: 'pubg',
      category: 'update'
    },
    {
      id: '4',
      title: 'Valorant Champions Tour 2024 Schedule Released',
      summary: 'Riot Games announces the full VCT 2024 calendar with events across Americas, EMEA, Pacific, and China regions.',
      url: 'https://valorantesports.com/',
      image: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5ea6f577ca7247c9/valorant-logo.png',
      source: 'Valorant Esports',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      game: 'valorant',
      category: 'announcement'
    },
    {
      id: '5',
      title: 'League of Legends Patch 14.1: Major Balance Changes',
      summary: 'Extensive champion updates and item changes shake up the meta ahead of the spring split.',
      url: 'https://www.leagueoflegends.com/',
      image: 'https://cdn1.epicgames.com/offer/24b9b5e323bc40eea252a10cdd3b2f10/EGS_LeagueofLegends_RiotGames_S1_2560x1440-80471666c140f790f28dff68d72c384b',
      source: 'League of Legends',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      game: 'lol',
      category: 'patch'
    }
  ]

  if (gameId) {
    return mockNews.filter(news => news.game === gameId)
  }

  return mockNews
}

/**
 * Get upcoming tournaments
 */
export async function getUpcomingTournaments() {
  return [
    {
      id: '1',
      name: 'The International 2024',
      game: 'Dota 2',
      gameId: 'dota2',
      prizePool: '$40,000,000',
      startDate: '2024-10-20',
      endDate: '2024-11-03',
      location: 'Seattle, USA',
      teams: 20,
      status: 'upcoming',
      url: 'https://www.dota2.com/international'
    },
    {
      id: '2',
      name: 'CS:GO Major Copenhagen 2024',
      game: 'Counter-Strike',
      gameId: 'csgo',
      prizePool: '$1,000,000',
      startDate: '2024-03-17',
      endDate: '2024-03-31',
      location: 'Copenhagen, Denmark',
      teams: 24,
      status: 'live',
      url: 'https://blog.counter-strike.net/'
    },
    {
      id: '3',
      name: 'Valorant Champions 2024',
      game: 'Valorant',
      gameId: 'valorant',
      prizePool: '$2,250,000',
      startDate: '2024-08-01',
      endDate: '2024-08-26',
      location: 'Seoul, South Korea',
      teams: 16,
      status: 'upcoming',
      url: 'https://valorantesports.com/'
    },
    {
      id: '4',
      name: 'League of Legends World Championship',
      game: 'League of Legends',
      gameId: 'lol',
      prizePool: '$2,225,000',
      startDate: '2024-09-25',
      endDate: '2024-11-02',
      location: 'London, UK',
      teams: 22,
      status: 'upcoming',
      url: 'https://lolesports.com/worlds'
    }
  ]
}
