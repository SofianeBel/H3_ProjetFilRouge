/**
 * Page de détails d'un utilisateur pour l'administration
 * Affiche toutes les informations détaillées d'un utilisateur spécifique
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { 
  User, 
  ArrowLeft, 
  Mail, 
  Shield, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Edit3,
  Save,
  X,
  Activity,
  FileText,
  Settings,
  Download
} from 'lucide-react'

/**
 * Interface pour les données détaillées de l'utilisateur
 */
interface UserDetail {
  id: string
  name: string | null
  email: string
  role: 'CLIENT' | 'ADMIN' | 'SUPER_ADMIN'
  emailVerified: Date | null
  image: string | null
  createdAt: string
  updatedAt: string
  _count: {
    blogPosts: number
    consentRecords: number
    exportRequests: number
    authLogs: number
  }
}

export default function AdminUserDetailPage() {
  // Hooks de navigation
  const params = useParams()
  const router = useRouter()
  const userId = params?.id as string

  // États pour les données utilisateur
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // États pour l'édition
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    role: ''
  })
  const [saving, setSaving] = useState(false)

  /**
   * Chargement des détails de l'utilisateur
   */
  const loadUserDetails = async () => {
    if (!userId) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.data)
        setEditForm({ role: data.data.role })
      } else {
        setError(data.message || 'Erreur lors du chargement')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error('Erreur lors du chargement des détails:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sauvegarde des modifications
   */
  const saveChanges = async () => {
    if (!user) return

    setSaving(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Je mets à jour les données locales
        setUser(prev => prev ? { ...prev, role: editForm.role as UserDetail['role'], updatedAt: new Date().toISOString() } : null)
        setIsEditing(false)
      } else {
        setError(data.message || 'Erreur lors de la sauvegarde')
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde')
      console.error('Erreur:', err)
    } finally {
      setSaving(false)
    }
  }

  /**
   * Formatage des dates
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Badge de rôle avec couleurs
   */
  const RoleBadge = ({ role }: { role: string }) => {
    const configs = {
      CLIENT: { color: 'bg-gray-500/20 text-gray-400 border-gray-500', label: 'Client', icon: User },
      ADMIN: { color: 'bg-blue-500/20 text-blue-400 border-blue-500', label: 'Administrateur', icon: Shield },
      SUPER_ADMIN: { color: 'bg-purple-500/20 text-purple-400 border-purple-500', label: 'Super Admin', icon: Settings }
    }

    const config = configs[role as keyof typeof configs]
    const IconComponent = config.icon

    return (
      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${config.color}`}>
        <IconComponent className="mr-2 h-4 w-4" />
        {config.label}
      </span>
    )
  }

  /**
   * Statistique avec icône
   */
  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    color = 'text-blue-600' 
  }: { 
    icon: any, 
    label: string, 
    value: number | string, 
    color?: string 
  }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center">
        <Icon className={`h-8 w-8 ${color}`} />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )

  // Chargement initial
  useEffect(() => {
    loadUserDetails()
  }, [userId])

  // Gestion du chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    )
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">Erreur</h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link
            href="/admin/users"
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Link>
        </div>
      </div>
    )
  }

  // Utilisateur non trouvé
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">Utilisateur introuvable</h1>
          <p className="mt-2 text-gray-600">L'utilisateur demandé n'existe pas.</p>
          <Link
            href="/admin/users"
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-blue-600">
                Cyna
              </Link>
              <span className="ml-2 text-gray-500">/ Administration / 
                <Link href="/admin/users" className="text-blue-600 hover:text-blue-800"> Utilisateurs</Link> /
                Détails
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/users"
                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Link>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Modifier
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setEditForm({ role: user.role })
                      setError('')
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Profil utilisateur */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-8">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'Avatar'}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>

              {/* Informations principales */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.name || 'Nom non défini'}
                    </h1>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Mail className="mr-2 h-4 w-4" />
                      {user.email}
                                             {user.emailVerified && (
                         <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                       )}
                    </p>
                  </div>
                  
                  <div className="text-right">
                                         {isEditing ? (
                       <select
                         value={editForm.role}
                         onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                         className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                         aria-label="Modifier le rôle de l'utilisateur"
                       >
                        <option value="CLIENT">Client</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    ) : (
                      <RoleBadge role={user.role} />
                    )}
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Créé le {formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Activity className="mr-2 h-4 w-4" />
                    <span>Modifié le {formatDate(user.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques de l'utilisateur */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FileText}
            label="Articles de blog"
            value={user._count.blogPosts}
            color="text-green-600"
          />
          <StatCard
            icon={Shield}
            label="Consentements"
            value={user._count.consentRecords}
            color="text-blue-600"
          />
          <StatCard
            icon={Download}
            label="Exports de données"
            value={user._count.exportRequests}
            color="text-purple-600"
          />
          <StatCard
            icon={Activity}
            label="Logs de connexion"
            value={user._count.authLogs}
            color="text-orange-600"
          />
        </div>

        {/* Section informations détaillées */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Informations détaillées</h2>
          </div>
          
          <div className="px-6 py-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">ID Utilisateur</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{user.id}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Nom d'affichage</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.name || 'Non défini'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Adresse email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Email vérifié</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Oui, le {formatDate(user.emailVerified.toString())}
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-600">
                      <XCircle className="mr-1 h-4 w-4" />
                      Non vérifié
                    </span>
                  )}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(user.createdAt)}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Dernière modification</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(user.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  )
} 