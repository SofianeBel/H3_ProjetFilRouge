import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

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

/**
 * GET /api/blog
 * Récupère la liste des articles avec filtres et pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Construire la requête
    const where = {
      ...(category && { categoryId: category }),
      ...(status === 'published' && { published: true }),
      ...(status === 'draft' && { published: false }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        category: true,
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Erreur API blog:', error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des articles" },
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
    const body = await request.json()
    const { id, ...data } = body
    const validatedData = blogPostSchema.parse(data)

    const post = await prisma.blogPost.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Erreur API blog:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'article" },
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
        { error: "ID de l'article requis" },
        { status: 400 }
      )
    }

    await prisma.blogPost.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "Article supprimé avec succès" },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur API blog:', error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'article" },
      { status: 500 }
    )
  }
} 