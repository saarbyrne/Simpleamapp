'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

export type UserRole = 'coach' | 'player' | 'guest' | 'admin'

export interface AuthUser extends User {
  role?: UserRole
  team_id?: string
  club_id?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role: UserRole) => Promise<void>
  signOut: () => Promise<void>
  skipLogin: () => void // TEMPORARY: Direct demo access - REMOVE BEFORE PRODUCTION
  isCoach: boolean
  isPlayer: boolean
  isGuest: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, team_id, club_id')
        .eq('id', authUser.id)
        .single()

      setUser({
        ...authUser,
        role: profile?.role || 'guest',
        team_id: profile?.team_id,
        club_id: profile?.club_id,
      })
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUser({ ...authUser, role: 'guest' })
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    
    if (data.user) {
      // Create user profile
      await supabase.from('user_profiles').insert({
        id: data.user.id,
        email,
        role,
        created_at: new Date().toISOString(),
      })
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // TEMPORARY: Direct demo access bypassing authentication - REMOVE BEFORE PRODUCTION
  const skipLogin = () => {
    const demoUser: AuthUser = {
      id: 'demo-coach-12345',
      email: 'demo@luvfutbol.com',
      role: 'coach',
      team_id: 'demo-team',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: 'authenticated',
      app_metadata: {},
      user_metadata: {}
    }
    
    setUser(demoUser)
    setLoading(false)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    skipLogin, // TEMPORARY: Remove before production
    isCoach: user?.role === 'coach',
    isPlayer: user?.role === 'player',
    isGuest: user?.role === 'guest',
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