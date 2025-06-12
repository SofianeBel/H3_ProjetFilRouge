import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

/**
 * Récupère les statistiques pour le tableau de bord admin
 */
async function getAdminStats() {
  try {
    // Statistiques des contacts
    const totalContacts = await prisma.contact.count()
    const recentContacts = await prisma.contact.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 derniers jours
        }
      }
    })

    // Statistiques des articles de blog  
    const totalPosts = await prisma.blogPost.count()
    const publishedPosts = await prisma.blogPost.count({
      where: { published: 1 }
    })

    // Statistiques des catégories
    const totalCategories = await prisma.category.count()

    return {
      contacts: {
        total: totalContacts,
        recent: recentContacts
      },
      blog: {
        total: totalPosts,
        published: publishedPosts,
        draft: totalPosts - publishedPosts
      },
      categories: totalCategories
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error)
    return {
      contacts: { total: 0, recent: 0 },
      blog: { total: 0, published: 0, draft: 0 },
      categories: 0
    }
  }
}

/**
 * Composant de carte de statistique
 */
function StatCard({ title, value, description, link }: {
  title: string
  value: number
  description: string
  link: string
}) {
  return (
    <Link href={link} className="group">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="text-3xl font-bold text-blue-600 mb-2">{value}</div>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="mt-4 text-sm text-blue-600 group-hover:text-blue-800">
          Voir détails →
        </div>
      </div>
    </Link>
  )
}

/**
 * Composant du tableau de bord avec chargement des stats
 */
async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Contacts Total"
        value={stats.contacts.total}
        description={`${stats.contacts.recent} nouveaux cette semaine`}
        link="/admin/contacts"
      />
      
      <StatCard
        title="Articles Publiés"
        value={stats.blog.published}
        description={`${stats.blog.draft} brouillons en attente`}
        link="/admin/blog"
      />

      <StatCard
        title="Catégories"
        value={stats.categories}
        description="Catégories de blog actives"
        link="/admin/categories"
      />

      {/* Liens d'actions rapides */}
      <div className="lg:col-span-3 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/admin/blog/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Nouvel Article
          </Link>
          
          <Link 
            href="/admin/contacts"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            Voir Contacts
          </Link>
          
          <Link 
            href="/admin/categories/new"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            Nouvelle Catégorie
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Page d'administration principale
 * Affiche le tableau de bord avec les statistiques
 */
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Cyna
              </Link>
              <span className="ml-2 text-gray-500">/ Administration</span>
            </div>
            
            <nav className="flex space-x-4">
              <Link 
                href="/admin/contacts" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contacts
              </Link>
              <Link 
                href="/admin/blog" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Blog
              </Link>
              <Link 
                href="/admin/categories" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Catégories
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord administrateur
          </h1>
          <p className="mt-2 text-gray-600">
            Vue d&apos;ensemble des contacts, articles et statistiques du site.
          </p>
        </div>

        {/* Tableau de bord avec suspense pour le chargement */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        }>
          <AdminDashboard />
        </Suspense>
      </main>
    </div>
  )
} 