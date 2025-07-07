/**
 * Page d'administration pour la gestion des commandes
 * Permet de visualiser et gérer les commandes Stripe
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard, Search, Filter, RefreshCw, Euro, Calendar, ShoppingCart } from 'lucide-react'

/**
 * Interface pour les données de commande
 */
interface AdminOrder {
  id: string
  stripePaymentIntentId: string
  amount: number
  currency: string
  status: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string | null
    email: string
  } | null
  metadata?: any
}

/**
 * Interface pour les filtres de recherche
 */
interface OrderFilters {
  search: string
  status: string
  page: number
}

export default function AdminOrdersPage() {
  // États pour la gestion des commandes
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // États pour les filtres et pagination
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: '',
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
   * Chargement des commandes avec filtres
   */
  const loadOrders = async (refresh = false) => {
    setLoading(true)
    setError('')
    
    try {
      const searchParams = new URLSearchParams()
      searchParams.append('page', filters.page.toString())
      searchParams.append('limit', '10')
      
      if (filters.search) searchParams.append('search', filters.search)
      if (filters.status) searchParams.append('status', filters.status)
      if (refresh) searchParams.append('refresh', 'true')
      
      const response = await fetch(`/api/admin/orders?${searchParams}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        setOrders(data.data.orders)
        setPagination(data.data.pagination)
      } else {
        setError(data.message || 'Erreur lors du chargement')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error('Erreur lors du chargement des commandes:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Formatage du montant en euros
   */
  const formatAmount = (amount: number, currency: string = 'eur') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  /**
   * Formatage de la date
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
   * Badge de statut avec couleurs
   */
  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      succeeded: 'bg-green-500/20 text-green-400 border-green-500',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      processing: 'bg-blue-500/20 text-blue-400 border-blue-500',
      failed: 'bg-red-500/20 text-red-400 border-red-500',
      canceled: 'bg-gray-500/20 text-gray-400 border-gray-500',
      refunded: 'bg-purple-500/20 text-purple-400 border-purple-500',
      partially_refunded: 'bg-orange-500/20 text-orange-400 border-orange-500'
    }
    
    const labels = {
      succeeded: 'Payé',
      pending: 'En attente',
      processing: 'En cours',
      failed: 'Échoué',
      canceled: 'Annulé',
      refunded: 'Remboursé',
      partially_refunded: 'Partiellement remboursé'
    }
    
    const defaultColor = 'bg-gray-500/20 text-gray-400 border-gray-500'
    const color = colors[status as keyof typeof colors] || defaultColor
    const label = labels[status as keyof typeof labels] || status
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${color}`}>
        {label}
      </span>
    )
  }

  // Chargement initial et lors des changements de filtres
  useEffect(() => {
    loadOrders()
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
              <span className="ml-2 text-gray-500">/ Administration / Commandes</span>
            </div>
            
            <nav className="flex space-x-4">
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/users" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Utilisateurs
              </Link>
              <Link 
                href="/admin/contacts" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contacts
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="mr-3 h-8 w-8" />
            Gestion des commandes
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez les commandes et paiements Stripe de vos clients.
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
                placeholder="Rechercher par email ou ID Stripe..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtre par statut */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filtrer par statut"
            >
              <option value="">Tous les statuts</option>
              <option value="succeeded">Payé</option>
              <option value="pending">En attente</option>
              <option value="processing">En cours</option>
              <option value="failed">Échoué</option>
              <option value="canceled">Annulé</option>
              <option value="refunded">Remboursé</option>
              <option value="partially_refunded">Partiellement remboursé</option>
            </select>

            {/* Bouton refresh */}
            <button
              onClick={() => loadOrders()}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              {loading ? 'Chargement...' : 'Actualiser'}
            </button>

            {/* Bouton refresh Stripe */}
            <button
              onClick={() => loadOrders(true)}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Stripe
            </button>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Tableau des commandes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.stripePaymentIntentId.substring(0, 20)}...
                          </div>
                          <div className="text-sm text-gray-500">ID: {order.id.substring(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.user ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.user.name || 'Nom non défini'}
                          </div>
                          <div className="text-sm text-gray-500">{order.user.email}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Client anonyme</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatAmount(order.amount, order.currency)}
                      </div>
                      <div className="text-sm text-gray-500">{order.currency.toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </div>
                      {order.updatedAt !== order.createdAt && (
                        <div className="text-xs text-gray-500">
                          Modifié: {formatDate(order.updatedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Voir
                      </Link>
                      
                      {/* Actions rapides selon le statut */}
                      {order.status === 'succeeded' && (
                        <Link
                          href={`/admin/orders/${order.id}?action=refund`}
                          className="text-red-600 hover:text-red-900"
                        >
                          Rembourser
                        </Link>
                      )}
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
                    <span className="font-medium">{pagination.totalPages}</span> ({pagination.totalCount} commande{pagination.totalCount > 1 ? 's' : ''})
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
        {!loading && orders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune commande ne correspond aux critères de recherche.
            </p>
          </div>
        )}
      </main>
    </div>
  )
} 