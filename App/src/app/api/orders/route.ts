import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

/**
 * GET /api/orders
 * Récupère les commandes de l'utilisateur connecté
 */
export async function GET(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentification requise' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    
    // Calcul de l'offset pour la pagination
    const offset = (page - 1) * limit

    // Construction du filtre where
    const where: any = {
      userId: session.user.id
    }
    
    // Filtre par statut si spécifié
    if (status) {
      where.status = status
    }

    // Récupération des commandes avec pagination
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          stripePaymentIntentId: true,
          amount: true,
          currency: true,
          status: true,
          metadata: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.order.count({ where })
    ])

    // Calcul des informations de pagination
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage
        }
      }
    })

  } catch (error) {
    console.error('Erreur récupération commandes client:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération des commandes",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

