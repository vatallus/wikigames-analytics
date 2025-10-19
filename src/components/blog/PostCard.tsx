import { Link } from 'react-router-dom'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { ArrowUp, ArrowDown, MessageCircle, Eye, Calendar, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string
    author_id: string
    author?: {
      username: string
      rank: string
    }
    game_id?: string
    upvotes_count: number
    downvotes_count: number
    comments_count: number
    views_count: number
    tags?: string[]
    created_at: string
    status: string
  }
  userVote?: 'up' | 'down' | null
  onVote?: (postId: string, isUpvote: boolean) => void
}

export function PostCard({ post, userVote, onVote }: PostCardProps) {
  const score = post.upvotes_count - post.downvotes_count

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Voting Section */}
        <div className="flex flex-col items-center gap-2 min-w-[60px]">
          <button
            onClick={() => onVote?.(post.id, true)}
            className={`p-2 rounded-lg transition-colors ${
              userVote === 'up'
                ? 'bg-green-500 text-white'
                : 'hover:bg-muted'
            }`}
            disabled={!onVote}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
          
          <div className={`text-lg font-bold ${
            score > 0 ? 'text-green-500' : score < 0 ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            {score > 0 ? '+' : ''}{score}
          </div>
          
          <button
            onClick={() => onVote?.(post.id, false)}
            className={`p-2 rounded-lg transition-colors ${
              userVote === 'down'
                ? 'bg-red-500 text-white'
                : 'hover:bg-muted'
            }`}
            disabled={!onVote}
          >
            <ArrowDown className="h-5 w-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1">
          {/* Title */}
          <Link to={`/blog/${post.slug}`}>
            <h3 className="text-xl font-bold hover:text-primary transition-colors mb-2">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {/* Author */}
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author?.username || 'Anonymous'}</span>
              {post.author?.rank && (
                <Badge variant="outline" className="ml-1 text-xs">
                  {post.author.rank}
                </Badge>
              )}
            </div>

            {/* Date */}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
            </div>

            {/* Comments */}
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments_count} comments</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.views_count} views</span>
            </div>

            {/* Status Badge (for pending posts) */}
            {post.status === 'pending' && (
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                Pending Review
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

