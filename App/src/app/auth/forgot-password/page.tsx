"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Mail, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

interface FormData {
  email: string
}

/**
 * Page de demande de réinitialisation de mot de passe
 * Permet à l'utilisateur de saisir son email pour recevoir un lien de réinitialisation
 */
export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState<FormData>({
    email: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Gestion des changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('')
  }

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue')
        return
      }

      // Succès - afficher l'écran de confirmation
      setSuccess(true)

    } catch (error) {
      console.error('Erreur lors de la demande:', error)
      setError('Une erreur réseau est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  // Écran de succès après envoi
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#111318] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header avec logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Logo className="transition-transform group-hover:scale-105" />
              <h1 className="text-3xl font-bold text-white">Cyna</h1>
            </Link>
            <p className="text-gray-400 mt-2">Réinitialisation de mot de passe</p>
          </div>

          {/* Contenu de succès */}
          <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border border-[#292e38] rounded-2xl p-8 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white">
                Email envoyé !
              </h2>
              
              <p className="text-gray-400 leading-relaxed">
                Si votre adresse email est enregistrée dans notre système, 
                vous recevrez un lien de réinitialisation dans quelques minutes.
              </p>
              
              <div className="bg-[#1e293b]/50 border border-[#334155] rounded-lg p-4 mt-6">
                <p className="text-sm text-gray-300">
                  <strong>Vérifiez votre boîte email</strong> (y compris les spams)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Le lien expire dans 1 heure pour votre sécurité
                </p>
              </div>

              {/* Actions */}
              <div className="pt-6 space-y-3">
                <Link
                  href="/auth/login"
                  className="w-full bg-gradient-to-r from-[#A67FFB] to-[#8B5CF6] hover:from-[#9333EA] hover:to-[#7C3AED] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Retour à la connexion
                </Link>
                
                <button
                  onClick={() => {
                    setSuccess(false)
                    setFormData({ email: '' })
                  }}
                  className="w-full bg-transparent border border-[#292e38] hover:border-[#A67FFB] text-gray-300 hover:text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Renvoyer un email
                </button>
              </div>
            </div>

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
      </div>
    )
  }

  // Formulaire principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111318] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header avec logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Logo className="transition-transform group-hover:scale-105" />
            <h1 className="text-3xl font-bold text-white">Cyna</h1>
          </Link>
          <p className="text-gray-400 mt-2">Mot de passe oublié ?</p>
        </div>

        {/* Formulaire de demande */}
        <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border border-[#292e38] rounded-2xl p-8 shadow-2xl">
          
          {/* Instructions */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              Réinitialiser votre mot de passe
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Saisissez votre adresse email et nous vous enverrons un lien 
              pour réinitialiser votre mot de passe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#111318] border border-[#292e38] rounded-lg text-white placeholder-gray-500 focus:border-[#A67FFB] focus:ring-1 focus:ring-[#A67FFB] transition-colors"
                  placeholder="votre.email@exemple.com"
                />
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Bouton d'envoi */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#A67FFB] to-[#8B5CF6] hover:from-[#9333EA] hover:to-[#7C3AED] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </button>
          </form>

          {/* Liens de navigation */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <Link 
                href="/auth/login" 
                className="inline-flex items-center gap-2 text-[#A67FFB] hover:text-[#9333EA] font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Link>
            </div>
            
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Pas encore de compte ?{' '}
                <Link 
                  href="/auth/register" 
                  className="text-[#A67FFB] hover:text-[#9333EA] font-medium transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>

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
    </div>
  )
} 