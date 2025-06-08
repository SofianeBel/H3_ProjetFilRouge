import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

/**
 * Schéma de validation pour les catégories
 */
const categorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Couleur hex invalide").optional(),
})

/**
 * GET /api/categories
 * Récupère la liste des catégories
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { 
            posts: { 
              where: { published: true } 
            } 
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: categories
    })

  } catch (error) {
    console.error('Erreur API categories GET:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération des catégories" 
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/categories
 * Crée une nouvelle catégorie
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const validatedData = categorySchema.parse(body)
    
    // Vérification de l'unicité du slug
    const existingCategory = await prisma.category.findUnique({
      where: { slug: validatedData.slug }
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Une catégorie avec ce slug existe déjà" 
        },
        { status: 400 }
      )
    }

    // Création de la catégorie
    const category = await prisma.category.create({
      data: validatedData,
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Catégorie créée avec succès",
        data: category
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur API categories POST:', error)

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
        message: "Erreur lors de la création de la catégorie" 
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/categories
 * Met à jour une catégorie existante
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: "L'ID de la catégorie est requis" 
        },
        { status: 400 }
      )
    }

    // Validation des données
    const validatedData = categorySchema.partial().parse(updateData)
    
    // Vérification que la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })
    
    if (!existingCategory) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Catégorie non trouvée" 
        },
        { status: 404 }
      )
    }

    // Si on change le slug, vérifier l'unicité
    if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Une catégorie avec ce slug existe déjà" 
          },
          { status: 400 }
        )
      }
    }

    // Mise à jour de la catégorie
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Catégorie mise à jour avec succès",
        data: updatedCategory
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur API categories PUT:', error)

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
        message: "Erreur lors de la mise à jour de la catégorie" 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/categories
 * Supprime une catégorie
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: "L'ID de la catégorie est requis" 
        },
        { status: 400 }
      )
    }

    // Vérification que la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { posts: true } }
      }
    })
    
    if (!existingCategory) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Catégorie non trouvée" 
        },
        { status: 404 }
      )
    }

    // Vérification qu'il n'y a pas d'articles liés
    if (existingCategory._count.posts > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Impossible de supprimer une catégorie qui contient des articles" 
        },
        { status: 400 }
      )
    }

    // Suppression de la catégorie
    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Catégorie supprimée avec succès"
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur API categories DELETE:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la suppression de la catégorie" 
      },
      { status: 500 }
    )
  }
} 