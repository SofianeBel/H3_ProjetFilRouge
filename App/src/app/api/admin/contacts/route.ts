import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/contacts
 * Récupère la liste des contacts avec pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    
    // Calcul de l'offset pour la pagination
    const offset = (page - 1) * limit

    // Construction du filtre
    const where = status ? { status: status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED' } : {}

    // Récupération des contacts avec pagination
    const [contacts, totalCount] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.contact.count({ where })
    ])

    // Calcul des métadonnées de pagination
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    })

  } catch (error) {
    console.error('Erreur API admin contacts:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération des contacts",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/contacts
 * Met à jour le statut d'un contact
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "ID et statut requis" },
        { status: 400 }
      )
    }

    // Vérification que le statut est valide
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Statut invalide" },
        { status: 400 }
      )
    }

    // Mise à jour du contact
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({
      success: true,
      message: "Statut mis à jour avec succès",
      data: updatedContact
    })

  } catch (error) {
    console.error('Erreur mise à jour contact:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la mise à jour",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 