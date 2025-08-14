import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * Schéma de validation pour la mise à jour d'adresse
 */
const UpdateAddressSchema = z.object({
  type: z.enum(['BILLING', 'SHIPPING', 'BOTH']).optional(),
  label: z.string().optional(),
  company: z.string().optional(),
  firstName: z.string().min(1, 'Le prénom est requis').optional(),
  lastName: z.string().min(1, 'Le nom est requis').optional(),
  addressLine1: z.string().min(1, 'L\'adresse est requise').optional(),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'La ville est requise').optional(),
  postalCode: z.string().min(5, 'Le code postal doit contenir au moins 5 caractères').optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  isDefault: z.boolean().optional()
})

/**
 * GET /api/profile/addresses/[id]
 * Récupère une adresse spécifique de l'utilisateur
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentification requise' },
        { status: 401 }
      )
    }

    const { id } = await params

    const address = await prisma.userAddress.findFirst({
      where: {
        id,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!address) {
      return NextResponse.json(
        { success: false, message: 'Adresse non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: address
    })

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'adresse:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/profile/addresses/[id]
 * Met à jour une adresse de l'utilisateur
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentification requise' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = UpdateAddressSchema.parse(body)

    // Vérifier que l'adresse appartient à l'utilisateur
    const existingAddress = await prisma.userAddress.findFirst({
      where: {
        id,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { success: false, message: 'Adresse non trouvée' },
        { status: 404 }
      )
    }

    // Si cette adresse est définie comme par défaut, 
    // désactiver les autres adresses par défaut du même type
    if (validatedData.isDefault) {
      const targetType = validatedData.type || existingAddress.type
      await prisma.userAddress.updateMany({
        where: {
          userId: session.user.id,
          type: targetType,
          isDefault: true,
          isActive: true,
          id: { not: id }
        },
        data: {
          isDefault: false
        }
      })
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json({
      success: true,
      data: updatedAddress,
      message: 'Adresse mise à jour avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'adresse:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Données invalides",
          errors: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/profile/addresses/[id]
 * Supprime (désactive) une adresse de l'utilisateur
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentification requise' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Vérifier que l'adresse appartient à l'utilisateur
    const existingAddress = await prisma.userAddress.findFirst({
      where: {
        id,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { success: false, message: 'Adresse non trouvée' },
        { status: 404 }
      )
    }

    // Soft delete : marquer comme inactive
    await prisma.userAddress.update({
      where: { id },
      data: {
        isActive: false,
        isDefault: false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Adresse supprimée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'adresse:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

