import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

/**
 * Schéma de validation pour les articles de blog
 */
const blogPostSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  excerpt: z.string().min(10, "L'extrait doit contenir au moins 10 caractères"),
  content: z.string().min(50, "Le contenu doit contenir au moins 50 caractères"),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  readTime: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  coverImage: z.string().url().optional(),
  ogImage: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
})

/**
 * GET /api/blog
 * Récupère la liste des articles avec filtres et pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const published = searchParams.get('published')
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured')
    
    const offset = (page - 1) * limit

    // Construction des filtres pour Prisma
    const where: {
      published?: boolean;
      categoryId?: string;
      featured?: boolean;
    } = {}
    if (published !== null) {
      where.published = published === 'true'
    }
    if (categoryId) {
      where.categoryId = categoryId
    }
    if (featured !== null) {
      where.featured = featured === 'true'
    }

    // Récupération des articles avec pagination
    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          category: true,
          author: {
            select: { id: true, name: true, image: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.blogPost.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    })

  } catch (error) {
    console.error('Erreur API blog GET:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération des articles" 
      },
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
    
    // Validation des données
    const validatedData = blogPostSchema.parse(body)
    
    // Vérification de l'unicité du slug
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug }
    })
    
    if (existingPost) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Un article avec ce slug existe déjà" 
        },
        { status: 400 }
      )
    }

    // Création de l'article
    const post = await prisma.blogPost.create({
      data: {
        ...validatedData,
        tags: JSON.stringify(validatedData.tags),
        publishedAt: validatedData.published ? new Date() : null
      },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, image: true }
        }
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Article créé avec succès",
        data: post
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur API blog POST:', error)

    // Erreur de validation Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Données invalides", 
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la création de l'article" 
      },
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
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: "L'ID de l'article est requis" 
        },
        { status: 400 }
      )
    }

    // Validation des données
    const validatedData = blogPostSchema.partial().parse(updateData)
    
    // Vérification que l'article existe
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })
    
    if (!existingPost) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Article non trouvé" 
        },
        { status: 404 }
      )
    }

    // Si on change le slug, vérifier l'unicité
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Un article avec ce slug existe déjà" 
          },
          { status: 400 }
        )
      }
    }

    // Préparation des données de mise à jour
    const updatePayload: Record<string, unknown> = {
      ...validatedData,
      ...(validatedData.tags && { tags: JSON.stringify(validatedData.tags) }),
      ...(validatedData.published !== undefined && {
        publishedAt: validatedData.published ? new Date() : null
      })
    }

    // Mise à jour de l'article
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updatePayload,
      include: {
        category: true,
        author: {
          select: { id: true, name: true, image: true }
        }
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Article mis à jour avec succès",
        data: updatedPost
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur API blog PUT:', error)

    // Erreur de validation Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Données invalides", 
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la mise à jour de l'article" 
      },
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
        { 
          success: false, 
          message: "L'ID de l'article est requis" 
        },
        { status: 400 }
      )
    }

    // Vérification que l'article existe
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })
    
    if (!existingPost) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Article non trouvé" 
        },
        { status: 404 }
      )
    }

    // Suppression de l'article
    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Article supprimé avec succès"
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur API blog DELETE:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la suppression de l'article" 
      },
      { status: 500 }
    )
  }
} 