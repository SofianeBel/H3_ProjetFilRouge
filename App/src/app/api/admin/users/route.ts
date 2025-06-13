import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

/**
 * GET /api/admin/users
 * Récupère la liste des utilisateurs avec pagination et filtres
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
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const active = searchParams.get('active') // 'true', 'false', ou null pour tous
    
    // Calcul de l'offset pour la pagination
    const offset = (page - 1) * limit

    // Construction du filtre where
    const where: any = {}
    
    // Filtre par recherche (nom ou email)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Filtre par rôle
    if (role && ['CLIENT', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      where.role = role
    }
    
    // Filtre par statut actif
    if (active === 'true') {
      where.active = true
    } else if (active === 'false') {
      where.active = false
    }

    // Récupération des utilisateurs avec pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true // Nombre de commandes par utilisateur
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.user.count({ where })
    ])

    // Calcul des métadonnées de pagination
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        users,
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
    console.error('Erreur API admin users:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération des utilisateurs",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/users
 * Met à jour un utilisateur (rôle, statut actif)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role as string)) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { id, role, active } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID utilisateur requis" },
        { status: 400 }
      )
    }

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

    // Seuls les SUPER_ADMIN peuvent modifier les rôles ADMIN
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
    
    if (active !== undefined && typeof active === 'boolean') {
      updateData.active = active
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
        active: true,
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

/**
 * DELETE /api/admin/users
 * Soft-delete d'un utilisateur (active = false)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const session = await auth()
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Seuls les super-administrateurs peuvent supprimer des utilisateurs' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID utilisateur requis" },
        { status: 400 }
      )
    }

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

    // Empêcher la suppression de son propre compte
    if (existingUser.id === session.user.id) {
      return NextResponse.json(
        { success: false, message: "Impossible de supprimer son propre compte" },
        { status: 400 }
      )
    }

    // Soft-delete : désactiver l'utilisateur
    const deletedUser = await prisma.user.update({
      where: { id },
      data: { 
        active: false,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        active: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Utilisateur désactivé avec succès",
      data: deletedUser
    })

  } catch (error) {
    console.error('Erreur suppression utilisateur:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la suppression",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 