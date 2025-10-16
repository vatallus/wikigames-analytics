import { Clock, ExternalLink, Trophy, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

interface NewsArticle {
  id: string
  title: string
  summary: string
  url: string
  image: string
  source: string
  publishedAt: string
  game?: string
  category: string
}

interface GameNewsProps {
  news: NewsArticle[]
}

export function GameNews({ news }: GameNewsProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tournament':
        return <Trophy className="h-3 w-3" />
      case 'update':
      case 'patch':
        return <Zap className="h-3 w-3" />
      default:
        return null
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tournament':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'update':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'patch':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'announcement':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      default:
        return 'bg-muted'
    }
  }

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Latest Gaming News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No news available. Check back later!</p>
          </div>
        ) : (
          news.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                {article.image && (
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getCategoryColor(article.category)}`}
                    >
                      {getCategoryIcon(article.category)}
                      <span className="ml-1 capitalize">{article.category}</span>
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {timeAgo(article.publishedAt)}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{article.source}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </a>
          ))
        )}
      </CardContent>
    </Card>
  )
}
