import { use } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditCategoryForm from './EditCategoryForm'

// Composant serveur pour les données
async function CategoryData({ id }: { id: string }) {
  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) {
    notFound()
  }

  return <EditCategoryForm category={category} />
}

// Page principale
export default function EditCategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const id = use(Promise.resolve(params.id))

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Modifier la catégorie
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Modifiez les informations de la catégorie
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
            <CategoryData id={id} />
          </div>
        </div>
      </div>
    </div>
  )
} 