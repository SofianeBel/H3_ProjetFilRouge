'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ArrowLeft, 
  Home,
  Download,
  CreditCard,
  Calendar,
  User,
  Euro
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

/**
 * Interface pour les données complètes de commande
 */
interface OrderDetails {
  id: string
  stripePaymentIntentId: string
  amount: number
  currency: string
  status: string
  metadata?: any
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string | null
    email: string
  }
}

/**
 * Configuration des statuts (réutilisée de la page orders)
 */
const STATUS_CONFIG = {
  paid: {
    label: 'Payée',
    color: 'text-green-700 bg-green-50 border-green-200',
    icon: CheckCircle,
    description: 'Commande payée avec succès. Votre service va être mis en place sous 24-48h.',
    nextSteps: 'Notre équipe va vous contacter pour finaliser la configuration de votre service.'
  },
  processing: {
    label: 'En traitement',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    icon: RefreshCw,
    description: 'Commande en cours de traitement par notre équipe.',
    nextSteps: 'Vous recevrez un email de confirmation une fois le traitement terminé.'
  },
  pending: {
    label: 'En attente',
    color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    icon: Clock,
    description: 'Commande en attente de paiement.',
    nextSteps: 'Veuillez finaliser le paiement pour que nous puissions traiter votre commande.'
  },
  failed: {
    label: 'Échouée',
    color: 'text-red-700 bg-red-50 border-red-200',
    icon: XCircle,
    description: 'Erreur lors du paiement. Aucun montant n\'a été débité.',
    nextSteps: 'Vous pouvez reprendre votre commande ou nous contacter pour obtenir de l\'aide.'
  },
  refunded: {
    label: 'Remboursée',
    color: 'text-gray-700 bg-gray-50 border-gray-200',
    icon: RefreshCw,
    description: 'Commande remboursée avec succès.',
    nextSteps: 'Le remboursement apparaîtra sur votre compte sous 3-5 jours ouvrés.'
  },
  cancelled: {
    label: 'Annulée',
    color: 'text-red-700 bg-red-50 border-red-200',
    icon: XCircle,
    description: 'Commande annulée.',
    nextSteps: 'Si vous avez des questions, n\'hésitez pas à nous contacter.'
  }
}

/**
 * Page de détails d'une commande - User Story 8.a
 */
export default function OrderDetailsPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const params = useParams()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  /**
   * Chargement des détails de la commande
   */
  useEffect(() => {
    if (user && orderId) {
      loadOrderDetails()
    }
  }, [user, orderId])

  const loadOrderDetails = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.data)
      } else {
        setError(data.message || 'Commande non trouvée')
      }
    } catch (error) {
      console.error('Erreur chargement commande:', error)
      setError('Erreur lors du chargement de la commande')
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
      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="h-5 w-5 mr-2" />
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
        <div className="max-w-4xl mx-auto">
          {/* Navigation - User Story 8.c */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <Link 
                href="/"
                className="inline-flex items-center space-x-1 hover:text-gray-900 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Accueil</span>
              </Link>
              <span>•</span>
              <Link 
                href="/orders"
                className="inline-flex items-center space-x-1 hover:text-gray-900 transition-colors"
              >
                <Package className="h-4 w-4" />
                <span>Mes commandes</span>
              </Link>
              <span>•</span>
              <span className="text-gray-900">Détails de la commande</span>
            </div>
          </div>

          {/* Chargement */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8DE5] mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des détails de la commande...</p>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
              <div className="text-center">
                <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Erreur
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="flex justify-center space-x-4">
                  <Link
                    href="/orders"
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour aux commandes
                  </Link>
                  <button
                    onClick={loadOrderDetails}
                    className="inline-flex items-center px-4 py-2 bg-[#6B8DE5] text-white rounded-lg hover:bg-[#5A7BD4] transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Détails de la commande */}
          {order && (
            <div className="space-y-6">
              {/* Header avec statut */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Commande #{order.id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-gray-600">
                      Passée le {formatDate(order.createdAt)}
                    </p>
                  </div>
                  {renderStatus(order.status)}
                </div>

                {/* Description du statut */}
                {(() => {
                  const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
                  return (
                    <div className={`p-4 rounded-lg border ${config.color.replace('text-', 'border-').replace('bg-', 'bg-')}`}>
                      <p className="font-medium mb-2">{config.description}</p>
                      {config.nextSteps && (
                        <p className="text-sm opacity-90">{config.nextSteps}</p>
                      )}
                    </div>
                  )
                })()}
              </div>

              {/* Informations financières */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Euro className="h-5 w-5 mr-2" />
                    Informations financières
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant HT :</span>
                      <span className="font-medium">{formatPrice(Math.round(order.amount / 1.2))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">TVA (20%) :</span>
                      <span className="font-medium">{formatPrice(order.amount - Math.round(order.amount / 1.2))}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total TTC :</span>
                        <span className="text-[#6B8DE5]">{formatPrice(order.amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Informations de paiement
                  </h2>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">ID de transaction Stripe :</span>
                      <p className="font-mono text-sm break-all">{order.stripePaymentIntentId}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Devise :</span>
                      <p className="font-medium">{order.currency.toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Dernière mise à jour :</span>
                      <p className="font-medium">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations client */}
              {order.user && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informations client
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">Nom :</span>
                      <p className="font-medium">{order.user.name || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Email :</span>
                      <p className="font-medium">{order.user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Métadonnées de la commande */}
              {order.metadata && Object.keys(order.metadata).length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Détails de la commande
                  </h2>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(order.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions disponibles
                </h2>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/orders"
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour aux commandes
                  </Link>
                  
                  <Link
                    href="/booking"
                    className="inline-flex items-center px-4 py-2 bg-[#6B8DE5] text-white rounded-lg hover:bg-[#5A7BD4] transition-colors"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Prendre rendez-vous
                  </Link>
                  
                  <Link
                    href="/services"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Découvrir nos services
                  </Link>
                  
                  {order.status === 'paid' && (
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Imprimer la facture
                    </button>
                  )}
                </div>
              </div>

              {/* Support */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Besoin d'aide ?
                </h3>
                <p className="text-blue-800 mb-4">
                  Notre équipe support est disponible pour répondre à vos questions concernant cette commande.
                </p>
                <Link
                  href="/booking?mode=message"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contacter le support
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

