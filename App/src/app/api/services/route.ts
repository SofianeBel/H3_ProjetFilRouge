import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/services
 * Récupère la liste des services publiés
 */
export async function GET() {
  try {
    // Récupération des services publiés, triés par featured puis par nom
    const services = await prisma.service.findMany({
      where: {
        published: true
      },
      orderBy: [
        { featured: 'desc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        currency: true,
        purchaseType: true,
        stripeProductId: true,
        stripePriceId: true,
        featured: true,
        category: true,
        icon: true,
        color: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: services
    })

  } catch (error) {
    console.error('Erreur API services:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération des services",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 