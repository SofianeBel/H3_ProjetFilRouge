"use client"

import { SessionProvider } from "next-auth/react"

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Provider NextAuth pour gérer les sessions utilisateur
 * Wrapper autour de SessionProvider pour l'authentification globale
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
} 