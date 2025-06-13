'use client'

/**
 * Contexte d'authentification pour gérer l'état de l'utilisateur connecté
 * Ce contexte remplace NextAuth pour un contrôle plus granulaire
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// Types pour l'authentification
export interface User {
  id: string
  name: string | null
  email: string | null
  image?: string | null
  role: 'CLIENT' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  checkAuth: () => Promise<void>
}

export interface LoginResult {
  success: boolean
  error?: string
  user?: User
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provider du contexte d'authentification
 * Gère l'état global de l'utilisateur et les actions d'auth
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Vérifie si l'utilisateur est authentifié au chargement
  useEffect(() => {
    checkAuth()
  }, [])

  /**
   * Vérifie l'authentification en récupérant les infos utilisateur
   * Appelé au chargement et après certaines actions
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true)
      
      // Récupère les informations de l'utilisateur depuis l'API
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Pour inclure les cookies de session
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        // Si pas authentifié, on clear l'état
        setUser(null)
      }
    } catch (error) {
      console.error('Erreur lors de la vérification auth:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fonction de connexion
   * Envoie les credentials et récupère les données utilisateur
   */
  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/auth/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Si connexion réussie, on met à jour l'état
        setUser(data.user)
        return { success: true, user: data.user }
      } else {
        // Si échec, on retourne l'erreur
        return { 
          success: false, 
          error: data.error || 'Erreur de connexion' 
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      return { 
        success: false, 
        error: 'Erreur de connexion au serveur' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fonction de déconnexion
   * Clear le state et redirige vers la page de connexion
   */
  const logout = async () => {
    try {
      // Appel à l'API pour invalider la session côté serveur
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      // Dans tous les cas, on clear l'état local
      setUser(null)
      router.push('/auth/login')
    }
  }

  /**
   * Met à jour les données utilisateur localement
   * Utile après modification du profil
   */
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  // Valeurs exposées par le contexte
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook pour utiliser le contexte d'authentification
 * Vérifie que le hook est utilisé dans un Provider
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

  useEffect(() => {
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

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, isLoading, router])

  return { isAdmin: user?.role === 'ADMIN', isLoading }
} 