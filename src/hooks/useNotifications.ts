import { useState, useEffect, useCallback } from 'react'

export interface Notification {
  id: string
  type: 'spike' | 'drop' | 'milestone' | 'new' | 'info'
  gameId: string
  gameName: string
  title: string
  message: string
  timestamp: number
  read: boolean
}

const NOTIFICATIONS_KEY = 'wikigames_notifications'
const FIRST_VISIT_KEY = 'wikigames_first_visit'
const MAX_NOTIFICATIONS = 50

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY)
    const isFirstVisit = !localStorage.getItem(FIRST_VISIT_KEY)
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setNotifications(parsed)
        setUnreadCount(parsed.filter((n: Notification) => !n.read).length)
      } catch (e) {
        console.error('Failed to parse notifications:', e)
      }
    }
    
    // Add welcome notifications on first visit
    if (isFirstVisit) {
      localStorage.setItem(FIRST_VISIT_KEY, 'true')
      
      // Add demo notifications
      setTimeout(() => {
        const demoNotifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[] = [
          {
            type: 'info',
            gameId: 'welcome',
            gameName: 'WikiGames',
            title: '👋 Welcome to WikiGames Analytics!',
            message: 'Get real-time notifications for player spikes, drops, and milestones. Star your favorite games to track them!'
          },
          {
            type: 'spike',
            gameId: 'csgo',
            gameName: 'CS:GO',
            title: '📈 Player Spike!',
            message: 'CS:GO players increased by 75%! (800,000 → 1,400,000)'
          },
          {
            type: 'milestone',
            gameId: 'valorant',
            gameName: 'Valorant',
            title: '🏆 Milestone Reached!',
            message: 'Valorant just hit 10.0M players!'
          }
        ]
        
        demoNotifications.forEach((notif, index) => {
          setTimeout(() => {
            const newNotification: Notification = {
              ...notif,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              timestamp: Date.now() - (index * 60000), // Stagger timestamps
              read: false
            }
            setNotifications(prev => [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS))
          }, index * 500) // Stagger by 500ms
        })
      }, 2000) // Wait 2s after page load
    }
  }, [])

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      // Keep only last MAX_NOTIFICATIONS
      return updated.slice(0, MAX_NOTIFICATIONS)
    })

    return newNotification
  }, [])

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Helper to detect player spikes (> 50% increase)
  const checkPlayerSpike = useCallback((gameId: string, gameName: string, oldCount: number, newCount: number) => {
    const increase = ((newCount - oldCount) / oldCount) * 100
    if (increase > 50) {
      addNotification({
        type: 'spike',
        gameId,
        gameName,
        title: '📈 Player Spike!',
        message: `${gameName} players increased by ${increase.toFixed(0)}%! (${oldCount.toLocaleString()} → ${newCount.toLocaleString()})`
      })
    }
  }, [addNotification])

  // Helper to detect player drops (> 30% decrease)
  const checkPlayerDrop = useCallback((gameId: string, gameName: string, oldCount: number, newCount: number) => {
    const decrease = ((oldCount - newCount) / oldCount) * 100
    if (decrease > 30) {
      addNotification({
        type: 'drop',
        gameId,
        gameName,
        title: '📉 Player Drop',
        message: `${gameName} players decreased by ${decrease.toFixed(0)}%. (${oldCount.toLocaleString()} → ${newCount.toLocaleString()})`
      })
    }
  }, [addNotification])

  // Helper to detect milestones
  const checkMilestone = useCallback((gameId: string, gameName: string, playerCount: number) => {
    const milestones = [100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000]
    
    milestones.forEach(milestone => {
      // Check if we just crossed this milestone (within 10% range)
      const range = milestone * 0.1
      if (playerCount >= milestone && playerCount <= milestone + range) {
        addNotification({
          type: 'milestone',
          gameId,
          gameName,
          title: '🏆 Milestone Reached!',
          message: `${gameName} just hit ${(milestone / 1000000).toFixed(1)}M players!`
        })
      }
    })
  }, [addNotification])

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    // Helper methods
    checkPlayerSpike,
    checkPlayerDrop,
    checkMilestone
  }
}
