import { Suspense } from 'react'
import Link from 'next/link'
//import { prisma } from '@/lib/prisma'

// Composant pour le formulaire de création d'article
function NewBlogPostForm() {
  return (
    <form className="space-y-6">
      {/* Titre */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Titre
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Extrait */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          Extrait
        </label>
        <textarea
          name="excerpt"
          id="excerpt"
          rows={3}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Contenu */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Contenu
        </label>
        <textarea
          name="content"
          id="content"
          rows={10}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Catégorie */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Catégorie
        </label>
        <select
          name="categoryId"
          id="categoryId"
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Sélectionner une catégorie</option>
          {/* Liste des catégories */}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <input
          type="text"
          name="tags"
          id="tags"
          placeholder="Séparés par des virgules"
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Options de publication */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="published"
            id="published"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            Publier immédiatement
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
            Article mis en avant
          </label>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-4">
        <Link
          href="/admin/blog"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </Link>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Créer l'article
        </button>
      </div>
    </form>
  )
}

// Page principale
export default function NewBlogPostPage() {
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
              <span className="ml-2 text-gray-500">/ Blog / Nouvel Article</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Nouvel Article
          </h1>
          <p className="mt-2 text-gray-600">
            Créez un nouvel article pour votre blog.
          </p>
        </div>

        {/* Formulaire avec suspense */}
        <Suspense fallback={
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        }>
          <NewBlogPostForm />
        </Suspense>
      </main>
    </div>
  )
}