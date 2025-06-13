import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import bcrypt from 'bcryptjs'

/**
 * GET /api/profile
 * Récupère les données du profil utilisateur avec consentements
 */
export async function GET(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupération des données utilisateur avec consentements
    const user = await prisma.user.findUnique({
      where: { 
        id: session.user.id,
        active: true // On ne récupère que les comptes actifs
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // Consentements RGPD
        consentRecords: {
          select: {
            id: true,
            consentType: true,
            purpose: true,
            granted: true,
            grantedAt: true,
            revokedAt: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: {
            updatedAt: 'desc'
          }
        },
        // Statistiques
        _count: {
          select: {
            blogPosts: true,
            orders: true,
            exportRequests: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error('Erreur API profile GET:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération du profil",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/profile
 * Met à jour les données du profil utilisateur
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
    const { name, email, oldPassword, newPassword } = body

    // Récupération de l'utilisateur actuel
    const currentUser = await prisma.user.findUnique({
      where: { 
        id: session.user.id,
        active: true
      },
      select: {
        id: true,
        email: true,
        password: true,
        emailVerified: true
      }
    })

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Construction des données à mettre à jour
    const updateData: any = {}

    // Mise à jour du nom
    if (name !== undefined && name.trim() !== '') {
      updateData.name = name.trim()
    }

    // Gestion du changement d'email
    if (email !== undefined && email !== currentUser.email) {
      // Validation basique de l'email
      if (!email.includes('@')) {
        return NextResponse.json(
          { success: false, message: 'Format email invalide' },
          { status: 400 }
        )
      }

      // Vérification que l'email n'est pas déjà utilisé
      const existingUser = await prisma.user.findUnique({
        where: { email, active: true }
      })

      if (existingUser && existingUser.id !== currentUser.id) {
        return NextResponse.json(
          { success: false, message: 'Cette adresse email est déjà utilisée' },
          { status: 400 }
        )
      }

      updateData.email = email
      updateData.emailVerified = null // Nécessite une nouvelle vérification
    }

    // Gestion du changement de mot de passe
    if (newPassword !== undefined) {
      // Vérification que l'ancien mot de passe est fourni
      if (!oldPassword) {
        return NextResponse.json(
          { success: false, message: 'Ancien mot de passe requis' },
          { status: 400 }
        )
      }

      // Vérification que l'utilisateur a bien un mot de passe
      if (!currentUser.password) {
        return NextResponse.json(
          { success: false, message: 'Compte sans mot de passe (OAuth)' },
          { status: 400 }
        )
      }

      // Vérification de l'ancien mot de passe
      const passwordMatch = await bcrypt.compare(oldPassword, currentUser.password)
      if (!passwordMatch) {
        return NextResponse.json(
          { success: false, message: 'Ancien mot de passe incorrect' },
          { status: 400 }
        )
      }

      // Validation du nouveau mot de passe
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
          { status: 400 }
        )
      }

      // Hashage du nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      updateData.password = hashedPassword
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        updatedAt: true
      }
    })

    // Journalisation de l'action
    await prisma.authenticationLog.create({
      data: {
        userId: currentUser.id,
        event: 'PROFILE_UPDATE',
        provider: 'credentials',
        success: true,
        ipAddress: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: JSON.stringify({
          fieldsUpdated: Object.keys(updateData),
          emailChanged: !!updateData.email,
          passwordChanged: !!updateData.password
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: "Profil mis à jour avec succès",
      data: updatedUser,
      requiresEmailVerification: !!updateData.email,
      requiresReauth: !!updateData.password
    })

  } catch (error) {
    console.error('Erreur mise à jour profil:', error)
    
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

/**
 * DELETE /api/profile
 * Suppression du compte utilisateur (soft-delete)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérification que l'utilisateur existe et est actif
    const user = await prisma.user.findUnique({
      where: { 
        id: session.user.id,
        active: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Soft-delete de l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: {
        active: false,
        deletedAt: new Date(),
        // On peut optionnellement anonymiser certaines données
        email: `deleted_${user.id}@deleted.local`,
        name: 'Compte supprimé'
      }
    })

    // Suppression de toutes les sessions actives
    await prisma.session.deleteMany({
      where: { userId: user.id }
    })

    // Journalisation de la suppression
    await prisma.authenticationLog.create({
      data: {
        userId: user.id,
        event: 'ACCOUNT_DELETED',
        provider: 'self_service',
        success: true,
        ipAddress: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: JSON.stringify({
          deletionType: 'soft_delete',
          deletedAt: new Date().toISOString()
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: "Compte supprimé avec succès. Vos données seront définitivement effacées dans 30 jours."
    })

  } catch (error) {
    console.error('Erreur suppression compte:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la suppression du compte",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 