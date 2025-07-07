import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

/**
 * PATCH /api/profile/consents
 * Met à jour les consentements RGPD de l'utilisateur
 */
export async function PATCH(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { consents } = body

    // Validation du format des consentements
    if (!Array.isArray(consents)) {
      return NextResponse.json(
        { success: false, message: 'Format de consentements invalide' },
        { status: 400 }
      )
    }

    // Vérification que l'utilisateur existe et est actif
    const user = await prisma.user.findUnique({
      where: { 
        id: session.user.id
      },
      select: {
        id: true,
        active: true
      }
    })

    if (!user || !user.active) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Traitement de chaque consentement
    const results = []
    
    for (const consent of consents) {
      const { consentType, purpose, granted } = consent

      // Validation des champs requis
      if (!consentType || !purpose || typeof granted !== 'boolean') {
        continue // On ignore les consentements mal formés
      }

      // Types de consentements autorisés
      const allowedTypes = ['marketing', 'analytics', 'cookies', 'profiling', 'newsletter']
      if (!allowedTypes.includes(consentType)) {
        continue
      }

      try {
        // Upsert du consentement
        const consentRecord = await prisma.dataProcessingConsent.upsert({
          where: {
            userId_consentType: {
              userId: user.id,
              consentType: consentType
            }
          },
          update: {
            granted: granted,
            grantedAt: granted ? new Date() : null,
            revokedAt: granted ? null : new Date(),
            purpose: purpose,
            ipAddress: request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            updatedAt: new Date()
          },
          create: {
            userId: user.id,
            consentType: consentType,
            purpose: purpose,
            granted: granted,
            grantedAt: granted ? new Date() : null,
            revokedAt: granted ? null : new Date(),
            ipAddress: request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown'
          },
          select: {
            id: true,
            consentType: true,
            granted: true,
            grantedAt: true,
            revokedAt: true,
            updatedAt: true
          }
        })

        results.push(consentRecord)
      } catch (error) {
        console.error(`Erreur consentement ${consentType}:`, error)
        // On continue avec les autres consentements
      }
    }

    // Journalisation de l'action
    await prisma.authenticationLog.create({
      data: {
        userId: user.id,
        event: 'PROFILE_UPDATE',
        provider: 'consent_management',
        success: true,
        ipAddress: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: JSON.stringify({
          action: 'consent_update',
          consentsUpdated: results.length,
          consentTypes: results.map(r => r.consentType)
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: "Consentements mis à jour avec succès",
      data: results
    })

  } catch (error) {
    console.error('Erreur mise à jour consentements:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la mise à jour des consentements",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 