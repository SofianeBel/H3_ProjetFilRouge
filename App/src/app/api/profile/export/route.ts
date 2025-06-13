import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

/**
 * POST /api/profile/export
 * Génère un export des données utilisateur (RGPD)
 */
export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérification que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Collecte de toutes les données utilisateur
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        // Consentements RGPD
        consentRecords: {
          orderBy: { createdAt: 'desc' }
        },
        // Demandes d'export précédentes
        exportRequests: {
          orderBy: { requestedAt: 'desc' },
          take: 10 // Limiter aux 10 dernières
        },
        // Logs d'authentification (30 derniers jours)
        authLogs: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 jours
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 100 // Limiter à 100 logs max
        },
        // Commandes
        orders: {
          orderBy: { createdAt: 'desc' }
        },
        // Articles de blog (si applicable)
        blogPosts: {
          select: {
            id: true,
            title: true,
            slug: true,
            published: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Impossible de récupérer les données' },
        { status: 500 }
      )
    }

    // Création de l'export JSON structuré
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        userId: userData.id,
        dataTypes: [
          'profile',
          'consents',
          'orders',
          'authentication_logs',
          'blog_posts'
        ]
      },
      profile: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        emailVerified: userData.emailVerified,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      },
      consents: userData.consentRecords.map(consent => ({
        type: consent.consentType,
        purpose: consent.purpose,
        granted: consent.granted,
        grantedAt: consent.grantedAt,
        revokedAt: consent.revokedAt,
        ipAddress: consent.ipAddress,
        createdAt: consent.createdAt,
        updatedAt: consent.updatedAt
      })),
      orders: userData.orders.map(order => ({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        createdAt: order.createdAt,
        metadata: order.metadata
      })),
      authenticationLogs: userData.authLogs.map(log => ({
        event: log.event,
        provider: log.provider,
        success: log.success,
        ipAddress: log.ipAddress,
        location: log.location,
        createdAt: log.createdAt
      })),
      blogPosts: userData.blogPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        published: post.published,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      })),
      statistics: {
        totalConsents: userData.consentRecords.length,
        totalOrders: userData.orders.length,
        totalBlogPosts: userData.blogPosts.length,
        totalAuthLogs: userData.authLogs.length
      }
    }

    // Conversion en JSON avec formatage
    const jsonData = JSON.stringify(exportData, null, 2)
    const fileSize = Buffer.byteLength(jsonData, 'utf8')

    // Enregistrement de la demande d'export
    const exportRequest = await prisma.dataExportRequest.create({
      data: {
        userId: user.id,
        status: 'COMPLETED',
        requestedAt: new Date(),
        processedAt: new Date(),
        completedAt: new Date(),
        fileSize: fileSize,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expire dans 24h
        ipAddress: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown'
      }
    })

    // Journalisation de l'action
    await prisma.authenticationLog.create({
      data: {
        userId: user.id,
        event: 'PROFILE_UPDATE',
        provider: 'data_export',
        success: true,
        ipAddress: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: JSON.stringify({
          action: 'data_export',
          exportRequestId: exportRequest.id,
          fileSize: fileSize,
          dataTypes: exportData.metadata.dataTypes
        })
      }
    })

    // Retour du fichier JSON en download direct
    const response = new NextResponse(jsonData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="donnees-personnelles-${user.id}-${new Date().toISOString().split('T')[0]}.json"`,
        'Content-Length': fileSize.toString()
      }
    })

    return response

  } catch (error) {
    console.error('Erreur export données:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de l'export des données",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 