'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from './types'

// Composant pour afficher un article
function BlogPostCard({ post, onDelete }: { post: BlogPost; onDelete: (id: string) => void }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
      setIsDeleting(true)
      try {
        const response = await fetch(`/api/blog?id=${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          onDelete(id)
        } else {
          const error = await response.json()
          throw new Error(error.message || 'Une erreur est survenue lors de la suppression')
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Une erreur est survenue')
      } finally {
        setIsDeleting(false)
      }
    }
  }

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
            disabled={isDeleting}
            className={`text-red-600 hover:text-red-800 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Composant pour la liste des articles (client)
function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des articles')
      }
      const data = await response.json()
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = (id: string) => {
    setPosts(posts.filter(post => post.id !== id))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => {
            setError(null)
            setLoading(true)
            fetchPosts()
          }}
          className="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} onDelete={handleDelete} />
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
              className="flex-1 p-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <select className="p-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Toutes les catégories</option>
              {/* Liste des catégories */}
            </select>
            <select className="p-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Tous les statuts</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
            </select>
          </div>
        </div>

        {/* Liste des articles */}
        <BlogList />
      </main>
    </div>
  )
}