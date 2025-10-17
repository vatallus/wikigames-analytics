import { useState, useEffect } from 'react'

const FAVORITES_KEY = 'wikigames_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse favorites:', e)
        setFavorites([])
      }
    }
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (gameId: string) => {
    setFavorites(prev => {
      if (prev.includes(gameId)) return prev
      return [...prev, gameId]
    })
  }

  const removeFavorite = (gameId: string) => {
    setFavorites(prev => prev.filter(id => id !== gameId))
  }

  const toggleFavorite = (gameId: string) => {
    if (favorites.includes(gameId)) {
      removeFavorite(gameId)
    } else {
      addFavorite(gameId)
    }
  }

  const isFavorite = (gameId: string) => {
    return favorites.includes(gameId)
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length
  }
}
