"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

/**
 * Composant de vérification d'email
 * Gère la vérification automatique du token
 */
function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token de vérification manquant')
      return
    }

    // Vérifier le token automatiquement
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok && data.verified) {
          setStatus('success')
          setMessage('Votre email a été vérifié avec succès !')
          
          // Redirection automatique vers la page de connexion après 3 secondes
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Erreur lors de la vérification')
        }
      } catch (error) {
        console.error('Erreur vérification:', error)
        setStatus('error')
        setMessage('Erreur de connexion au serveur')
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="w-full max-w-md">
      {/* Header avec logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <Logo className="transition-transform group-hover:scale-105" />
          <h1 className="text-3xl font-bold text-white">Cyna</h1>
        </Link>
        <p className="text-gray-400 mt-2">Vérification de votre email</p>
      </div>

      {/* Contenu principal */}
      <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border border-[#292e38] rounded-2xl p-8 shadow-2xl">
        
        {/* État de chargement */}
        {status === 'loading' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-[#A67FFB] animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Vérification en cours...
            </h2>
            <p className="text-gray-400">
              Nous vérifions votre email, veuillez patienter.
            </p>
          </div>
        )}

        {/* État de succès */}
        {status === 'success' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Email vérifié !
            </h2>
            <p className="text-gray-400">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              Redirection automatique vers la connexion dans 3 secondes...
            </p>
            
            {/* Bouton de connexion manuel */}
            <div className="pt-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#A67FFB] to-[#8B5CF6] hover:from-[#9333EA] hover:to-[#7C3AED] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                Se connecter maintenant
              </Link>
            </div>
          </div>
        )}

        {/* État d'erreur */}
        {status === 'error' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Erreur de vérification
            </h2>
            <p className="text-gray-400">
              {message}
            </p>
            
            {/* Actions possibles */}
            <div className="pt-4 space-y-3">
              <p className="text-sm text-gray-500">
                Que voulez-vous faire ?
              </p>
              
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 bg-[#1a1f2e] border border-[#292e38] hover:border-[#A67FFB] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Renvoyer un email de vérification
                </Link>
                
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-[#A67FFB] hover:text-[#9333EA] font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Lien retour accueil */}
        <div className="mt-6 text-center border-t border-[#292e38] pt-4">
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Page de vérification d'email avec Suspense
 */
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#1a1f2e] flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-[#A67FFB] animate-spin mx-auto" />
          <p className="text-gray-400 mt-2">Chargement...</p>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
} 