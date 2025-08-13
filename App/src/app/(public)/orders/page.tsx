'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ArrowLeft, 
  Eye,
  Home,
  Filter
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

/**
 * Interface pour les données de commande côté client
 */
interface ClientOrder {
  id: string
  stripePaymentIntentId: string
  amount: number
  currency: string
  status: string
  metadata?: any
  createdAt: string
  updatedAt: string
}

/**
 * Interface pour la pagination
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
 * Types de statuts avec leurs couleurs et icônes
 */
const STATUS_CONFIG = {
  paid: {
    label: 'Payée',
    color: 'text-green-700 bg-green-50 border-green-200',
    icon: CheckCircle,
    description: 'Commande payée avec succès'
  },
  processing: {
    label: 'En traitement',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    icon: RefreshCw,
    description: 'Commande en cours de traitement'
  },
  pending: {
    label: 'En attente',
    color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    icon: Clock,
    description: 'Commande en attente de paiement'
  },
  failed: {
    label: 'Échouée',
    color: 'text-red-700 bg-red-50 border-red-200',
    icon: XCircle,
    description: 'Erreur lors du paiement'
  },
  refunded: {
    label: 'Remboursée',
    color: 'text-gray-700 bg-gray-50 border-gray-200',
    icon: RefreshCw,
    description: 'Commande remboursée'
  },
  cancelled: {
    label: 'Annulée',
    color: 'text-red-700 bg-red-50 border-red-200',
    icon: XCircle,
    description: 'Commande annulée'
  }
}

/**
 * Page d'historique des commandes - User Story 8.b
 */
export default function OrdersPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [orders, setOrders] = useState<ClientOrder[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  /**
   * Chargement des commandes
   */
  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user, currentPage, selectedStatus])

  const loadOrders = async () => {
    setIsLoading(true)
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (selectedStatus) {
        params.append('status', selectedStatus)
      }

      const response = await fetch(`/api/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.data.orders)
        setPagination(data.data.pagination)
      } else {
        console.error('Erreur chargement commandes:', data.message)
      }
    } catch (error) {
      console.error('Erreur chargement commandes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Formatage du prix en euros
   */
  const formatPrice = (priceInCents: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(priceInCents / 100)
  }

  /**
   * Formatage de la date
   */
  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  /**
   * Rendu du statut avec icône et couleur
   */
  const renderStatus = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
    const Icon = config.icon
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="h-4 w-4 mr-2" />
        {config.label}
      </div>
    )
  }

  // Redirection si non connecté
  if (isAuthLoading) {
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
    window.location.href = '/auth/login?callbackUrl=/orders'
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-cyna">
        <div className="max-w-6xl mx-auto">
          {/* Header avec navigation - User Story 8.c */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <Link 
                    href="/"
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Home className="h-5 w-5" />
                    <span>Retour à l'accueil</span>
                  </Link>
                  <span className="text-gray-400">•</span>
                  <Link 
                    href="/profile"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Mon profil
                  </Link>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Mes commandes
                </h1>
                <p className="text-gray-600">
                  Suivez l'état et l'historique de toutes vos commandes
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link
                  href="/services"
                  className="inline-flex items-center px-4 py-2 bg-[#6B8DE5] text-white rounded-lg hover:bg-[#5A7BD4] transition-colors"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Découvrir nos services
                </Link>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <label className="text-sm font-medium text-gray-700">
                    Filtrer par statut :
                  </label>
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value)
                    setCurrentPage(1)
                  }}
                  title="Filtrer les commandes par statut"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B8DE5] focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                    <option key={status} value={status}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={loadOrders}
                disabled={isLoading}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>
          </div>

          {/* Liste des commandes */}
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8DE5] mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des commandes...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune commande trouvée
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedStatus 
                    ? `Aucune commande avec le statut "${STATUS_CONFIG[selectedStatus as keyof typeof STATUS_CONFIG]?.label}"`
                    : "Vous n'avez pas encore passé de commande."
                  }
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center px-6 py-3 bg-[#6B8DE5] text-white rounded-lg hover:bg-[#5A7BD4] transition-colors"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Découvrir nos services
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
                
                return (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Commande #{order.id.slice(-8).toUpperCase()}
                          </h3>
                          {renderStatus(order.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Montant :</span>
                            <span className="ml-2 text-lg font-bold text-gray-900">
                              {formatPrice(order.amount)}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Date :</span>
                            <span className="ml-2">{formatDate(order.createdAt)}</span>
                          </div>
                          <div>
                            <span className="font-medium">Stripe ID :</span>
                            <span className="ml-2 font-mono text-xs">
                              {order.stripePaymentIntentId}
                            </span>
                          </div>
                        </div>
                        
                        <p className="mt-2 text-sm text-gray-600">
                          {config.description}
                        </p>
                        
                        {/* Métadonnées si disponibles */}
                        {order.metadata && Object.keys(order.metadata).length > 0 && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Détails de la commande</h4>
                            <div className="text-sm text-gray-600">
                              {/* Ici on peut afficher plus de détails selon les métadonnées */}
                              <pre className="text-xs overflow-x-auto">
                                {JSON.stringify(order.metadata, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6 flex flex-col space-y-2">
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Voir détails</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Affichage de {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.totalCount)} à{' '}
                {Math.min(pagination.page * pagination.limit, pagination.totalCount)} sur {pagination.totalCount} commandes
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {pagination.page} sur {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
