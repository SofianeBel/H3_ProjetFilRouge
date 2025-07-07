import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { stripe } from '@/lib/stripe'

/**
 * GET /api/admin/orders
 * Récupère la liste des commandes avec pagination et filtres
 */
export async function GET(request: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role as string)) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''
    const refresh = searchParams.get('refresh') === 'true' // Force refresh depuis Stripe
    
    // Calcul de l'offset pour la pagination
    const offset = (page - 1) * limit

    // Construction du filtre where
    const where: any = {}
    
    // Filtre par statut
    if (status) {
      where.status = status
    }
    
    // Filtre par recherche (email utilisateur ou ID Stripe)
    if (search) {
      where.OR = [
        { stripePaymentIntentId: { contains: search } },
        { 
          user: {
            email: { contains: search, mode: 'insensitive' }
          }
        }
      ]
    }

    // Si refresh demandé, on peut synchroniser avec Stripe ici
    if (refresh) {
      console.log('🔄 Refresh des commandes depuis Stripe demandé')
      // TODO: Implémenter la synchronisation avec Stripe si nécessaire
    }

    // Récupération des commandes avec pagination
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.order.count({ where })
    ])

    // Calcul des métadonnées de pagination
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        orders,
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
    console.error('Erreur API admin orders:', error)
    
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