import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

// Composant pour afficher un article
function BlogPostCard({ post }: { post: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs ${
              post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {post.published ? 'Publié' : 'Brouillon'}
            </span>
            {post.category && (
              <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                {post.category.name}
              </span>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Créé le {formatDate(post.createdAt)}
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/admin/blog/${post.id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            Éditer
          </Link>
          <button
            onClick={() => handleDelete(post.id)}
            className="text-red-600 hover:text-red-800"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

// Composant pour la liste des articles
async function BlogList() {
  const posts = await prisma.blogPost.findMany({
    include: {
      category: true,
      author: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

// Page principale
export default function AdminBlogPage() {
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
              <span className="ml-2 text-gray-500">/ Blog</span>
            </div>
            
            <Link
              href="/admin/blog/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Nouvel Article
            </Link>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion du Blog
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez vos articles de blog, catégories et publications.
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Rechercher un article..."
              className="flex-1 p-2 border rounded-md"
            />
            <select className="p-2 border rounded-md">
              <option value="">Toutes les catégories</option>
              {/* Liste des catégories */}
            </select>
            <select className="p-2 border rounded-md">
              <option value="">Tous les statuts</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
            </select>
          </div>
        </div>

        {/* Liste des articles avec suspense */}
        <Suspense fallback={
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        }>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}