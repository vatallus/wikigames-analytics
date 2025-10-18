import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  favorite_games: string[]
  gaming_level: number
  total_playtime: number
  membership_tier: 'free' | 'bronze' | 'silver' | 'gold'
  discord_id: string | null
  twitch_id: string | null
  is_online: boolean
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<void>
  signOut: () => Promise<void>
  signInWith Provider: (provider: 'discord' | 'twitch') => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event)
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadProfile(session.user.id)
        // Update online status
        await supabase
          .from('profiles')
          .update({ is_online: true, last_seen: new Date().toISOString() })
          .eq('id', session.user.id)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Update online status on window close
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (user) {
        await supabase
          .from('profiles')
          .update({ is_online: false })
          .eq('id', user.id)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [user])

  async function loadProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error loading profile:', error)
      return
    }

    setProfile(data)
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  async function signUp(email: string, password: string, username: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    })

    if (error) throw error
  }

  async function signOut() {
    // Update online status before signing out
    if (user) {
      await supabase
        .from('profiles')
        .update({ is_online: false })
        .eq('id', user.id)
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async function signInWithProvider(provider: 'discord' | 'twitch') {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user) throw new Error('No user logged in')

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) throw error

    // Reload profile
    await loadProfile(user.id)
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
