import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

/**
 * Schéma de validation pour les méthodes de paiement
 */
const PaymentMethodSchema = z.object({
  type: z.enum(['CARD', 'PAYPAL', 'BANK_TRANSFER', 'SEPA']),
  label: z.string().optional(),
  stripePaymentMethodId: z.string().optional(),
  paypalEmail: z.string().email().optional(),
  isDefault: z.boolean().default(false)
})

/**
 * GET /api/profile/payment-methods
 * Récupère toutes les méthodes de paiement de l'utilisateur connecté
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

    const paymentMethods = await prisma.userPaymentMethod.findMany({
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
      data: paymentMethods
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des méthodes de paiement:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/profile/payment-methods
 * Crée une nouvelle méthode de paiement pour l'utilisateur connecté
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
    const validatedData = PaymentMethodSchema.parse(body)

    // Préparation des données pour la création
    const paymentMethodData: any = {
      userId: session.user.id,
      type: validatedData.type,
      label: validatedData.label,
      isDefault: validatedData.isDefault
    }

    // Traitement spécifique selon le type de méthode de paiement
    if (validatedData.type === 'CARD' && validatedData.stripePaymentMethodId) {
      try {
        // Récupérer les détails de la carte depuis Stripe
        const stripePaymentMethod = await stripe.paymentMethods.retrieve(
          validatedData.stripePaymentMethodId
        )

        if (stripePaymentMethod.card) {
          paymentMethodData.stripePaymentMethodId = validatedData.stripePaymentMethodId
          paymentMethodData.cardLastFour = stripePaymentMethod.card.last4
          paymentMethodData.cardBrand = stripePaymentMethod.card.brand
          paymentMethodData.cardExpMonth = stripePaymentMethod.card.exp_month
          paymentMethodData.cardExpYear = stripePaymentMethod.card.exp_year
        }
      } catch (stripeError) {
        console.error('Erreur lors de la récupération des détails Stripe:', stripeError)
        return NextResponse.json(
          { success: false, message: 'Méthode de paiement Stripe invalide' },
          { status: 400 }
        )
      }
    } else if (validatedData.type === 'PAYPAL' && validatedData.paypalEmail) {
      paymentMethodData.paypalEmail = validatedData.paypalEmail
    }

    // Si cette méthode est définie comme par défaut, 
    // désactiver l'ancienne méthode par défaut
    if (validatedData.isDefault) {
      await prisma.userPaymentMethod.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
          isActive: true
        },
        data: {
          isDefault: false
        }
      })
    }

    const paymentMethod = await prisma.userPaymentMethod.create({
      data: paymentMethodData
    })

    return NextResponse.json({
      success: true,
      data: paymentMethod,
      message: 'Méthode de paiement créée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la création de la méthode de paiement:', error)
    
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

