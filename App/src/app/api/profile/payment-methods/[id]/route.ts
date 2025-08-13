import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

/**
 * Schéma de validation pour la mise à jour d'une méthode de paiement
 */
const UpdatePaymentMethodSchema = z.object({
  label: z.string().optional(),
  isDefault: z.boolean().optional()
})

/**
 * GET /api/profile/payment-methods/[id]
 * Récupère une méthode de paiement spécifique de l'utilisateur
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

    const paymentMethod = await prisma.userPaymentMethod.findFirst({
      where: {
        id,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Méthode de paiement non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: paymentMethod
    })

  } catch (error) {
    console.error('Erreur lors de la récupération de la méthode de paiement:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/profile/payment-methods/[id]
 * Met à jour une méthode de paiement de l'utilisateur
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
    const validatedData = UpdatePaymentMethodSchema.parse(body)

    // Vérifier que la méthode de paiement appartient à l'utilisateur
    const existingPaymentMethod = await prisma.userPaymentMethod.findFirst({
      where: {
        id,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!existingPaymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Méthode de paiement non trouvée' },
        { status: 404 }
      )
    }

    // Si cette méthode est définie comme par défaut, 
    // désactiver les autres méthodes par défaut
    if (validatedData.isDefault) {
      await prisma.userPaymentMethod.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
          isActive: true,
          id: { not: id }
        },
        data: {
          isDefault: false
        }
      })
    }

    const updatedPaymentMethod = await prisma.userPaymentMethod.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json({
      success: true,
      data: updatedPaymentMethod,
      message: 'Méthode de paiement mise à jour avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la méthode de paiement:', error)
    
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
 * DELETE /api/profile/payment-methods/[id]
 * Supprime (désactive) une méthode de paiement de l'utilisateur
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

    // Vérifier que la méthode de paiement appartient à l'utilisateur
    const existingPaymentMethod = await prisma.userPaymentMethod.findFirst({
      where: {
        id,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!existingPaymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Méthode de paiement non trouvée' },
        { status: 404 }
      )
    }

    // Si la méthode de paiement a un ID Stripe, la détacher du client Stripe
    if (existingPaymentMethod.stripePaymentMethodId) {
      try {
        await stripe.paymentMethods.detach(existingPaymentMethod.stripePaymentMethodId)
      } catch (stripeError) {
        console.warn('Erreur lors du détachement de la méthode Stripe:', stripeError)
        // On continue même si le détachement échoue
      }
    }

    // Soft delete : marquer comme inactive
    await prisma.userPaymentMethod.update({
      where: { id },
      data: {
        isActive: false,
        isDefault: false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Méthode de paiement supprimée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression de la méthode de paiement:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

