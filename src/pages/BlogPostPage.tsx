import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Calendar, Share2, Twitter, Facebook } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import toast from 'react-hot-toast'

interface BlogPostMeta {
  title: string
  description: string
  readTime: string
  category: string
  keywords: string[]
  published: string
  thumbnail?: string
  author?: string
}

const blogPostsMeta: Record<string, BlogPostMeta> = {
  'valorant-vs-csgo-comparison': {
    title: 'Valorant vs CS:GO 2025: Complete Comparison & Player Statistics',
    description: 'In-depth comparison of the two biggest tactical shooters with player statistics, esports scene analysis.',
    readTime: '9 min',
    category: 'Comparisons',
    keywords: ['Valorant', 'CS:GO', 'FPS', 'Comparison'],
    published: 'October 17, 2025',
    thumbnail: '/blog/images/valorant-vs-csgo.jpg',
    author: 'WikiGames Team'
  },
  'csgo-player-count-guide': {
    title: 'CS:GO Player Count 2025: Real-time Tracking Guide',
    description: 'Complete guide to tracking CS:GO player counts in real-time with statistics and trends.',
    readTime: '6 min',
    category: 'Statistics',
    keywords: ['CS:GO', 'Player Count', 'Statistics'],
    published: 'October 17, 2025',
    thumbnail: '/blog/images/csgo-stats.jpg',
    author: 'WikiGames Team'
  },
  'dota2-statistics-complete-guide': {
    title: 'Dota 2 Statistics 2025: Complete Analytics Guide',
    description: 'Comprehensive Dota 2 player statistics and analytics guide.',
    readTime: '7 min',
    category: 'Statistics',
    keywords: ['Dota 2', 'Analytics', 'Statistics'],
    published: 'October 17, 2025',
    thumbnail: '/blog/images/dota2-stats.jpg',
    author: 'WikiGames Team'
  },
  'steam-player-count-tracking': {
    title: 'Steam Player Count Tracking: Complete Guide',
    description: 'Learn how to track Steam player counts across all games.',
    readTime: '7 min',
    category: 'Guides',
    keywords: ['Steam', 'Tracking', 'Analytics'],
    published: 'October 17, 2025'
  },
  'esports-statistics-trends-2025': {
    title: 'Esports Statistics & Trends 2025: Industry Analysis',
    description: 'Latest esports industry statistics and trends analysis.',
    readTime: '8 min',
    category: 'Industry',
    keywords: ['Esports', 'Trends', 'Statistics'],
    published: 'October 17, 2025'
  },
  'free-gaming-tools-2025': {
    title: '15 Best Free Gaming Tools (No Paywalls!)',
    description: 'Comprehensive list of the best free gaming tools in 2025.',
    readTime: '10 min',
    category: 'Tools',
    keywords: ['Free Tools', 'Gaming', 'Software'],
    published: 'October 17, 2025'
  },
  'gaming-dashboard-features': {
    title: 'Essential Gaming Dashboard Features to Look For',
    description: 'What makes a great gaming analytics dashboard.',
    readTime: '6 min',
    category: 'Guides',
    keywords: ['Dashboard', 'Features', 'Analytics'],
    published: 'October 17, 2025'
  },
  'gaming-trends-2025': {
    title: 'Gaming Trends 2025: What\'s Hot in PC Gaming & Esports',
    description: 'Top gaming industry trends for 2025.',
    readTime: '8 min',
    category: 'Industry',
    keywords: ['Trends', 'Gaming', 'Industry'],
    published: 'October 17, 2025'
  },
  'create-viral-gaming-content': {
    title: 'How to Create Viral Gaming Content in 2025',
    description: 'Proven strategies to make your gaming content go viral.',
    readTime: '10 min',
    category: 'Marketing',
    keywords: ['Viral', 'Content', 'Marketing'],
    published: 'October 17, 2025'
  },
  'best-gaming-analytics-tools-2025': {
    title: 'Best Gaming Analytics Tools in 2025: Complete Guide',
    description: 'Top gaming analytics tools comparison.',
    readTime: '8 min',
    category: 'Tools',
    keywords: ['Analytics', 'Tools', 'Gaming'],
    published: 'October 17, 2025'
  }
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const meta = slug ? blogPostsMeta[slug] : null

  useEffect(() => {
    if (!slug || !meta) {
      setError(true)
      setLoading(false)
      return
    }

    // Load markdown content
    fetch(`/blog/${slug}.md`)
      .then(res => {
        if (!res.ok) throw new Error('Post not found')
        return res.text()
      })
      .then(text => {
        setContent(text)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [slug, meta])

  const handleShare = (platform: 'twitter' | 'facebook') => {
    if (!meta) return
    
    const url = `https://wikigames.org/blog/${slug}`
    const text = meta.title
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }
    
    window.open(urls[platform], '_blank', 'width=600,height=400')
    toast.success(`Opening ${platform}...`)
  }

  const handleCopyLink = () => {
    const url = `https://wikigames.org/blog/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied! 🔗')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !meta) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist.
            </p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`${meta.title} | WikiGames Blog`}
        description={meta.description}
        keywords={meta.keywords.join(', ')}
        canonical={`https://wikigames.org/blog/${slug}`}
      />

      <div className="min-h-screen bg-gradient-to-b from-violet-500/5 via-background to-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline">{meta.category}</Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{meta.published}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{meta.readTime} read</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {meta.title}
            </h1>

            {/* Thumbnail Image */}
            {meta.thumbnail && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <img 
                  src={meta.thumbnail} 
                  alt={meta.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    // Hide image if it fails to load
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}

            <p className="text-xl text-muted-foreground mb-6">
              {meta.description}
            </p>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2 mb-6">
              {meta.keywords.map(keyword => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 pb-6 border-b">
              <span className="text-sm text-muted-foreground mr-2">Share:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <Card className="mb-8">
            <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-cyan-500/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Track Gaming Stats?</h3>
              <p className="text-muted-foreground mb-6">
                All the tools mentioned in this article are available for free on WikiGames.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/">
                  <Button size="lg" className="bg-gradient-to-r from-violet-500 to-blue-500">
                    Start Tracking
                  </Button>
                </Link>
                <Link to="/share-test">
                  <Button size="lg" variant="outline">
                    Create Stat Cards
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Back to Blog */}
          <div className="text-center mt-8">
            <Link to="/blog">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
