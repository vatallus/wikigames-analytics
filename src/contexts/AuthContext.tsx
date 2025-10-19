import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { getEmailValidationError, normalizeEmail } from '@/utils/validation/email'
import { sanitizeEmail, sanitizeUsername } from '@/utils/security/sanitize'
import { MIN_PASSWORD_LENGTH } from '@/utils/constants'

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
  signInWithProvider: (provider: 'discord' | 'twitch') => Promise<void>
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
    // Sanitize and normalize email
    const cleanEmail = normalizeEmail(sanitizeEmail(email))
    
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })

    if (error) {
      // Provide user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid login credentials')
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('Please verify your email address')
      } else {
        throw new Error(error.message)
      }
    }
  }

  async function signUp(email: string, password: string, username: string) {
    // Sanitize inputs
    const cleanEmail = sanitizeEmail(email)
    const cleanUsername = sanitizeUsername(username)
    
    // Validate email format
    const emailError = getEmailValidationError(cleanEmail)
    if (emailError) {
      throw new Error(emailError)
    }

    // Validate password strength
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`)
    }
    
    // Validate username
    if (cleanUsername.length < 3) {
      throw new Error('Username must be at least 3 characters long')
    }

    const { error } = await supabase.auth.signUp({
      email: normalizeEmail(cleanEmail),
      password,
      options: {
        data: {
          username: cleanUsername,
        },
      },
    })

    if (error) {
      // Provide user-friendly error messages
      if (error.message.includes('already registered')) {
        throw new Error('This email is already registered')
      } else {
        throw new Error(error.message)
      }
    }
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
