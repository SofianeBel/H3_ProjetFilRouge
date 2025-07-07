/**
 * Page d'administration pour la gestion des réservations
 * Permet de visualiser, modifier et gérer les demandes de rendez-vous
 */

'use client'

import { useState, useEffect } from 'react'
import { Calendar, User, Building, Phone, Mail, MessageSquare, Filter, Search, Download } from 'lucide-react'

/**
 * Interface pour les données de réservation
 */
interface Booking {
  id: string
  name: string
  email: string
  company: string
  phone?: string
  service: string
  preferredDate: string
  message?: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

/**
 * Interface pour les filtres de recherche
 */
interface BookingFilters {
  status: string
  service: string
  search: string
  page: number
}

export default function AdminBookingsPage() {
  // États pour la gestion des réservations
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // États pour les filtres et pagination
  const [filters, setFilters] = useState<BookingFilters>({
    status: '',
    service: '',
    search: '',
    page: 1
  })
  
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  
  // État pour les actions en cours
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  /**
   * Chargement des réservations avec filtres
   */
  const loadBookings = async () => {
    setLoading(true)
    setError('')
    
    try {
      const searchParams = new URLSearchParams()
      searchParams.append('page', filters.page.toString())
      searchParams.append('limit', '10')
      
      if (filters.status) searchParams.append('status', filters.status)
      if (filters.service) searchParams.append('service', filters.service)
      if (filters.search) searchParams.append('search', filters.search)
      
      const response = await fetch(`/api/booking?${searchParams}`)
      const data = await response.json()
      
      if (response.ok) {
        setBookings(data.bookings)
        setPagination(data.pagination)
      } else {
        setError(data.error || 'Erreur lors du chargement')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error('Erreur lors du chargement des réservations:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Mise à jour du statut d'une réservation
   */
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setProcessingIds(prev => new Set(prev).add(bookingId))
    
    try {
      const response = await fetch(`/api/booking/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Je mets à jour la liste locale
                 setBookings(prev => 
           prev.map(booking => 
             booking.id === bookingId 
               ? { ...booking, status: newStatus as Booking['status'], updatedAt: new Date().toISOString() }
               : booking
           )
         )
      } else {
        setError(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour')
      console.error('Erreur:', err)
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(bookingId)
        return newSet
      })
    }
  }

  /**
   * Suppression d'une réservation
   */
  const deleteBooking = async (bookingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return
    }
    
    setProcessingIds(prev => new Set(prev).add(bookingId))
    
    try {
      const response = await fetch(`/api/booking/${bookingId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setBookings(prev => prev.filter(booking => booking.id !== bookingId))
      } else {
        const data = await response.json()
        setError(data.error || 'Erreur lors de la suppression')
      }
    } catch (err) {
      setError('Erreur lors de la suppression')
      console.error('Erreur:', err)
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(bookingId)
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
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      CONFIRMED: 'bg-blue-500/20 text-blue-400 border-blue-500',
      COMPLETED: 'bg-green-500/20 text-green-400 border-green-500',
      CANCELLED: 'bg-red-500/20 text-red-400 border-red-500'
    }
    
    const labels = {
      PENDING: 'En attente',
      CONFIRMED: 'Confirmé',
      COMPLETED: 'Terminé',
      CANCELLED: 'Annulé'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  // Chargement initial et lors des changements de filtres
  useEffect(() => {
    loadBookings()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header avec titre et actions */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Gestion des Réservations
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Gérez les demandes de consultation et rendez-vous clients
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              <Download className="h-4 w-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          
          {/* Recherche */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className="block w-full rounded-lg bg-gray-800 border border-gray-700 pl-10 pr-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Filtre par statut */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            aria-label="Filtrer par statut"
            className="block w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="CONFIRMED">Confirmé</option>
            <option value="COMPLETED">Terminé</option>
            <option value="CANCELLED">Annulé</option>
          </select>

          {/* Filtre par service */}
          <select
            value={filters.service}
            onChange={(e) => setFilters(prev => ({ ...prev, service: e.target.value, page: 1 }))}
            aria-label="Filtrer par service"
            className="block w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Tous les services</option>
            <option value="SOC">SOC 24/7</option>
            <option value="Audit">Audit de Sécurité</option>
            <option value="Pentest">Test de Pénétration</option>
            <option value="CERT">CERT</option>
          </select>

          {/* Bouton de reset */}
          <button
            onClick={() => setFilters({ status: '', service: '', search: '', page: 1 })}
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
          >
            <Filter className="h-4 w-4" />
            Réinitialiser
          </button>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Tableau des réservations */}
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-400">Chargement...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune réservation trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date souhaitée
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{booking.name}</div>
                            <div className="text-sm text-gray-400 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {booking.email}
                            </div>
                            <div className="text-sm text-gray-400 flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {booking.company}
                            </div>
                            {booking.phone && (
                              <div className="text-sm text-gray-400 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {booking.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-white">{booking.service}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-white">
                          <Calendar className="h-4 w-4" />
                          {formatDate(booking.preferredDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          
                          {/* Actions de changement de statut */}
                          {booking.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                                disabled={processingIds.has(booking.id)}
                                className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
                              >
                                Confirmer
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                                disabled={processingIds.has(booking.id)}
                                className="text-red-400 hover:text-red-300 disabled:opacity-50"
                              >
                                Annuler
                              </button>
                            </>
                          )}
                          
                          {booking.status === 'CONFIRMED' && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                              disabled={processingIds.has(booking.id)}
                              className="text-green-400 hover:text-green-300 disabled:opacity-50"
                            >
                              Marquer terminé
                            </button>
                          )}

                          {/* Message si présent */}
                          {booking.message && (
                            <button
                              title={booking.message}
                              className="text-gray-400 hover:text-white"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </button>
                          )}

                          {/* Suppression */}
                          <button
                            onClick={() => deleteBooking(booking.id)}
                            disabled={processingIds.has(booking.id)}
                            className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page {filters.page} sur {pagination.totalPages} ({pagination.total} réservations)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Précédent
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasNext}
                className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 