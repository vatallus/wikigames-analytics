/**
 * Global Constants
 */

// API URLs
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'

// Supabase
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// App Info
export const APP_NAME = 'WikiGames'
export const APP_DESCRIPTION = 'Real-time Gaming Analytics & Player Statistics'
export const APP_URL = 'https://www.wikigames.org'

// Social Media
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/wikigames',
  discord: 'https://discord.gg/wikigames',
  github: 'https://github.com/wikigames'
}

// Pagination
export const ITEMS_PER_PAGE = 20
export const MAX_PAGE_SIZE = 100

// Cache Duration (milliseconds)
export const CACHE_DURATION = {
  SHORT: 1 * 60 * 1000,      // 1 minute
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 30 * 60 * 1000,      // 30 minutes
  DAY: 24 * 60 * 60 * 1000   // 24 hours
}

// Debounce Delays (milliseconds)
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 250
}

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Validation
export const MIN_PASSWORD_LENGTH = 6
export const MAX_PASSWORD_LENGTH = 128
export const MIN_USERNAME_LENGTH = 3
export const MAX_USERNAME_LENGTH = 50

// Transaction Amounts
export const MIN_DONATION_AMOUNT = 1
export const MAX_DONATION_AMOUNT = 100000

// WebSocket
export const WS_RECONNECT_INTERVAL = 3000 // 3 seconds
export const WS_MAX_RECONNECT_ATTEMPTS = 10

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'wikigames_theme',
  FAVORITES: 'wikigames_favorites',
  RECENT_SEARCHES: 'wikigames_recent_searches',
  USER_PREFERENCES: 'wikigames_preferences'
}

// Feature Flags
export const FEATURES = {
  CHAT_ENABLED: true,
  DONATIONS_ENABLED: true,
  TOURNAMENTS_ENABLED: true,
  LEADERBOARDS_ENABLED: true
}
