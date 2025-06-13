/**
 * Dashboard d'administration principal
 * Vue d'ensemble des statistiques et accès rapide aux sections
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  ShoppingCart,
  TrendingUp, 
  DollarSign,
  UserCheck,
  AlertCircle,
  BarChart3,
  Activity
} from 'lucide-react'

/**
 * Interface pour les statistiques du dashboard
 */
interface DashboardStats {
  users: {
    total: number
    active: number
    newThisMonth: number
  }
  orders: {
    total: number
    totalAmount: number
    thisMonth: number
    thisMonthAmount: number
  }
  contacts: {
    total: number
    unread: number
    thisMonth: number
  }
  bookings: {
    total: number
    pending: number
    thisMonth: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /**
   * Chargement des statistiques du dashboard
   */
  const loadStats = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Pour l'instant, on utilise des données mockées
      // TODO: Créer une API /api/admin/stats qui agrège toutes les données
      const mockStats: DashboardStats = {
        users: {
          total: 156,
          active: 142,
          newThisMonth: 23
        },
        orders: {
          total: 89,
          totalAmount: 45670, // en centimes
          thisMonth: 12,
          thisMonthAmount: 8950
        },
        contacts: {
          total: 234,
          unread: 8,
          thisMonth: 45
        },
        bookings: {
          total: 67,
          pending: 5,
          thisMonth: 18
        }
      }
      
      setStats(mockStats)
    } catch (err) {
      setError('Erreur lors du chargement des statistiques')
      console.error('Erreur dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Formatage des montants en euros
   */
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100)
  }

  // Chargement initial
  useEffect(() => {
    loadStats()
  }, [])

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
              <span className="ml-2 text-gray-500">/ Administration</span>
            </div>
            
            <nav className="flex space-x-4">
              <Link 
                href="/admin/users" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Utilisateurs
              </Link>
              <Link 
                href="/admin/orders" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Commandes
              </Link>
              <Link 
                href="/admin/contacts" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contacts
              </Link>
              <Link 
                href="/admin/bookings" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Réservations
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="mr-3 h-8 w-8" />
            Dashboard Administration
          </h1>
          <p className="mt-2 text-gray-600">
            Vue d'ensemble de votre plateforme et accès rapide aux sections de gestion.
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Statistiques principales */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Statistiques Utilisateurs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Utilisateurs
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.users.total}
                    </dd>
                    <dd className="text-sm text-gray-600">
                      {stats.users.active} actifs • +{stats.users.newThisMonth} ce mois
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Statistiques Commandes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Commandes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.orders.total}
                    </dd>
                    <dd className="text-sm text-gray-600">
                      {formatAmount(stats.orders.totalAmount)} • +{stats.orders.thisMonth} ce mois
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Statistiques Contacts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Messages
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.contacts.total}
                    </dd>
                    <dd className="text-sm text-gray-600">
                      {stats.contacts.unread} non lus • +{stats.contacts.thisMonth} ce mois
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Statistiques Réservations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Réservations
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.bookings.total}
                    </dd>
                    <dd className="text-sm text-gray-600">
                      {stats.bookings.pending} en attente • +{stats.bookings.thisMonth} ce mois
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Gestion des utilisateurs */}
          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-700">
                  Utilisateurs
                </h3>
                <p className="text-sm text-gray-500">
                  Gérer les comptes et rôles
                </p>
              </div>
            </div>
          </Link>

          {/* Gestion des commandes */}
          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-8 w-8 text-green-600 group-hover:text-green-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-700">
                  Commandes
                </h3>
                <p className="text-sm text-gray-500">
                  Paiements et remboursements
                </p>
              </div>
            </div>
          </Link>

          {/* Gestion des contacts */}
          <Link
            href="/admin/contacts"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-8 w-8 text-purple-600 group-hover:text-purple-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-700">
                  Messages
                </h3>
                <p className="text-sm text-gray-500">
                  Demandes de contact
                </p>
              </div>
            </div>
          </Link>

          {/* Gestion des réservations */}
          <Link
            href="/admin/bookings"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-orange-600 group-hover:text-orange-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-700">
                  Réservations
                </h3>
                <p className="text-sm text-gray-500">
                  Rendez-vous clients
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Alertes et notifications */}
        {stats && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
              Alertes et notifications
            </h2>
            
            <div className="space-y-3">
              {stats.contacts.unread > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 rounded-md">
                  <MessageSquare className="h-5 w-5 text-yellow-600 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">
                      {stats.contacts.unread} message{stats.contacts.unread > 1 ? 's' : ''} non lu{stats.contacts.unread > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-yellow-600">
                      Des clients attendent une réponse
                    </p>
                  </div>
                  <Link
                    href="/admin/contacts"
                    className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                  >
                    Voir →
                  </Link>
                </div>
              )}

              {stats.bookings.pending > 0 && (
                <div className="flex items-center p-3 bg-blue-50 rounded-md">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">
                      {stats.bookings.pending} réservation{stats.bookings.pending > 1 ? 's' : ''} en attente
                    </p>
                    <p className="text-xs text-blue-600">
                      Confirmez ou refusez les demandes de rendez-vous
                    </p>
                  </div>
                  <Link
                    href="/admin/bookings"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Voir →
                  </Link>
                </div>
              )}

              {stats.contacts.unread === 0 && stats.bookings.pending === 0 && (
                <div className="flex items-center p-3 bg-green-50 rounded-md">
                  <UserCheck className="h-5 w-5 text-green-600 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">
                      Tout est à jour !
                    </p>
                    <p className="text-xs text-green-600">
                      Aucune action urgente requise
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 