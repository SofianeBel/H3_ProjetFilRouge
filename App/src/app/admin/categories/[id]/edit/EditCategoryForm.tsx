'use client'

import Link from 'next/link'

type Category = {
  id: string
  name: string
  description: string | null
  slug: string
}

export default function EditCategoryForm({ category }: { category: Category }) {
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
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: category.id, ...data }),
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
            defaultValue={category.name}
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
            placeholder="Entrez le nom de la catégorie"
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
            defaultValue={category.description || ''}
            className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
            placeholder="Entrez la description de la catégorie"
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
            Enregistrer
          </button>
        </div>
      </div>
    </form>
  )
} 