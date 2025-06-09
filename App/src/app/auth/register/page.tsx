"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { GoogleSignInButton, AuthDivider } from '@/components/ui/google-sign-in-button'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

/**
 * Page d'inscription pour créer un nouveau compte
 * Validation côté client et serveur avec feedback visuel
 */
export default function RegisterPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Validation des mots de passe
  const validatePasswords = (password: string, confirmPassword: string) => {
    const newErrors: FormErrors = {}
    
    if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    if (password !== confirmPassword && confirmPassword.length > 0) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }
    
    return newErrors
  }

  // Gestion des changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Validation en temps réel pour les mots de passe
    if (name === 'password' || name === 'confirmPassword') {
      const currentPassword = name === 'password' ? value : formData.password
      const currentConfirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword
      const passwordErrors = validatePasswords(currentPassword, currentConfirmPassword)
      
      setErrors(prev => ({
        ...prev,
        password: passwordErrors.password,
        confirmPassword: passwordErrors.confirmPassword,
        general: undefined
      }))
    } else {
      // Effacer l'erreur pour les autres champs
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
        general: undefined
      }))
    }
  }

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validation finale
    const passwordErrors = validatePasswords(formData.password, formData.confirmPassword)
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: 'Un compte avec cet email existe déjà' })
        } else if (data.details) {
          // Erreurs de validation Zod
          const fieldErrors: FormErrors = {}
          data.details.forEach((error: { path: (string | number)[]; message: string }) => {
            fieldErrors[error.path[0] as keyof FormErrors] = error.message
          })
          setErrors(fieldErrors)
        } else {
          setErrors({ general: data.error || 'Une erreur est survenue' })
        }
        return
      }

      // Succès
      setSuccess(true)
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/auth/login?message=account-created')
      }, 2000)

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      setErrors({ general: 'Une erreur réseau est survenue' })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#111318] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border border-[#292e38] rounded-2xl p-8 shadow-2xl">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Compte créé !</h2>
            <p className="text-gray-400 mb-4">
              Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion.
            </p>
            <div className="flex items-center justify-center gap-2 text-[#A67FFB]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Redirection en cours...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111318] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header avec logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Logo className="transition-transform group-hover:scale-105" />
            <h1 className="text-3xl font-bold text-white">Cyna</h1>
          </Link>
          <p className="text-gray-400 mt-2">Créez votre compte</p>
        </div>

        {/* Formulaire d'inscription */}
        <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border border-[#292e38] rounded-2xl p-8 shadow-2xl">
          
          {/* Bouton Google Sign-In */}
          <div className="mb-6">
            <GoogleSignInButton 
              callbackUrl="/"
              variant="default"
            />
          </div>

          {/* Divider OU */}
          <AuthDivider />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ nom */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-[#111318] border rounded-lg text-white placeholder-gray-500 focus:ring-1 transition-colors ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-[#292e38] focus:border-[#A67FFB] focus:ring-[#A67FFB]'
                  }`}
                  placeholder="Jean Dupont"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

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
                  className={`w-full pl-10 pr-4 py-3 bg-[#111318] border rounded-lg text-white placeholder-gray-500 focus:ring-1 transition-colors ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-[#292e38] focus:border-[#A67FFB] focus:ring-[#A67FFB]'
                  }`}
                  placeholder="jean.dupont@exemple.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
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
                  className={`w-full pl-10 pr-12 py-3 bg-[#111318] border rounded-lg text-white placeholder-gray-500 focus:ring-1 transition-colors ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-[#292e38] focus:border-[#A67FFB] focus:ring-[#A67FFB]'
                  }`}
                  placeholder="Au moins 6 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
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
                  className={`w-full pl-10 pr-12 py-3 bg-[#111318] border rounded-lg text-white placeholder-gray-500 focus:ring-1 transition-colors ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-[#292e38] focus:border-[#A67FFB] focus:ring-[#A67FFB]'
                  }`}
                  placeholder="Répétez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Message d'erreur général */}
            {errors.general && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-sm text-red-400">{errors.general}</p>
              </div>
            )}

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#A67FFB] to-[#8B5CF6] hover:from-[#9333EA] hover:to-[#7C3AED] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Création du compte...
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          {/* Lien vers la connexion */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Déjà un compte ?{' '}
              <Link 
                href="/auth/login" 
                className="text-[#A67FFB] hover:text-[#9333EA] font-medium transition-colors"
              >
                Se connecter
              </Link>
            </p>
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
    </div>
  )
} 