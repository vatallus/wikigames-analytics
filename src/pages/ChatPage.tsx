import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { ScrollArea } from '../components/ui/scroll-area'
import { Badge } from '../components/ui/badge'
import { Send, Hash, Users, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

interface Channel {
  id: string
  name: string
  slug: string
  description: string
  type: string
  game_id?: string
  members_count: number
}

interface Message {
  id: string
  content: string
  author_id: string
  author?: {
    username: string
    rank: string
  }
  created_at: string
}

export function ChatPage() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadChannels()
    loadCurrentUser()
  }, [])

  useEffect(() => {
    if (selectedChannel) {
      loadMessages(selectedChannel.id)
      subscribeToMessages(selectedChannel.id)
    }
  }, [selectedChannel])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  const loadChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('name')

      if (error) throw error

      setChannels(data || [])
      if (data && data.length > 0) {
        setSelectedChannel(data[0])
      }
    } catch (error: any) {
      console.error('Error loading channels:', error)
      toast.error('Failed to load channels')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (channelId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          author:profiles(username, rank)
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) throw error

      setMessages(data || [])
    } catch (error: any) {
      console.error('Error loading messages:', error)
      toast.error('Failed to load messages')
    }
  }

  const subscribeToMessages = (channelId: string) => {
    const subscription = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        async (payload) => {
          // Load author info
          const { data: author } = await supabase
            .from('profiles')
            .select('username, rank')
            .eq('id', payload.new.author_id)
            .single()

          setMessages((prev) => [
            ...prev,
            { ...payload.new, author } as Message,
          ])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedChannel || !currentUser) {
      if (!currentUser) {
        toast.error('Please sign in to send messages')
      }
      return
    }

    setSending(true)

    try {
      // Check if user is a member of the channel
      const { data: membership } = await supabase
        .from('channel_members')
        .select('*')
        .eq('channel_id', selectedChannel.id)
        .eq('user_id', currentUser.id)
        .single()

      if (!membership) {
        // Auto-join channel
        await supabase
          .from('channel_members')
          .insert({
            channel_id: selectedChannel.id,
            user_id: currentUser.id,
          })
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          channel_id: selectedChannel.id,
          author_id: currentUser.id,
          content: newMessage.trim(),
        })

      if (error) throw error

      setNewMessage('')
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast.error(error.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Game Chat</h1>
        <p className="text-muted-foreground">
          Join game-specific channels and chat with other players in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-300px)]">
        {/* Channel List */}
        <Card className="md:col-span-1 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="h-5 w-5" />
            <h2 className="font-bold">Channels</h2>
          </div>
          <ScrollArea className="h-[calc(100%-50px)]">
            <div className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedChannel?.id === channel.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span className="text-sm font-medium truncate">
                      {channel.name}
                    </span>
                  </div>
                  {channel.members_count > 0 && (
                    <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                      <Users className="h-3 w-3" />
                      <span>{channel.members_count}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-3 flex flex-col">
          {selectedChannel ? (
            <>
              {/* Channel Header */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  <h2 className="font-bold">{selectedChannel.name}</h2>
                  {selectedChannel.type === 'announcement' && (
                    <Badge variant="secondary">Announcements</Badge>
                  )}
                </div>
                {selectedChannel.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedChannel.description}
                  </p>
                )}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No messages yet. Be the first to say something!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {message.author?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              {message.author?.username || 'Anonymous'}
                            </span>
                            {message.author?.rank && (
                              <Badge variant="outline" className="text-xs">
                                {message.author.rank}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(message.created_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                {currentUser ? (
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder={`Message #${selectedChannel.name}`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sending || selectedChannel.type === 'announcement'}
                      maxLength={2000}
                    />
                    <Button
                      type="submit"
                      disabled={sending || !newMessage.trim() || selectedChannel.type === 'announcement'}
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center text-muted-foreground py-2">
                    Please sign in to send messages
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a channel to start chatting
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

