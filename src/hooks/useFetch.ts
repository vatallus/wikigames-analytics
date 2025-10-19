/**
 * useFetch Hook
 * Fetch data with caching and error handling
 */

import { useState, useEffect } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface FetchOptions extends RequestInit {
  cacheTime?: number // Cache duration in milliseconds
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()

export function useFetch<T = any>(url: string | null, options?: FetchOptions) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    if (!url) {
      setState({ data: null, loading: false, error: null })
      return
    }

    let cancelled = false
    const cacheTime = options?.cacheTime || 5 * 60 * 1000 // Default 5 minutes

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true }))

      try {
        // Check cache
        const cached = cache.get(url)
        if (cached && Date.now() - cached.timestamp < cacheTime) {
          if (!cancelled) {
            setState({ data: cached.data, loading: false, error: null })
          }
          return
        }

        // Fetch data
        const response = await fetch(url, options)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Cache the response
        cache.set(url, { data, timestamp: Date.now() })

        if (!cancelled) {
          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Unknown error')
          })
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [url, options?.cacheTime])

  return state
}

/**
 * Clear fetch cache
 */
export const clearFetchCache = (url?: string) => {
  if (url) {
    cache.delete(url)
  } else {
    cache.clear()
  }
}
