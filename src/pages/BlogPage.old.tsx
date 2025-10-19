import { SEO } from '@/components/SEO'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BlogPost {
  slug: string
  title: string
  description: string
  readTime: string
  category: string
  keywords: string[]
  searches: string
  featured?: boolean
}

const blogPosts: BlogPost[] = [
  {
    slug: 'valorant-vs-csgo-comparison',
    title: 'Valorant vs CS:GO 2025: Complete Comparison',
    description: 'In-depth comparison of the two biggest tactical shooters with player statistics, esports scene analysis, and which one you should play.',
    readTime: '9 min',
    category: 'Comparisons',
    keywords: ['Valorant', 'CS:GO', 'FPS'],
    searches: '20K',
    featured: true
  },
  {
    slug: 'csgo-player-count-guide',
    title: 'CS:GO Player Count 2025: Real-time Tracking Guide',
    description: 'Complete guide to tracking CS:GO player counts in real-time. Current statistics, peak hours, regional breakdown, and historical trends.',
    readTime: '6 min',
    category: 'Statistics',
    keywords: ['CS:GO', 'Player Count'],
    searches: '15K',
    featured: true
  },
  {
    slug: 'dota2-statistics-complete-guide',
    title: 'Dota 2 Statistics 2025: Complete Analytics Guide',
    description: 'Comprehensive Dota 2 player statistics, regional breakdowns, peak times, and how to track real-time data for free.',
    readTime: '7 min',
    category: 'Statistics',
    keywords: ['Dota 2', 'Analytics'],
    searches: '12K',
    featured: true
  },
  {
    slug: 'steam-player-count-tracking',
    title: 'Steam Player Count Tracking: Complete Guide',
    description: 'Learn how to track Steam player counts across all games, best tools, and understanding concurrent player statistics.',
    readTime: '7 min',
    category: 'Guides',
    keywords: ['Steam', 'Tracking'],
    searches: '10K'
  },
  {
    slug: 'esports-statistics-trends-2025',
    title: 'Esports Statistics & Trends 2025: Industry Analysis',
    description: 'Latest esports industry statistics, viewership trends, prize pools, and growth analysis for 2025.',
    readTime: '8 min',
    category: 'Industry',
    keywords: ['Esports', 'Trends'],
    searches: '8K'
  },
  {
    slug: 'free-gaming-tools-2025',
    title: '15 Best Free Gaming Tools (No Paywalls!)',
    description: 'Comprehensive list of the best completely free gaming tools in 2025 - analytics, streaming, communication, and more.',
    readTime: '10 min',
    category: 'Tools',
    keywords: ['Free Tools', 'Gaming'],
    searches: '6K'
  },
  {
    slug: 'gaming-dashboard-features',
    title: 'Essential Gaming Dashboard Features to Look For',
    description: 'What makes a great gaming analytics dashboard? Top 10 must-have features for tracking your favorite games.',
    readTime: '6 min',
    category: 'Guides',
    keywords: ['Dashboard', 'Features'],
    searches: '4K'
  },
  {
    slug: 'gaming-trends-2025',
    title: 'Gaming Trends 2025: What\'s Hot in PC Gaming & Esports',
    description: 'Top gaming industry trends for 2025 including cross-platform gaming, cloud gaming, AI, and esports growth.',
    readTime: '8 min',
    category: 'Industry',
    keywords: ['Trends', 'Gaming'],
    searches: '3K'
  },
  {
    slug: 'create-viral-gaming-content',
    title: 'How to Create Viral Gaming Content in 2025',
    description: 'Proven strategies to make your gaming content go viral on social media. Tools, timing, and tactics that work.',
    readTime: '10 min',
    category: 'Marketing',
    keywords: ['Viral', 'Content'],
    searches: '800'
  },
  {
    slug: 'best-gaming-analytics-tools-2025',
    title: 'Best Gaming Analytics Tools in 2025: Complete Guide',
    description: 'Top 10 gaming analytics tools including free and paid options. Compare features, pricing, and find the best fit.',
    readTime: '8 min',
    category: 'Tools',
    keywords: ['Analytics', 'Tools'],
    searches: '500'
  }
]

export function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <>
      <SEO
        title="Gaming Blog - Statistics, Guides & Industry Insights | WikiGames"
        description="Expert gaming content covering player statistics, esports trends, analytics tools, and comprehensive guides for CS:GO, Dota 2, Valorant, and more."
        keywords="gaming blog, esports news, gaming statistics, CS:GO guides, Dota 2 analytics, gaming industry trends"
        canonical="https://wikigames.org/blog"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-violet-500/5 via-background to-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-cyan-500/10 border-b">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-medium">Gaming Knowledge Base</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              WikiGames Blog
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover the world of gaming through in-depth articles about game statistics, esports trends, 
              tool guides, and detailed analysis of the hottest titles.
              <br />
              <strong>100% Free</strong> • <strong>10+ Quality Articles</strong> • <strong>Regular Updates</strong>
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Updated Weekly</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>6-10 min reads</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Featured Posts */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold">Featured Articles</h2>
              <Badge variant="secondary" className="bg-gradient-to-r from-violet-500 to-blue-500 text-white">
                Most Popular
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card key={post.slug} className="group hover:shadow-lg transition-all border-primary/20 hover:border-primary/40">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span>{post.searches}/mo</span>
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime} read</span>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Articles */}
          <div>
            <h2 className="text-3xl font-bold mb-6">All Articles</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Card key={post.slug} className="group hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.searches}/mo</span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <Button variant="ghost" size="sm">
                          Read
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="mt-16 bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-cyan-500/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Track Gaming Stats?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                All the tools and data mentioned in these articles are available for free on WikiGames.
                Start tracking your favorite games now!
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/">
                  <Button size="lg" className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Start Tracking
                  </Button>
                </Link>
                <Link to="/analytics">
                  <Button size="lg" variant="outline">
                    View Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
