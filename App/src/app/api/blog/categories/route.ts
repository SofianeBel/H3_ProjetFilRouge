import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Schéma de validation pour les catégories
const categorySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  slug: z.string().optional(),
})

// GET /api/blog/categories
export async function GET() {
  try {
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

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erreur API catégories:', error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    )
  }
}

// POST /api/blog/categories
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    // Générer le slug si non fourni
    const slug = validatedData.slug || validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const category = await prisma.category.create({
      data: {
        ...validatedData,
        slug
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Erreur API catégories:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de la création de la catégorie" },
      { status: 500 }
    )
  }
}

// PUT /api/blog/categories
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    const validatedData = categorySchema.parse(data)

    const category = await prisma.category.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Erreur API catégories:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la catégorie" },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/categories
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: "ID de la catégorie requis" },
        { status: 400 }
      )
    }

    // Vérifier si la catégorie contient des articles
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    if (category?._count.posts > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer une catégorie contenant des articles" },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: "Catégorie supprimée avec succès" },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur API catégories:', error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la catégorie" },
      { status: 500 }
    )
  }
}