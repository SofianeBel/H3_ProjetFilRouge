import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

/**
 * Interface pour les paramètres de pagination et tri
 */
interface ContactsPageProps {
  searchParams: Promise<{
    page?: string
    service?: string
    search?: string
  }>
}

/**
 * Récupère les contacts avec pagination et filtres
 */
async function getContacts(
  page: number = 1, 
  service?: string, 
  search?: string
) {
  const itemsPerPage = 10
  const skip = (page - 1) * itemsPerPage

  try {
    // Construction de la condition where pour le filtrage
    const whereCondition = {
      ...(service && service !== 'all' ? { service } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { company: { contains: search, mode: 'insensitive' as const } }
        ]
      } : {})
    }

    // Récupération des contacts et du total
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: whereCondition,
        skip,
        take: itemsPerPage,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contact.count({ where: whereCondition })
    ])

    const totalPages = Math.ceil(total / itemsPerPage)

    return {
      contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error)
    return {
      contacts: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10
      }
    }
  }
}

/**
 * Composant de ligne de contact dans le tableau
 */
function ContactRow({ contact }: { contact: {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  service: string | null
  message: string
  createdAt: Date
} }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
        <div className="text-sm text-gray-500">{contact.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{contact.company || '-'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{contact.phone || '-'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {contact.service && (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {contact.service}
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {contact.message}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Link 
          href={`/admin/contacts/${contact.id}`}
          className="text-blue-600 hover:text-blue-900"
        >
          Voir
        </Link>
      </td>
    </tr>
  )
}

/**
 * Composant de pagination
 */
function Pagination({ pagination, searchParams }: {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  searchParams: Record<string, string | undefined>
}) {
  const { currentPage, totalPages } = pagination

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Page {currentPage} sur {totalPages} 
        ({pagination.totalItems} contact{pagination.totalItems > 1 ? 's' : ''})
      </div>
      
      <div className="flex space-x-1">
        {/* Page précédente */}
        {currentPage > 1 && (
          <Link
            href={`/admin/contacts?page=${currentPage - 1}&${generateQueryString(searchParams)}`}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Précédent
          </Link>
        )}

        {/* Numéros de pages */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = Math.max(1, currentPage - 2) + i
          if (pageNum > totalPages) return null
          
          return (
            <Link
              key={pageNum}
              href={`/admin/contacts?page=${pageNum}&${Object.entries(searchParams).filter(([, value]) => value).map(([key, value]) => `${key}=${value}`).join('&')}`}
              className={`px-3 py-1 text-sm border rounded ${
                pageNum === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </Link>
          )
        })}

        {/* Page suivante */}
        {currentPage < totalPages && (
          <Link
            href={`/admin/contacts?page=${currentPage + 1}&${Object.entries(searchParams).filter(([, value]) => value).map(([key, value]) => `${key}=${value}`).join('&')}`}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Suivant
          </Link>
        )}
      </div>
    </div>
  )
}

/**
 * Composant principal de la liste des contacts
 */
async function ContactsList({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const page = parseInt(searchParams.page || '1')
  const service = searchParams.service
  const search = searchParams.search

  const { contacts, pagination } = await getContacts(page, service, search)

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Tableau des contacts */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entreprise
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
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
            {contacts.length > 0 ? (
              contacts.map((contact: { 
                id: string; 
                name: string; 
                email: string; 
                company: string | null; 
                phone: string | null; 
                service: string | null; 
                message: string; 
                createdAt: Date 
              }) => (
                <ContactRow key={contact.id} contact={contact} />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Aucun contact trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination pagination={pagination} searchParams={searchParams} />
    </div>
  )
}

/**
 * Page d'administration des contacts
 */
export default async function AdminContactsPage({ searchParams }: ContactsPageProps) {
  const resolvedSearchParams = await searchParams
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-blue-600">
                Admin
              </Link>
              <span className="ml-2 text-gray-500">/ Contacts</span>
            </div>
            
            <Link 
              href="/admin"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              ← Retour au tableau de bord
            </Link>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des contacts
          </h1>
          <p className="mt-2 text-gray-600">
            Liste des demandes de contact reçues via le formulaire.
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <form method="get" className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Rechercher
              </label>
              <input
                type="text"
                id="search"
                name="search"
                defaultValue={resolvedSearchParams.search || ''}
                placeholder="Nom, email, entreprise..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                id="service"
                name="service"
                defaultValue={resolvedSearchParams.service || 'all'}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les services</option>
                <option value="SOC">SOC</option>
                <option value="Audit">Audit</option>
                <option value="Pentest">Pentest</option>
                <option value="CERT">CERT</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Filtrer
            </button>
          </form>
        </div>

        {/* Liste des contacts */}
        <Suspense fallback={
          <div className="bg-white shadow-sm rounded-lg p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        }>
          <ContactsList searchParams={resolvedSearchParams} />
        </Suspense>
      </main>
    </div>
  )
} 