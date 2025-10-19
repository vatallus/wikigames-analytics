import { createClient } from '@supabase/supabase-js'

// Get Supabase URL and anon key from environment variables
// Trim to remove any whitespace/newlines that might cause WebSocket errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

// Fallback values for development/demo mode
const FALLBACK_URL = 'https://demo.supabase.co'
const FALLBACK_KEY = 'demo-anon-key'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables. Using fallback values.')
  console.warn('Auth features will be disabled. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable.')
}

// Create Supabase client with fallback
export const supabase = createClient(
  supabaseUrl || FALLBACK_URL,
  supabaseAnonKey || FALLBACK_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Export flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Database types (will be auto-generated when you set up your schema)
export type Database = {
  public: {
    Tables: {
      games: {
        Row: {
          id: string
          name: string
          current_players: number
          peak_players: number
          type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          current_players?: number
          peak_players?: number
          type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          current_players?: number
          peak_players?: number
          type?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Add more tables as needed
    }
  }
}
