'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { BlogPost } from '../types'

// Composant pour le formulaire d'édition (client)
function EditBlogPostForm({ post }: { post: BlogPost }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      published: formData.get('published') === 'true',
      featured: formData.get('featured') === 'true',
      categoryId: formData.get('categoryId'),
      tags: formData.get('tags')
    }

    try {
      const response = await fetch(`/api/blog?id=${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        window.location.href = '/admin/blog'
      } else {
        const error = await response.json()
        alert(error.error || 'Une erreur est survenue')
      }
    } catch {
      alert('Une erreur est survenue')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Modifier l'article
      </h3>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Titre
          </label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={post.title}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug
          </label>
          <input
            type="text"
            name="slug"
            id="slug"
            defaultValue={post.slug}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700"
          >
            Extrait
          </label>
          <textarea
            name="excerpt"
            id="excerpt"
            rows={3}
            defaultValue={post.excerpt}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Contenu
          </label>
          <textarea
            name="content"
            id="content"
            rows={10}
            defaultValue={post.content}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="published"
            id="published"
            defaultChecked={post.published}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="published"
            className="ml-2 block text-sm text-gray-900"
          >
            Publié
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            defaultChecked={post.featured}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="featured"
            className="ml-2 block text-sm text-gray-900"
          >
            Mis en avant
          </label>
        </div>
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700"
          >
            Catégorie
          </label>
          <select
            name="categoryId"
            id="categoryId"
            defaultValue={post.categoryId || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Aucune catégorie</option>
            {/* Liste des catégories */}
          </select>
        </div>
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Tags
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            defaultValue={post.tags}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/blog"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </form>
  )
}

// Page principale
export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const resolvedParams = use(params)

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog?id=${resolvedParams.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Erreur lors de la récupération de l\'article')
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-500">Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <Link
          href="/admin/blog"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          Retour à la liste
        </Link>
      </div>
    )
  }

  if (!post) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Modifier l'article
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Modifiez les informations de l'article
              </p>
            </div>
            <Link
              href="/admin/blog"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour aux articles
            </Link>
          </div>

          <div className="mt-8">
            <EditBlogPostForm post={post} />
          </div>
        </div>
      </div>
    </div>
  )
}