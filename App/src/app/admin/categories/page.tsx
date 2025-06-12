'use client'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'

type Category = {
  id: string
  name: string
  description: string | null
  slug: string
  _count: {
    posts: number
  }
}

// Composant client pour la liste
function CategoriesList({ categories }: { categories: Category[] }) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Gestion des catégories
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Liste des catégories disponibles
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nouvelle catégorie
        </Link>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-medium text-gray-900 truncate">
                    {category.name}
                  </h4>
                  {category.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {category.description}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    {category._count.posts} article(s)
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex space-x-2">
                  <Link
                    href={`/admin/categories/${category.id}/edit`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={async () => {
                      if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
                        try {
                          const response = await fetch(`/api/blog/categories?id=${category.id}`, {
                            method: 'DELETE',
                          })
                          if (response.ok) {
                            window.location.reload()
                          } else {
                            const error = await response.json()
                            alert(error.error || 'Une erreur est survenue')
                          }
                        } catch {
                          alert('Une erreur est survenue')
                        }
                      }
                    }}
                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Page principale (composant serveur)
export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Catégories
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez les catégories de votre blog
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour à l'administration
            </Link>
          </div>

          <div className="mt-8">
            <CategoriesList categories={categories} />
          </div>
        </div>
      </div>
    </div>
  )
} 