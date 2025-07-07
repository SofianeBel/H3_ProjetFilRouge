'use client'

/**
 * Contexte d'authentification basé sur NextAuth
 * Wrapper autour de useSession pour une API cohérente
 */

import React, { createContext, useContext, ReactNode } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Types pour l'authentification
export interface User {
  id: string
  name: string | null
  email: string | null
  image?: string | null
  role: 'CLIENT' | 'ADMIN'
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
}

// Création du contexte d'authentification
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provider du contexte d'authentification
 * Utilise NextAuth useSession en interne
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  /**
   * Fonction de déconnexion avec NextAuth
   */
  const logout = async () => {
    try {
      await signOut({ 
        callbackUrl: '/auth/login',
        redirect: true 
      })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Fallback: redirection manuelle
      router.push('/auth/login')
    }
  }

  // Mapper les données de session NextAuth vers notre format
  const user: User | null = session?.user ? {
    id: (session.user as any).id as string,
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null,
    role: ((session.user as any).role as 'CLIENT' | 'ADMIN') || 'CLIENT'
  } : null

  const value: AuthContextType = {
    user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook pour utiliser le contexte d'authentification
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  
  return context
}

/**
 * Hook pour protéger les pages qui nécessitent une authentification
 * Redirige vers login si pas connecté
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}

/**
 * Hook pour protéger les pages admin
 * Redirige si pas admin
 */
export function useRequireAdmin() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, isLoading, router])

  return { isAdmin: user?.role === 'ADMIN', isLoading }
} 