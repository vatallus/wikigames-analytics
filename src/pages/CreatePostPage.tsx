import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Card } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function CreatePostPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    gameId: '',
    tags: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('You must be logged in to create a post')
        navigate('/blog')
        return
      }

      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Date.now()

      const { error } = await supabase
        .from('posts')
        .insert({
          title: formData.title,
          slug,
          content: formData.content,
          author_id: user.id,
          game_id: formData.gameId || null,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
          excerpt: formData.content.substring(0, 200) + '...',
        })

      if (error) throw error

      toast.success('Post created! Waiting for moderation approval.')
      navigate('/blog')
    } catch (error: any) {
      console.error('Error creating post:', error)
      toast.error(error.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/blog')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground mt-2">
          Share your gaming insights with the community. Posts require moderation approval.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter post title (min 10 characters)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              minLength={10}
              maxLength={200}
              required
            />
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Game Selection */}
          <div className="space-y-2">
            <Label htmlFor="game">Game (Optional)</Label>
            <Select
              value={formData.gameId}
              onValueChange={(value) => setFormData({ ...formData, gameId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a game (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific game</SelectItem>
                <SelectItem value="730">Counter-Strike 2</SelectItem>
                <SelectItem value="570">Dota 2</SelectItem>
                <SelectItem value="578080">PUBG</SelectItem>
                <SelectItem value="1172470">Apex Legends</SelectItem>
                <SelectItem value="1938090">Valorant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Write your post content here... (min 100 characters)"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              minLength={100}
              rows={15}
              required
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {formData.content.length} characters (minimum 100)
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              placeholder="e.g., tips, guide, review (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading || formData.title.length < 10 || formData.content.length < 100}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Review
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/blog')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> All posts are reviewed by moderators before being published.
              Posts with higher quality content and from users with higher ranks are prioritized.
            </p>
          </div>
        </form>
      </Card>
    </div>
  )
}

