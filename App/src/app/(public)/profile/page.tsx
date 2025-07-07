'use client'

import React, { useState, useEffect } from 'react'
import { User, Shield, Eye, AlertTriangle, Download, Trash2, Save, Key } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { signOut } from 'next-auth/react'

/**
 * Interface pour les données utilisateur
 */
interface UserProfile {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  createdAt: string
  consentRecords: Array<{
    id: string
    consentType: string
    purpose: string
    granted: boolean
    grantedAt: Date | null
    revokedAt: Date | null
  }>
  _count: {
    blogPosts: number
    orders: number
    exportRequests: number
  }
}

/**
 * Types de consentements disponibles
 */
const CONSENT_TYPES = [
  {
    type: 'marketing',
    title: 'Marketing et communications',
    description: 'Recevoir des emails marketing, newsletters et offres promotionnelles.'
  },
  {
    type: 'analytics',
    title: 'Analyses et statistiques',
    description: 'Permettre l\'analyse de votre utilisation du site pour améliorer nos services.'
  },
  {
    type: 'cookies',
    title: 'Cookies non essentiels',
    description: 'Autoriser les cookies de performance, fonctionnalité et marketing.'
  },
  {
    type: 'newsletter',
    title: 'Newsletter technique',
    description: 'Recevoir notre newsletter avec les dernières actualités cybersécurité.'
  }
]

/**
 * Page profil utilisateur RGPD-compliant
 */
