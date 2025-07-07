"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider as AuthContextProvider } from "@/context/AuthContext"

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Provider d'authentification principal
 * Combine NextAuth SessionProvider avec notre contexte personnalisé
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </SessionProvider>
  )
} 