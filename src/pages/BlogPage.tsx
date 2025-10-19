import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { PostCard } from '../components/blog/PostCard'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card } from '../components/ui/card'
import { PenSquare, Search, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Post {
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

export function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('approved')
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({})
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    loadPosts()
    loadCurrentUser()
  }, [filterStatus])

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    
    if (user) {
      // Load user's votes
      const { data: votes } = await supabase
        .from('post_votes')
        .select('post_id, is_upvote')
        .eq('user_id', user.id)
      
      if (votes) {
        const votesMap: Record<string, 'up' | 'down'> = {}
        votes.forEach(vote => {
          votesMap[vote.post_id] = vote.is_upvote ? 'up' : 'down'
        })
        setUserVotes(votesMap)
      }
    }
  }

  const loadPosts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles(username, rank)
        `)
        .order('created_at', { ascending: false })

      if (filterStatus === 'approved') {
        query = query.eq('status', 'approved')
      } else if (filterStatus === 'pending') {
        query = query.eq('status', 'pending')
      }

      const { data, error } = await query

      if (error) throw error

      setPosts(data || [])
    } catch (error: any) {
      console.error('Error loading posts:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (postId: string, isUpvote: boolean) => {
    if (!currentUser) {
      toast.error('Please sign in to vote')
      return
    }

    try {
      const existingVote = userVotes[postId]
      
      if (existingVote === (isUpvote ? 'up' : 'down')) {
        // Remove vote
        await supabase
          .from('post_votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUser.id)
        
        const newVotes = { ...userVotes }
        delete newVotes[postId]
        setUserVotes(newVotes)
      } else {
        // Add or update vote
        await supabase
          .from('post_votes')
          .upsert({
            post_id: postId,
            user_id: currentUser.id,
            is_upvote: isUpvote,
          })
        
        setUserVotes({
          ...userVotes,
          [postId]: isUpvote ? 'up' : 'down',
        })
      }

      // Reload posts to get updated counts
      loadPosts()
    } catch (error: any) {
      console.error('Error voting:', error)
      toast.error('Failed to vote')
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gaming Blog & Forum</h1>
          <p className="text-muted-foreground">
            Share your gaming experiences, tips, and insights with the community
          </p>
        </div>
        
        <Link to="/blog/create">
          <Button size="lg" className="gap-2">
            <PenSquare className="h-5 w-5" />
            Create Post
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'approved' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('approved')}
              size="sm"
            >
              Approved
            </Button>
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              All Posts
            </Button>
            {currentUser && (
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
                size="sm"
              >
                Pending
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'No posts found matching your search.' : 'No posts yet. Be the first to create one!'}
          </p>
          <Link to="/blog/create">
            <Button>
              <PenSquare className="h-4 w-4 mr-2" />
              Create First Post
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              userVote={userVotes[post.id]}
              onVote={currentUser ? handleVote : undefined}
            />
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="p-6 mt-8 bg-gradient-to-r from-violet-500/10 to-blue-500/10 border-violet-500/20">
        <h3 className="text-lg font-bold mb-2">Community Guidelines</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Posts must be gaming-related and follow community standards</li>
          <li>• All posts require moderation approval before being published</li>
          <li>• Users with higher ranks get priority review</li>
          <li>• Earn points by creating quality content and receiving upvotes</li>
          <li>• Be respectful and constructive in your comments</li>
        </ul>
      </Card>
    </div>
  )
}

