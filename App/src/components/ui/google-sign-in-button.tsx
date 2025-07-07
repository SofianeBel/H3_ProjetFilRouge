"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

interface GoogleSignInButtonProps {
  callbackUrl?: string
  className?: string
  children?: React.ReactNode
  variant?: 'default' | 'outline'
}

/**
 * Composant bouton de connexion Google avec NextAuth
 * Compatible avec le design moderne de l'application
 */
export function GoogleSignInButton({ 
  callbackUrl = '/', 
  className = '',
  children,
  variant = 'default'
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Gestion de la connexion Google
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      
      // Déclencher la connexion Google avec NextAuth
      await signIn('google', {
        callbackUrl,
        redirect: true, // Redirection automatique après connexion
      })
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error)
      setIsLoading(false)
    }
  }

  // Style selon la variante
  const baseStyles = "w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  
  const variantStyles = {
    default: "bg-white text-gray-900 hover:bg-gray-50 border border-gray-300 shadow-sm",
    outline: "bg-transparent text-white border border-[#292e38] hover:border-[#A67FFB] hover:bg-[#A67FFB]/10"
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      type="button"
    >
      {/* Icône Google */}
      {!isLoading ? (
        <svg 
          className="w-5 h-5" 
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="#4285F4" 
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path 
            fill="#34A853" 
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path 
            fill="#FBBC05" 
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path 
            fill="#EA4335" 
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ) : (
        <Loader2 className="w-5 h-5 animate-spin" />
      )}
      
      {/* Texte du bouton */}
      {children || (isLoading ? 'Connexion...' : 'Continuer avec Google')}
    </button>
  )
}

/**
 * Composant divider avec texte "OU" pour séparer les méthodes de connexion
 */
export function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#292e38]" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-[#1a1f2e] text-gray-400">OU</span>
      </div>
    </div>
  )
} 