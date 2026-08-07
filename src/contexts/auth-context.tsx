import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase/client'

interface AuthContextValue {
  session: Session | null
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Só rastreia o estado da sessão por enquanto. As funções de signIn/signUp/
// signOut (incluindo a resolução username -> e-mail) entram na Fase 1,
// dentro de features/auth.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const syncSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!isMounted) return
        setSession(data.session)
      } catch (error) {
        console.warn('Não foi possível carregar a sessão do Supabase:', error)
        if (isMounted) setSession(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void syncSession()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return
      setSession(newSession)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider')
  }
  return context
}
