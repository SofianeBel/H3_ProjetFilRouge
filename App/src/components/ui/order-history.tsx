'use client'

import React, { useState, useEffect } from 'react'
import { 
  Package, 
  ChevronRight, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react'

/**
 * Interface pour une commande
 */
interface Order {
  id: string
  stripePaymentIntentId: string
  amount: number
  currency: string
  status: string
  metadata: any
  createdAt: string
  updatedAt: string
}

/**
 * Interface pour les données de pagination
 */
interface Pagination {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Interface pour la réponse API
 */
interface OrdersResponse {
  success: boolean
  data: {
    orders: Order[]
    pagination: Pagination
  }
  message?: string
}

/**
 * Icônes de statut
 */
const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'succeeded':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'pending':
    case 'processing':
      return <Clock className="h-5 w-5 text-yellow-500" />
    case 'failed':
    case 'canceled':
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />
  }
}

/**
 * Labels de statut en français
 */
const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'succeeded':
      return 'Payé'
    case 'pending':
      return 'En attente'
    case 'processing':
      return 'En cours'
    case 'failed':
      return 'Échec'
    case 'canceled':
      return 'Annulé'
    case 'refunded':
      return 'Remboursé'
    default:
      return status
  }
}

/**
 * Formattage du montant
 */
const formatAmount = (amount: number, currency: string = 'eur') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount / 100) // Montant en centimes
}

/**
 * Formattage des dates
 */
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

/**
 * Composant principal pour l'historique des commandes
 */
export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  /**
   * Chargement des commandes
   */
  const loadOrders = async (page: number = 1, status: string = '') => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })

      if (status) {
        params.append('status', status)
      }

      const response = await fetch(`/api/orders?${params.toString()}`)
      const data: OrdersResponse = await response.json()

      if (data.success) {
        setOrders(data.data.orders)
        setPagination(data.data.pagination)
      } else {
        setError(data.message || 'Erreur lors du chargement des commandes')
      }
    } catch (err) {
      setError('Erreur réseau lors du chargement des commandes')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Effet pour charger les commandes au montage
   */
  useEffect(() => {
    loadOrders(currentPage, statusFilter)
  }, [currentPage, statusFilter])

  /**
   * Gestion du changement de filtre
   */
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1) // Revenir à la première page
  }

  /**
   * Gestion de la pagination
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  /**
   * Détails d'une commande depuis les métadonnées
   */
  const getOrderDetails = (metadata: any) => {
    if (!metadata) return null
    
    try {
      const details = typeof metadata === 'string' ? JSON.parse(metadata) : metadata
      return details
    } catch {
      return null
    }
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B8DE5]" />
        <span className="ml-2 text-gray-600">Chargement de votre historique...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-800 font-medium">Erreur</p>
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={() => loadOrders(currentPage, statusFilter)}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête et filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Historique des commandes
          </h3>
          <p className="text-sm text-gray-600">
            {pagination ? `${pagination.totalCount} commande(s) au total` : ''}
          </p>
        </div>

        {/* Filtre par statut */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Statut :</label>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            title="Filtrer par statut"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8DE5] focus:border-transparent"
          >
            <option value="">Tous</option>
            <option value="paid">Payé</option>
            <option value="pending">En attente</option>
            <option value="failed">Échec</option>
            <option value="refunded">Remboursé</option>
          </select>
        </div>
      </div>

      {/* Liste des commandes */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune commande trouvée
          </h3>
          <p className="text-gray-600">
            {statusFilter 
              ? `Aucune commande avec le statut "${getStatusLabel(statusFilter)}"`
              : "Vous n'avez pas encore passé de commande."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const details = getOrderDetails(order.metadata)
            
            return (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#6B8DE5] transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          Commande #{order.id.slice(-8)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard className="h-4 w-4" />
                          <span>{formatAmount(order.amount, order.currency)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>

                {/* Détails si disponibles */}
                {details && details.service_name && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Service : <span className="font-medium">{details.service_name}</span>
                      {details.plan_name && (
                        <span> - Plan {details.plan_name}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Page {pagination.page} sur {pagination.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Précédent
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Modal de détails (optionnel) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Détails de la commande #{selectedOrder.id.slice(-8)}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
                title="Fermer les détails"
                aria-label="Fermer les détails de la commande"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedOrder.status)}
                    <span>{getStatusLabel(selectedOrder.status)}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant
                  </label>
                  <span className="text-lg font-medium">
                    {formatAmount(selectedOrder.amount, selectedOrder.currency)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de commande
                  </label>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Stripe
                  </label>
                  <span className="text-sm text-gray-600 font-mono">
                    {selectedOrder.stripePaymentIntentId}
                  </span>
                </div>
              </div>

              {/* Métadonnées */}
              {selectedOrder.metadata && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Détails
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                      {JSON.stringify(
                        typeof selectedOrder.metadata === 'string' 
                          ? JSON.parse(selectedOrder.metadata) 
                          : selectedOrder.metadata, 
                        null, 
                        2
                      )}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
