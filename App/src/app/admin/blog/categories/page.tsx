import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

// Composant pour afficher une catégorie
function CategoryCard({ category }: { category: any }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
          {category.description && (
            <p className="mt-1 text-sm text-gray-500">{category.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/admin/blog/categories/${category.id}/edit`}
            className="text-blue-600 hover:text-blue-800"
          >
            Modifier
          </Link>
          <button
            onClick={() => {
              if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
                // Appel API pour supprimer la catégorie
                fetch(`/api/blog/categories?id=${category.id}`, {
                  method: 'DELETE',
                }).then(() => {
                  window.location.reload()
                })
              }
            }}
            className="text-red-600 hover:text-red-800"
          >
            Supprimer
          </button>
        </div>
      </div>
      <div className="mt-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {category._count.posts} article{category._count.posts !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}

// Composant pour la liste des catégories
async function CategoryList() {
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}

// Composant pour le formulaire d'ajout de catégorie
function NewCategoryForm() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = {
          name: formData.get('name'),
          description: formData.get('description'),
        }

        try {
          const response = await fetch('/api/blog/categories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (response.ok) {
            window.location.reload()
          } else {
            const error = await response.json()
            alert(error.error || 'Une erreur est survenue')
          }
        } catch (error) {
          alert('Une erreur est survenue')
        }
      }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ajouter une nouvelle catégorie
      </h3>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nom
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Ajouter
          </button>
        </div>
      </div>
    </form>
  )
}

// Page principale
export default function AdminCategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Gestion des catégories
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez les catégories de votre blog
              </p>
            </div>
            <Link
              href="/admin/blog"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour aux articles
            </Link>
          </div>

          <div className="mb-8">
            <NewCategoryForm />
          </div>

          <div className="mt-8">
            <Suspense
              fallback={
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Chargement des catégories...</p>
                </div>
              }
            >
              <CategoryList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}