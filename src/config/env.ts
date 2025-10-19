/**
 * Environment Configuration
 * Centralized env variables management with validation
 */

interface Config {
  api: {
    url: string
    wsUrl: string
  }
  supabase: {
    url: string | undefined
    anonKey: string | undefined
  }
  isDev: boolean
  isProd: boolean
}

// Load and validate environment variables
const loadConfig = (): Config => {
  const config: Config = {
    api: {
      url: import.meta.env.VITE_API_URL || 'http://localhost:3001',
      wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
    },
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
    },
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD
  }

  // Validate critical env vars in production
  if (config.isProd) {
    if (!config.api.url) {
      console.error('❌ Missing VITE_API_URL in production')
    }
    if (!config.supabase.url || !config.supabase.anonKey) {
      console.warn('⚠️ Missing Supabase configuration - Auth features will be limited')
    }
  }

  return config
}

export const config = loadConfig()

// Helper to check if feature is available
export const isFeatureAvailable = (feature: 'auth' | 'api' | 'realtime'): boolean => {
  switch (feature) {
    case 'auth':
      return !!(config.supabase.url && config.supabase.anonKey)
    case 'api':
      return !!config.api.url
    case 'realtime':
      return !!config.api.wsUrl
    default:
      return false
  }
}
