import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

/**
 * GET /api/orders/[id]
 * Récupère une commande spécifique de l'utilisateur connecté
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de l'authentification
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentification requise' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Récupération de la commande
    const order = await prisma.order.findFirst({
      where: {
        id: id,
        userId: session.user.id // S'assurer que l'utilisateur ne peut voir que ses commandes
      },
      select: {
        id: true,
        stripePaymentIntentId: true,
        amount: true,
        currency: true,
        status: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })

  } catch (error) {
    console.error('Erreur récupération commande:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération de la commande",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

