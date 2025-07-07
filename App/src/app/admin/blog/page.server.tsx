import { prisma } from '@/lib/prisma'

export async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    select: {
      id: true,
      title: true,
      excerpt: true,
      published: true,
      createdAt: true,
      category: {
        select: {
          name: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          slug: true,
          description: true,
          color: true
        }
      },
      author: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Convertir les données en format attendu
  return posts.map(post => ({
    ...post,
    published: Boolean(post.published),
    createdAt: new Date(post.createdAt),
    category: post.category ? {
      ...post.category,
      createdAt: new Date(post.category.createdAt),
      updatedAt: new Date(post.category.updatedAt)
    } : null
  }))
} 