import { useState, useEffect, useCallback, useRef } from 'react'
import {
  fetchGameData,
  createWebSocketConnection,
  checkServerHealth,
  AggregatedDataResponse,
  refreshData
} from '@/services/apiService'
import { useNotifications } from './useNotifications'

export function useRealTimeData() {
  const [data, setData] = useState<AggregatedDataResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serverAvailable, setServerAvailable] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const previousDataRef = useRef<AggregatedDataResponse | null>(null)
  
  // Get notification helpers
  const { checkPlayerSpike, checkPlayerDrop, checkMilestone } = useNotifications()

  // Check if server is running
  useEffect(() => {
    const checkServer = async () => {
      const available = await checkServerHealth()
      setServerAvailable(available)
      
      if (!available) {
        setError('Backend server not running. Using mock data.')
        console.warn('⚠️ Server not available. Start server with: cd server && npm run dev')
      }
    }
    
    // ✅ Only check once on mount - not every 10s!
    // WebSocket will handle connection status
    checkServer()
    
    // ✅ Removed: const interval = setInterval(checkServer, 10000)
    // This was causing 600 requests/min with 100 users!
  }, [])

  // Initial data fetch
  useEffect(() => {
    if (!serverAvailable) {
      setIsLoading(false)
      return
    }

    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        const initialData = await fetchGameData()
        setData(initialData)
        setError(null)
      } catch (err) {
        setError('Failed to load data from server')
        console.error('Failed to fetch initial data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [serverAvailable])

  // Auto-detect changes and trigger notifications
  const detectChangesAndNotify = useCallback((newData: AggregatedDataResponse) => {
    if (!previousDataRef.current) {
      previousDataRef.current = newData
      return
    }

    const prevData = previousDataRef.current
    
    // Check each game for changes
    newData.games.forEach(newGame => {
      const prevGame = prevData.games.find(g => g.gameId === newGame.gameId)
      
      if (prevGame) {
        // Check for player spikes (>50% increase)
        if (newGame.currentPlayers > prevGame.currentPlayers) {
          checkPlayerSpike(
            newGame.gameId,
            newGame.gameName,
            prevGame.currentPlayers,
            newGame.currentPlayers
          )
        }
        
        // Check for player drops (>30% decrease)
        if (newGame.currentPlayers < prevGame.currentPlayers) {
          checkPlayerDrop(
            newGame.gameId,
            newGame.gameName,
            prevGame.currentPlayers,
            newGame.currentPlayers
          )
        }
        
        // Check for milestones
        checkMilestone(
          newGame.gameId,
          newGame.gameName,
          newGame.currentPlayers
        )
      }
    })

    // Update previous data
    previousDataRef.current = newData
  }, [checkPlayerSpike, checkPlayerDrop, checkMilestone])

  // WebSocket connection for real-time updates with auto-reconnect
  useEffect(() => {
    if (!serverAvailable) return

    let reconnectAttempts = 0
    const maxReconnectAttempts = 5
    let reconnectTimeout: NodeJS.Timeout | null = null
    let shouldReconnect = true

    const connect = () => {
      const ws = createWebSocketConnection(
        (newData) => {
          // Detect changes and notify BEFORE setting data
          detectChangesAndNotify(newData)
          
          setData(newData)
          setIsConnected(true)
          setError(null)
        },
        (error) => {
          console.error('WebSocket error:', error)
          setIsConnected(false)
          setError('Real-time connection lost')
        }
      )

      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        reconnectAttempts = 0 // ✅ Reset on successful connection
        console.log('✅ Real-time updates active')
      }

      ws.onclose = () => {
        setIsConnected(false)
        console.log('❌ Real-time updates stopped')
        
        // ✅ Auto-reconnect with exponential backoff
        if (shouldReconnect && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * (2 ** reconnectAttempts), 30000)
          reconnectAttempts++
          
          console.log(`🔄 Reconnecting in ${delay/1000}s... (Attempt ${reconnectAttempts}/${maxReconnectAttempts})`)
          
          reconnectTimeout = setTimeout(() => {
            connect()
          }, delay)
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          setError('Connection lost. Please refresh the page.')
        }
      }

      return ws
    }

    connect()

    return () => {
      shouldReconnect = false
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
    }
  }, [serverAvailable, detectChangesAndNotify])

  // Manual refresh function
  const refresh = useCallback(async () => {
    if (!serverAvailable) return

    try {
      setIsLoading(true)
      const newData = await refreshData()
      setData(newData)
      setError(null)
    } catch (err) {
      setError('Failed to refresh data')
      console.error('Refresh failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [serverAvailable])

  return {
    data,
    isLoading,
    isConnected,
    error,
    serverAvailable,
    refresh
  }
}
