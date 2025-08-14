"use client"

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { GoogleSignInButton, AuthDivider } from '@/components/ui/google-sign-in-button'

interface FormData {
  email: string
  password: string
  otp?: string
}

/**
 * Composant de connexion avec gestion des paramètres de recherche
 */
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [otpRequired, setOtpRequired] = useState(false)

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
      // Pré‑check : l'email est‑il vérifié ?
      try {
        await fetch(`/api/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        })
        // L'API renvoie un message neutre; on continue sans en tenir compte
      } catch {}

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        otp: formData.otp,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === '2FA_REQUIRED') {
          setOtpRequired(true)
          setError('Veuillez entrer votre code 2FA.')
        } else {
          setError('Vérifiez votre email (ou identifiants incorrects).')
        }
      } else {
        // Redirection vers la page demandée ou l'accueil
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      setError('Une erreur est survenue lors de la connexion')
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
        <p className="text-gray-400 mt-2">Connectez-vous à votre compte</p>
      </div>

      {/* Formulaire de connexion */}
      <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border border-[#292e38] rounded-2xl p-8 shadow-2xl">
        
        {/* Bouton Google Sign-In */}
        <div className="mb-6">
          <GoogleSignInButton 
            callbackUrl={callbackUrl}
            variant="default"
          />
        </div>

        {/* Divider OU */}
        <AuthDivider />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email
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

          {/* Champ mot de passe */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              Mot de passe
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
                placeholder="Votre mot de passe"
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

          {/* Champ OTP si requis */}
          {otpRequired && (
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-gray-300">
                Code 2FA (OTP)
              </label>
              <div className="relative">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={formData.otp || ''}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-3 bg-[#111318] border border-[#292e38] rounded-lg text-white placeholder-gray-500 focus:border-[#A67FFB] focus:ring-1 focus:ring-[#A67FFB] transition-colors"
                  placeholder="123456"
                />
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#A67FFB] to-[#8B5CF6] hover:from-[#9333EA] hover:to-[#7C3AED] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Lien vers l'inscription */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Pas encore de compte ?{' '}
            <Link 
              href="/auth/register" 
              className="text-[#A67FFB] hover:text-[#9333EA] font-medium transition-colors"
            >
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Lien mot de passe oublié */}
        <div className="mt-3 text-center">
          <Link 
            href="/auth/forgot-password" 
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Lien retour accueil */}
        <div className="mt-4 text-center">
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
 * Page de connexion avec NextAuth
 * Permet aux utilisateurs de se connecter avec email/mot de passe ou Google
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111318] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3">
              <Logo />
              <h1 className="text-3xl font-bold text-white">Cyna</h1>
            </div>
            <p className="text-gray-400 mt-2">Chargement...</p>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
} 