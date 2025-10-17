import { createClient } from '@supabase/supabase-js'

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

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
