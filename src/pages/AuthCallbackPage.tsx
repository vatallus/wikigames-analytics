import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle the OAuth callback
    supabase.auth.onAuthStateChange((event, _session) => {
      if (event === 'SIGNED_IN') {
        // Redirect to home page after successful sign in
        navigate('/')
      } else if (event === 'PASSWORD_RECOVERY') {
        // Handle password recovery
        navigate('/reset-password')
      }
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Verifying your account...</p>
      </div>
    </div>
  )
}
