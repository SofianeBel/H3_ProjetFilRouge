import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/services/[slug]/plans
 * Récupère tous les plans d'un service par son slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Récupération du service pour vérifier qu'il existe
    const service = await prisma.service.findUnique({
      where: {
        slug: slug,
        published: true
      }
    })

    if (!service) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Service non trouvé" 
        },
        { status: 404 }
      )
    }

    // Récupération des plans du service
    const plans = await prisma.servicePlan.findMany({
      where: {
        serviceId: service.id,
        published: true
      },
      orderBy: [
        { recommended: 'desc' },
        { popular: 'desc' },
        { price: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: {
        service: {
          id: service.id,
          name: service.name,
          slug: service.slug,
          description: service.description
        },
        plans
      }
    })

  } catch (error) {
    console.error('Erreur API plans:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération des plans",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 