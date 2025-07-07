/**
 * Page d'administration pour la gestion des utilisateurs
 * Permet de visualiser, modifier et gérer les comptes utilisateurs
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Search, Filter, UserCheck, UserX, Shield, Users } from 'lucide-react'

/**
 * Interface pour les données utilisateur
 */
interface AdminUser {
  id: string
  name: string | null
  email: string
  role: 'CLIENT' | 'ADMIN' | 'SUPER_ADMIN'
  active: boolean
  emailVerified: Date | null
  createdAt: string
  updatedAt: string
  _count: {
    orders: number
  }
}

/**
 * Interface pour les filtres de recherche
 */
interface UserFilters {
  search: string
  role: string
  active: string
  page: number
}

export default function AdminUsersPage() {
  // États pour la gestion des utilisateurs
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // États pour les filtres et pagination
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    active: '',
    page: 1
  })
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  
  // État pour les actions en cours
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  /**
   * Chargement des utilisateurs avec filtres
   */
  const loadUsers = async () => {
    setLoading(true)
    setError('')
    
    try {
      const searchParams = new URLSearchParams()
      searchParams.append('page', filters.page.toString())
      searchParams.append('limit', '10')
      
      if (filters.search) searchParams.append('search', filters.search)
      if (filters.role) searchParams.append('role', filters.role)
      if (filters.active) searchParams.append('active', filters.active)
      
      const response = await fetch(`/api/admin/users?${searchParams}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        setUsers(data.data.users)
        setPagination(data.data.pagination)
      } else {
        setError(data.message || 'Erreur lors du chargement')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error('Erreur lors du chargement des utilisateurs:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Mise à jour du rôle d'un utilisateur
   */
  const updateUserRole = async (userId: string, newRole: string) => {
    setProcessingIds(prev => new Set(prev).add(userId))
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Je mets à jour la liste locale
        setUsers(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, role: newRole as AdminUser['role'], updatedAt: new Date().toISOString() }
              : user
          )
        )
      } else {
        setError(data.message || 'Erreur lors de la mise à jour')
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour')
      console.error('Erreur:', err)
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  /**
   * Activation/désactivation d'un utilisateur
   */
  const toggleUserActive = async (userId: string, active: boolean) => {
    setProcessingIds(prev => new Set(prev).add(userId))
    
    try {
      const response = await fetch(`/api/admin/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, active })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, active, updatedAt: new Date().toISOString() }
              : user
          )
        )
      } else {
        setError(data.message || 'Erreur lors de la mise à jour')
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour')
      console.error('Erreur:', err)
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  /**
   * Formatage de la date
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  /**
   * Badge de rôle avec couleurs
   */
  const RoleBadge = ({ role }: { role: string }) => {
    const colors = {
      CLIENT: 'bg-gray-500/20 text-gray-400 border-gray-500',
      ADMIN: 'bg-blue-500/20 text-blue-400 border-blue-500',
      SUPER_ADMIN: 'bg-purple-500/20 text-purple-400 border-purple-500'
    }
    
    const labels = {
      CLIENT: 'Client',
      ADMIN: 'Admin',
      SUPER_ADMIN: 'Super Admin'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[role as keyof typeof colors]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    )
  }

  /**
   * Badge de statut actif
   */
  const StatusBadge = ({ active }: { active: boolean }) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
        active 
          ? 'bg-green-500/20 text-green-400 border-green-500'
          : 'bg-red-500/20 text-red-400 border-red-500'
      }`}>
        {active ? 'Actif' : 'Inactif'}
      </span>
    )
  }

  // Chargement initial et lors des changements de filtres
  useEffect(() => {
    loadUsers()
  }, [filters])

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
              <span className="ml-2 text-gray-500">/ Administration / Utilisateurs</span>
            </div>
            
            <nav className="flex space-x-4">
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/contacts" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contacts
              </Link>
              <Link 
                href="/admin/orders" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Commandes
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="mr-3 h-8 w-8" />
            Gestion des utilisateurs
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez les comptes utilisateurs, leurs rôles et leurs accès.
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtre par rôle */}
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filtrer par rôle"
            >
              <option value="">Tous les rôles</option>
              <option value="CLIENT">Client</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>

            {/* Filtre par statut */}
            <select
              value={filters.active}
              onChange={(e) => setFilters(prev => ({ ...prev, active: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filtrer par statut"
            >
              <option value="">Tous les statuts</option>
              <option value="true">Actifs</option>
              <option value="false">Inactifs</option>
            </select>

            {/* Bouton refresh */}
            <button
              onClick={() => loadUsers()}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              {loading ? 'Chargement...' : 'Actualiser'}
            </button>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commandes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé le
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'Nom non défini'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.emailVerified && (
                            <div className="text-xs text-green-600">✓ Email vérifié</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge active={user.active} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user._count.orders} commande{user._count.orders > 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Voir
                      </Link>
                      
                      {/* Actions rapides */}
                      <button
                        onClick={() => toggleUserActive(user.id, !user.active)}
                        disabled={processingIds.has(user.id)}
                        className={`${
                          user.active 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        } disabled:opacity-50`}
                      >
                        {user.active ? 'Désactiver' : 'Activer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={!pagination.hasNextPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{pagination.currentPage}</span> sur{' '}
                    <span className="font-medium">{pagination.totalPages}</span> ({pagination.totalCount} utilisateur{pagination.totalCount > 1 ? 's' : ''})
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={!pagination.hasNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* État vide */}
        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun utilisateur ne correspond aux critères de recherche.
            </p>
          </div>
        )}
      </main>
    </div>
  )
} 