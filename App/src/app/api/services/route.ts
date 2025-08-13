import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/services
 * Récupère la liste des services avec support de recherche et filtres
 * 
 * Paramètres de requête supportés :
 * - search: recherche textuelle dans nom et description
 * - category: filtrage par catégorie
 * - minPrice: prix minimum en centimes
 * - maxPrice: prix maximum en centimes
 * - featured: filtrer les services mis en avant (true/false)
 * - sortBy: tri (name, price, featured, created)
 * - sortOrder: ordre (asc/desc)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extraction des paramètres de recherche et filtres
    const search = searchParams.get('search')?.trim()
    const category = searchParams.get('category')?.trim()
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const featuredFilter = searchParams.get('featured')
    const sortBy = searchParams.get('sortBy') || 'featured'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Construction du where clause dynamique
    const whereClause: any = {
      published: true
    }

    // Recherche textuelle dans nom et description
    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Filtrage par catégorie
    if (category && category !== 'all') {
      whereClause.category = category
    }

    // Filtrage par prix (en gérant les services sans prix)
    if (minPrice || maxPrice) {
      const priceConditions: any = {}
      
      if (minPrice) {
        priceConditions.gte = parseInt(minPrice)
      }
      
      if (maxPrice) {
        priceConditions.lte = parseInt(maxPrice)
      }
      
      whereClause.AND = [
        {
          price: {
            not: null
          }
        },
        {
          price: priceConditions
        }
      ]
    }

    // Filtrage par featured
    if (featuredFilter === 'true') {
      whereClause.featured = true
    }

    // Construction de l'ordre de tri
    let orderBy: any = []
    
    switch (sortBy) {
      case 'name':
        orderBy = [{ name: sortOrder }]
        break
      case 'price':
        orderBy = [
          { price: sortOrder },
          { featured: 'desc' }, // Fallback pour les services sans prix
          { name: 'asc' }
        ]
        break
      case 'created':
        orderBy = [{ createdAt: sortOrder }]
        break
      case 'featured':
      default:
        orderBy = [
          { featured: 'desc' },
          { name: 'asc' }
        ]
        break
    }

    // Récupération des services avec filtres
    const services = await prisma.service.findMany({
      where: whereClause,
      orderBy: orderBy,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        longDescription: true,
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
        updatedAt: true,
        plans: {
          where: {
            published: true
          },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            popular: true,
            recommended: true,
            features: true
          },
          orderBy: {
            price: 'asc'
          }
        }
      }
    })

    // Récupération des catégories disponibles pour les filtres
    const categories = await prisma.service.findMany({
      where: {
        published: true,
        category: {
          not: null
        }
      },
      select: {
        category: true
      },
      distinct: ['category']
    })

    // Extraction des gammes de prix pour les filtres
    const priceStats = await prisma.service.aggregate({
      where: {
        published: true,
        price: {
          not: null
        }
      },
      _min: {
        price: true
      },
      _max: {
        price: true
      }
    })

    return NextResponse.json({
      success: true,
      data: services,
      metadata: {
        totalCount: services.length,
        categories: categories
          .map(s => s.category)
          .filter(Boolean)
          .sort(),
        priceRange: {
          min: priceStats._min.price || 0,
          max: priceStats._max.price || 0
        },
        appliedFilters: {
          search,
          category,
          minPrice: minPrice ? parseInt(minPrice) : null,
          maxPrice: maxPrice ? parseInt(maxPrice) : null,
          featured: featuredFilter === 'true',
          sortBy,
          sortOrder
        }
      }
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