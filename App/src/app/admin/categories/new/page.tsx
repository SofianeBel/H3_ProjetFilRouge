'use client'

import Link from 'next/link'

export default function NewCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Nouvelle catégorie
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Créez une nouvelle catégorie pour votre blog
              </p>
            </div>
            <Link
              href="/admin/categories"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour aux catégories
            </Link>
          </div>

          <div className="mt-8">
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
                    window.location.href = '/admin/categories'
                  } else {
                    const error = await response.json()
                    alert(error.error || 'Une erreur est survenue')
                  }
                } catch {
                  alert('Une erreur est survenue')
                }
              }}
              className="bg-white rounded-lg shadow p-6"
            >
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
                <div className="flex justify-end space-x-3">
                  <Link
                    href="/admin/categories"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Annuler
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Créer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 