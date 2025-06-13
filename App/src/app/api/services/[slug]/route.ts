import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/services/[slug]
 * Récupère un service par son slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Récupération du service par slug
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

    return NextResponse.json({
      success: true,
      data: service
    })

  } catch (error) {
    console.error('Erreur API service:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération du service",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 