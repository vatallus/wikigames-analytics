import { useState, useEffect, useCallback, useRef } from 'react'
import {
  fetchGameData,
  createWebSocketConnection,
  checkServerHealth,
  AggregatedDataResponse,
  refreshData
} from '@/services/apiService'

export function useRealTimeData() {
  const [data, setData] = useState<AggregatedDataResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serverAvailable, setServerAvailable] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

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
    
    checkServer()
    const interval = setInterval(checkServer, 10000) // Check every 10s
    
    return () => clearInterval(interval)
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

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!serverAvailable) return

    const ws = createWebSocketConnection(
      (newData) => {
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
      console.log('✅ Real-time updates active')
    }

    ws.onclose = () => {
      setIsConnected(false)
      console.log('❌ Real-time updates stopped')
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [serverAvailable])

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
