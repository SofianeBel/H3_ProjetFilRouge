import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

/**
 * Schéma de validation pour les articles de blog
 */
const blogPostSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  excerpt: z.string().min(10, "L'extrait doit contenir au moins 10 caractères"),
  content: z.string().min(50, "Le contenu doit contenir au moins 50 caractères"),
  categoryId: z.string().optional(),
  tags: z.string(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  coverImage: z.string().optional(),
  ogImage: z.string().optional(),
})

// Fonction utilitaire pour convertir en booléen
function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  if (typeof value === 'number') return value === 1
  return false
}

/**
 * GET /api/blog
 * Récupère la liste des articles avec filtres et pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Construire la clause where
    const where: Prisma.BlogPostWhereInput = {}
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (status) {
      where.published = status === 'published' ? 1 : 0
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } }
      ]
    }

    const posts = await prisma.blogPost.findMany({
      where,
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
    const formattedPosts = posts.map(post => ({
      ...post,
      published: toBoolean(post.published),
      createdAt: new Date(post.createdAt),
      category: post.category ? {
        ...post.category,
        createdAt: new Date(post.category.createdAt),
        updatedAt: new Date(post.category.updatedAt)
      } : null
    }))

    return NextResponse.json(formattedPosts)
  } catch (error) {
    console.error('Erreur API blog:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des articles' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/blog
 * Crée un nouveau article de blog
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = blogPostSchema.parse(body)
    
    const post = await prisma.blogPost.create({
      data: {
        ...validatedData,
        published: validatedData.published ? 1 : 0,
        featured: validatedData.featured ? 1 : 0,
        categoryId: validatedData.categoryId || null,
        slug: validatedData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Erreur API blog:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de la création de l'article" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/blog
 * Met à jour un article existant
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'article manquant' },
        { status: 400 }
      )
    }

    const data = await request.json()

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        published: data.published,
        featured: data.featured,
        categoryId: data.categoryId || null,
        tags: data.tags
      }
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Erreur API blog:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour de l\'article' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/blog
 * Supprime un article
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'article manquant' },
        { status: 400 }
      )
    }

    // Vérifier d'abord si l'article existe
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        author: true
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer l'article
    await prisma.blogPost.delete({
      where: { id },
      include: {
        category: true,
        author: true
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Article supprimé avec succès'
    })
  } catch (error) {
    console.error('Erreur API blog:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Article non trouvé' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression de l\'article' },
      { status: 500 }
    )
  }
} 