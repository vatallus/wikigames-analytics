import { Bell, X, Check, TrendingUp, TrendingDown, Trophy, Sparkles, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useNotifications, Notification } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications()

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'spike': return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'drop': return <TrendingDown className="h-5 w-5 text-red-500" />
      case 'milestone': return <Trophy className="h-5 w-5 text-yellow-500" />
      case 'new': return <Sparkles className="h-5 w-5 text-blue-500" />
      default: return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card border-l shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h2 className="font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <Badge className="rounded-full bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="p-2 border-b flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 p-4 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground font-medium mb-2">No notifications yet</p>
                  <p className="text-sm text-muted-foreground">
                    We'll notify you when there are important updates
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className={cn(
                        'p-3 rounded-lg border transition-colors cursor-pointer',
                        notification.read
                          ? 'bg-card hover:bg-accent/50'
                          : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-semibold text-sm leading-tight">
                              {notification.title}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 -mt-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {notification.gameName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
