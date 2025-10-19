import { useState, useEffect, useCallback, useRef } from 'react'
import { AggregatedDataResponse } from '@/services/apiService'
import { fetchAggregatedData, subscribeToGames } from '@/services/supabaseDataService'
import { useNotifications } from './useNotifications'

export function useRealTimeData() {
  const [data, setData] = useState<AggregatedDataResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [serverAvailable] = useState(true) // Supabase is always available
  const previousDataRef = useRef<AggregatedDataResponse | null>(null)
  
  // Get notification helpers
  const { checkPlayerSpike, checkPlayerDrop, checkMilestone } = useNotifications()

  // Initial data fetch from Supabase
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        const initialData = await fetchAggregatedData()
        setData(initialData)
        setError(null)
        console.log('✅ Data loaded from Supabase')
      } catch (err) {
        setError('Failed to load data from Supabase')
        console.error('Failed to fetch initial data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

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

  // Supabase real-time subscription for game updates
  useEffect(() => {
    const unsubscribe = subscribeToGames(async () => {
      try {
        // Fetch fresh data when changes detected
        const newData = await fetchAggregatedData()
        
        // Detect changes and notify BEFORE setting data
        detectChangesAndNotify(newData)
        
        setData(newData)
        setIsConnected(true)
        setError(null)
        console.log('🔄 Data updated from Supabase realtime')
      } catch (err) {
        console.error('Failed to fetch updated data:', err)
        setError('Failed to update data')
      }
    })

    console.log('✅ Supabase realtime subscription active')

    return () => {
      unsubscribe()
    }
  }, [detectChangesAndNotify])

  // Manual refresh function
  const refresh = useCallback(async () => {
    try {
      setIsLoading(true)
      const newData = await fetchAggregatedData()
      setData(newData)
      setError(null)
      console.log('✅ Data refreshed from Supabase')
    } catch (err) {
      setError('Failed to refresh data')
      console.error('Refresh failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    data,
    isLoading,
    isConnected,
    error,
    serverAvailable,
    refresh
  }
}
