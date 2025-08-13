import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * Schéma de validation pour les adresses
 */
const AddressSchema = z.object({
  type: z.enum(['BILLING', 'SHIPPING', 'BOTH']),
  label: z.string().optional(),
  company: z.string().optional(),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  addressLine1: z.string().min(1, 'L\'adresse est requise'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'La ville est requise'),
  postalCode: z.string().min(5, 'Le code postal doit contenir au moins 5 caractères'),
  region: z.string().optional(),
  country: z.string().default('FR'),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false)
})

/**
 * GET /api/profile/addresses
 * Récupère toutes les adresses de l'utilisateur connecté
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentification requise' },
        { status: 401 }
      )
    }

    const addresses = await prisma.userAddress.findMany({
      where: {
        userId: session.user.id,
        isActive: true
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: addresses
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des adresses:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/profile/addresses
 * Crée une nouvelle adresse pour l'utilisateur connecté
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentification requise' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = AddressSchema.parse(body)

    // Si cette adresse est définie comme par défaut, 
    // désactiver l'ancienne adresse par défaut du même type
    if (validatedData.isDefault) {
      await prisma.userAddress.updateMany({
        where: {
          userId: session.user.id,
          type: validatedData.type,
          isDefault: true,
          isActive: true
        },
        data: {
          isDefault: false
        }
      })
    }

    const address = await prisma.userAddress.create({
      data: {
        ...validatedData,
        userId: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      data: address,
      message: 'Adresse créée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la création de l\'adresse:', error)
    
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

