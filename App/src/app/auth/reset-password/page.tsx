"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Lock, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

interface FormData {
  password: string
  confirmPassword: string
}

/**
 * Composant de réinitialisation de mot de passe avec gestion des paramètres de recherche
 */
function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'verifying' | 'invalid' | 'valid' | 'success'>('verifying')
  const [email, setEmail] = useState('')
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Vérifier la validité du token au chargement
  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      setError('Token de réinitialisation manquant')
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`)
        const data = await response.json()

        if (response.ok && data.valid) {
          setStatus('valid')
          setEmail(data.email)
        } else {
          setStatus('invalid')
          setError(data.error || 'Token invalide ou expiré')
        }
      } catch (error) {
        console.error('Erreur vérification token:', error)
        setStatus('invalid')
        setError('Erreur de connexion au serveur')
      }
    }

    verifyToken()
  }, [token])

  // Validation des mots de passe
  const validatePasswords = (password: string, confirmPassword: string) => {
    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    if (password !== confirmPassword && confirmPassword.length > 0) {
      return 'Les mots de passe ne correspondent pas'
    }
    
    return ''
  }

  // Gestion des changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Validation en temps réel
    const currentPassword = name === 'password' ? value : formData.password
    const currentConfirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword
    const validationError = validatePasswords(currentPassword, currentConfirmPassword)
    
    setError(validationError)
  }

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation finale
    const validationError = validatePasswords(formData.password, formData.confirmPassword)
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue')
        return
      }

      // Succès
      setStatus('success')
      
      // Redirection vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push('/auth/login?message=password-reset')
      }, 3000)

    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error)
      setError('Une erreur réseau est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header avec logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <Logo className="transition-transform group-hover:scale-105" />
          <h1 className="text-3xl font-bold text-white">Cyna</h1>
        </Link>
        <p className="text-gray-400 mt-2">Réinitialisation de mot de passe</p>
      </div>

      {/* Contenu principal */}
      <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border border-[#292e38] rounded-2xl p-8 shadow-2xl">
        
        {/* État de vérification */}
        {status === 'verifying' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-[#A67FFB] animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Vérification du lien...
            </h2>
            <p className="text-gray-400">
              Nous vérifions la validité de votre lien de réinitialisation.
            </p>
          </div>
        )}

        {/* État invalide */}
        {status === 'invalid' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Lien invalide ou expiré
            </h2>
            <p className="text-gray-400">
              {error}
            </p>
            
            {/* Actions possibles */}
            <div className="pt-4 space-y-3">
              <Link
                href="/auth/forgot-password"
                className="w-full bg-gradient-to-r from-[#A67FFB] to-[#8B5CF6] hover:from-[#9333EA] hover:to-[#7C3AED] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Demander un nouveau lien
              </Link>
              
              <Link
                href="/auth/login"
                className="w-full bg-transparent border border-[#292e38] hover:border-[#A67FFB] text-gray-300 hover:text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        )}

        {/* État valide - Formulaire de réinitialisation */}
        {status === 'valid' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                Nouveau mot de passe
              </h2>
              <p className="text-gray-400 text-sm">
                Définissez un nouveau mot de passe pour <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ nouveau mot de passe */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-[#111318] border border-[#292e38] rounded-lg text-white placeholder-gray-500 focus:border-[#A67FFB] focus:ring-1 focus:ring-[#A67FFB] transition-colors"
                    placeholder="Votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Champ confirmation mot de passe */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-[#111318] border border-[#292e38] rounded-lg text-white placeholder-gray-500 focus:border-[#A67FFB] focus:ring-1 focus:ring-[#A67FFB] transition-colors"
                    placeholder="Confirmez votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Bouton de réinitialisation */}
              <button
                type="submit"
                disabled={isLoading || !!error}
                className="w-full bg-gradient-to-r from-[#A67FFB] to-[#8B5CF6] hover:from-[#9333EA] hover:to-[#7C3AED] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Réinitialisation...
                  </>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </button>
            </form>
          </div>
        )}

        {/* État de succès */}
        {status === 'success' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Mot de passe réinitialisé !
            </h2>
            <p className="text-gray-400">
              Votre mot de passe a été mis à jour avec succès.
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
 * Page de réinitialisation de mot de passe avec Suspense
 */
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111318] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-[#A67FFB] animate-spin mx-auto" />
          <p className="text-gray-400 mt-2">Chargement...</p>
        </div>
      }>
        <ResetPasswordContent />
      </Suspense>
    </div>
  )
} 