import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

/**
 * GET /api/admin/users/[id]
 * Récupère les détails d'un utilisateur spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de l'authentification et du rôle admin
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role as string)) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Récupération de l'utilisateur avec ses statistiques
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // Statistiques des commandes
        _count: {
          select: {
            blogPosts: true,
            consentRecords: true,
            exportRequests: true,
            authLogs: true
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
    console.error('Erreur API admin user detail:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération de l'utilisateur",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Met à jour un utilisateur spécifique
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de l'authentification et du rôle admin
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role as string)) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { role } = body

    // Vérification que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "Utilisateur non trouvé" },
        { status: 404 }
      )
    }

    // Empêcher la modification de son propre compte
    if (existingUser.id === session.user.id) {
      return NextResponse.json(
        { success: false, message: "Impossible de modifier son propre compte" },
        { status: 400 }
      )
    }

    // Seuls les SUPER_ADMIN peuvent modifier les comptes SUPER_ADMIN
    if (existingUser.role === 'SUPER_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: "Seuls les super-administrateurs peuvent modifier ce compte" },
        { status: 403 }
      )
    }

    // Construction des données à mettre à jour
    const updateData: any = {}
    
    if (role !== undefined && ['CLIENT', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      // Seuls les SUPER_ADMIN peuvent attribuer le rôle SUPER_ADMIN
      if (role === 'SUPER_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { success: false, message: "Seuls les super-administrateurs peuvent attribuer ce rôle" },
          { status: 403 }
        )
      }
      updateData.role = role
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      data: updatedUser
    })

  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error)
    
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