export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  
  // États pour les formulaires
  const [personalForm, setPersonalForm] = useState({
    name: '',
    email: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [consents, setConsents] = useState<Record<string, boolean>>({})
  
  // États pour les actions
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [messages, setMessages] = useState<{type: 'success' | 'error', text: string} | null>(null)

  /**
   * Chargement des données profil
   */
  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      const data = await response.json()

      if (data.success) {
        setProfile(data.data)
        setPersonalForm({
          name: data.data.name || '',
          email: data.data.email || ''
        })
        
        // Initialiser les consentements
        const currentConsents: Record<string, boolean> = {}
        CONSENT_TYPES.forEach(type => {
          const consent = data.data.consentRecords.find((c: any) => c.consentType === type.type)
          currentConsents[type.type] = consent?.granted || false
        })
        setConsents(currentConsents)
      } else {
        showMessage('error', 'Impossible de charger le profil')
      }
    } catch (error) {
      showMessage('error', 'Erreur réseau')
    } finally {
      setIsLoadingProfile(false)
    }
  }

  /**
   * Affichage des messages
   */
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessages({ type, text })
    setTimeout(() => setMessages(null), 5000)
  }

  /**
   * Mise à jour des informations personnelles
   */
  const handlePersonalUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: personalForm.name,
          email: personalForm.email
        })
      })

      const data = await response.json()

      if (data.success) {
        showMessage('success', 'Informations mises à jour avec succès')
        if (data.requiresEmailVerification) {
          showMessage('success', 'Un email de vérification a été envoyé')
        }
        loadProfile()
      } else {
        showMessage('error', data.message)
      }
    } catch (error) {
      showMessage('error', 'Erreur lors de la mise à jour')
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Changement de mot de passe
   */
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'Les mots de passe ne correspondent pas')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        showMessage('success', 'Mot de passe mis à jour avec succès')
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
        
        if (data.requiresReauth) {
          setTimeout(() => {
            signOut({ callbackUrl: '/auth/login' })
          }, 2000)
        }
      } else {
        showMessage('error', data.message)
      }
    } catch (error) {
      showMessage('error', 'Erreur lors de la mise à jour')
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Mise à jour des consentements
   */
  const handleConsentsUpdate = async () => {
    setIsSaving(true)

    try {
      const consentsArray = CONSENT_TYPES.map(type => ({
        consentType: type.type,
        purpose: type.description,
        granted: consents[type.type] || false
      }))

      const response = await fetch('/api/profile/consents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consents: consentsArray })
      })

      const data = await response.json()

      if (data.success) {
        showMessage('success', 'Consentements mis à jour avec succès')
        loadProfile()
      } else {
        showMessage('error', data.message)
      }
    } catch (error) {
      showMessage('error', 'Erreur lors de la mise à jour')
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Export des données
   */
  const handleDataExport = async () => {
    setIsExporting(true)

    try {
      const response = await fetch('/api/profile/export', {
        method: 'POST'
      })

      if (response.ok) {
        // Téléchargement du fichier
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `donnees-personnelles-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        showMessage('success', 'Export réussi ! Le fichier a été téléchargé.')
      } else {
        const data = await response.json()
        showMessage('error', data.message || 'Erreur lors de l\'export')
      }
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'export')
    } finally {
      setIsExporting(false)
    }
  }

  /**
   * Suppression du compte
   */
  const handleAccountDelete = async () => {
    if (deleteConfirmation !== 'SUPPRIMER') {
      showMessage('error', 'Veuillez taper "SUPPRIMER" pour confirmer')
      return
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        showMessage('success', data.message)
        setTimeout(() => {
          signOut({ callbackUrl: '/' })
        }, 3000)
      } else {
        showMessage('error', data.message)
      }
    } catch (error) {
      showMessage('error', 'Erreur lors de la suppression')
    }

    setShowDeleteModal(false)
    setDeleteConfirmation('')
  }

  // Redirection si non connecté
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6B8DE5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    window.location.href = '/auth/login'
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-cyna">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mon profil
            </h1>
            <p className="text-gray-600">
              Gérez vos informations personnelles, vos préférences de confidentialité et la sécurité de votre compte.
            </p>
          </div>

          {/* Messages */}
          {messages && (
            <div className={`mb-6 p-4 rounded-lg ${
              messages.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {messages.text}
            </div>
          )}

          {/* Navigation par onglets */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'personal', label: 'Informations personnelles', icon: User },
                  { id: 'security', label: 'Sécurité', icon: Shield },
                  { id: 'privacy', label: 'Confidentialité', icon: Eye },
                  { id: 'danger', label: 'Zone de danger', icon: AlertTriangle }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-[#6B8DE5] text-[#6B8DE5]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Onglet Informations personnelles */}
              {activeTab === 'personal' && (
                <form onSubmit={handlePersonalUpdate} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Informations personnelles
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          value={personalForm.name}
                          onChange={(e) => setPersonalForm({...personalForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8DE5] focus:border-transparent"
                          placeholder="Votre nom complet"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse email
                        </label>
                        <input
                          type="email"
                          value={personalForm.email}
                          onChange={(e) => setPersonalForm({...personalForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8DE5] focus:border-transparent"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    {profile && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Statistiques du compte</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Commandes :</span>
                            <span className="ml-2 font-medium">{profile._count.orders}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Articles :</span>
                            <span className="ml-2 font-medium">{profile._count.blogPosts}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Exports :</span>
                            <span className="ml-2 font-medium">{profile._count.exportRequests}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#6B8DE5] text-white rounded-md hover:bg-[#5A7BD4] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
                  </button>
                </form>
              )}

              {/* Onglet Sécurité */}
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Changer le mot de passe
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          value={passwordForm.oldPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8DE5] focus:border-transparent"
                          placeholder="Mot de passe actuel"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8DE5] focus:border-transparent"
                          placeholder="Nouveau mot de passe (min. 6 caractères)"
                          minLength={6}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmer le nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8DE5] focus:border-transparent"
                          placeholder="Confirmer le nouveau mot de passe"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#6B8DE5] text-white rounded-md hover:bg-[#5A7BD4] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Key className="h-4 w-4" />
                    <span>{isSaving ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}</span>
                  </button>
                </form>
              )}

              {/* Onglet Confidentialité */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Gestion des consentements RGPD
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Vous pouvez retirer votre consentement à tout moment. Cela n'affectera pas la licéité du traitement fondé sur le consentement avant sa révocation.
                    </p>
                    
                    <div className="space-y-4">
                      {CONSENT_TYPES.map((consentType) => (
                        <div key={consentType.type} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                          <input
                            type="checkbox"
                            id={consentType.type}
                            checked={consents[consentType.type] || false}
                            onChange={(e) => setConsents({...consents, [consentType.type]: e.target.checked})}
                            className="mt-1 h-4 w-4 text-[#6B8DE5] focus:ring-[#6B8DE5] border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <label htmlFor={consentType.type} className="block text-sm font-medium text-gray-900 cursor-pointer">
                              {consentType.title}
                            </label>
                            <p className="text-sm text-gray-600 mt-1">
                              {consentType.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleConsentsUpdate}
                      disabled={isSaving}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#6B8DE5] text-white rounded-md hover:bg-[#5A7BD4] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isSaving ? 'Enregistrement...' : 'Enregistrer les préférences'}</span>
                    </button>

                    <button
                      onClick={handleDataExport}
                      disabled={isExporting}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="h-4 w-4" />
                      <span>{isExporting ? 'Export en cours...' : 'Exporter mes données'}</span>
                    </button>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Vos droits RGPD</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Droit d'accès :</strong> Vous pouvez demander une copie de vos données personnelles</li>
                      <li>• <strong>Droit de rectification :</strong> Vous pouvez corriger vos données inexactes</li>
                      <li>• <strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données</li>
                      <li>• <strong>Droit à la portabilité :</strong> Vous pouvez récupérer vos données dans un format lisible</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Onglet Zone de danger */}
              {activeTab === 'danger' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-red-900 mb-4">
                      Zone de danger
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Les actions suivantes sont irréversibles. Assurez-vous de bien comprendre les conséquences avant de continuer.
                    </p>
                    
                    <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                      <h4 className="font-medium text-red-900 mb-2">
                        Supprimer mon compte
                      </h4>
                      <p className="text-sm text-red-700 mb-4">
                        Cette action supprimera définitivement votre compte et toutes les données associées. 
                        Vos données seront marquées pour suppression immédiatement et seront définitivement effacées dans 30 jours.
                      </p>
                      
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Supprimer mon compte</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirmer la suppression
              </h3>
              <p className="text-sm text-gray-600">
                Cette action est irréversible. Toutes vos données seront définitivement supprimées dans 30 jours.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tapez "SUPPRIMER" pour confirmer :
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="SUPPRIMER"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAccountDelete}
                disabled={deleteConfirmation !== 'SUPPRIMER'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 