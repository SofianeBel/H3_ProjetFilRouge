import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

/**
 * GET /api/admin/orders/[id]
 * Récupère les détails d'une commande spécifique avec données Stripe live
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

    // Récupération de la commande depuis notre base
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Récupération des détails live depuis Stripe
    let stripeData = null
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        order.stripePaymentIntentId,
        {
          expand: ['charges', 'invoice', 'customer']
        }
      )
      stripeData = paymentIntent
    } catch (stripeError) {
      console.error('Erreur récupération Stripe:', stripeError)
      // On continue sans les données Stripe si erreur
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
        stripeData
      }
    })

  } catch (error) {
    console.error('Erreur API admin order detail:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération de la commande",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/orders/[id]
 * Actions sur une commande (remboursement, etc.)
 */
export async function POST(
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
    const { action, amount, reason } = body

    // Récupération de la commande
    const order = await prisma.order.findUnique({
      where: { id }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Traitement selon l'action demandée
    switch (action) {
      case 'refund':
        return await handleRefund(order, amount, reason)
      
      default:
        return NextResponse.json(
          { success: false, message: 'Action non supportée' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Erreur action commande:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de l'action sur la commande",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

/**
 * Gère le remboursement d'une commande
 */
async function handleRefund(
  order: any,
  amount?: number,
  reason?: Stripe.RefundCreateParams.Reason,
) {
  try {
    // Vérification que la commande peut être remboursée
    if (!['succeeded', 'partially_refunded'].includes(order.status)) {
      return NextResponse.json(
        { success: false, message: 'Cette commande ne peut pas être remboursée' },
        { status: 400 }
      )
    }

    // Construction des paramètres pour Stripe – on n'ajoute `amount` que s'il est défini
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: order.stripePaymentIntentId,
      reason: reason ?? 'requested_by_customer',
      metadata: {
        admin_refund: 'true',
        order_id: order.id,
      },
    }

    // Si un montant est précisé (remboursement partiel), on l'ajoute
    if (typeof amount === 'number') {
      refundParams.amount = amount
    }

    // Création du remboursement via Stripe
    const refund = await stripe.refunds.create(refundParams)

    console.log(`💸 Remboursement créé: ${refund.id}`)

    // Le webhook se chargera de mettre à jour le statut de la commande
    // Mais on peut aussi le faire ici pour une réponse immédiate
    const isFullRefund = !amount || amount === order.amount
    const newStatus = isFullRefund ? 'refunded' : 'partially_refunded'

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Remboursement effectué avec succès',
      data: {
        refund,
        newStatus
      }
    })

  } catch (error) {
    console.error('Erreur remboursement:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors du remboursement",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 