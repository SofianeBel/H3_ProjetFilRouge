import { prisma } from '@/lib/prisma'
import CategoriesList from './CategoriesList'

export default async function CategoriesData() {
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
  return <CategoriesList categories={categories} />
} 