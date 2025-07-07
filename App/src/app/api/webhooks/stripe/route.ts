import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, stripeWebhookSecret } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

/**
 * Webhook Stripe pour synchroniser les paiements avec notre base de données
 * Gère les événements payment_intent.* et charge.* pour maintenir la table Order à jour
 */
export async function POST(request: NextRequest) {
  try {
    // Récupération du body brut et de la signature
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('❌ Signature Stripe manquante')
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      )
    }

    if (!stripeWebhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET manquant')
      return NextResponse.json(
        { error: 'Configuration webhook manquante' },
        { status: 500 }
      )
    }

    // Vérification de la signature Stripe
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret)
    } catch (err) {
      console.error('❌ Erreur de vérification signature webhook:', err)
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 400 }
      )
    }

    console.log(`🔔 Webhook reçu: ${event.type}`)

    // Traitement selon le type d'événement
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      default:
        console.log(`⚠️ Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Erreur webhook Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * Gère le succès d'un paiement
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`✅ Paiement réussi: ${paymentIntent.id}`)

    // Extraction de l'userId depuis les métadonnées si disponible
    const userId = paymentIntent.metadata?.userId || null

    // Upsert de la commande dans notre base
    await prisma.order.upsert({
      where: {
        stripePaymentIntentId: paymentIntent.id
      },
      update: {
        status: 'succeeded',
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata as any,
        updatedAt: new Date()
      },
      create: {
        stripePaymentIntentId: paymentIntent.id,
        userId: userId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'succeeded',
        metadata: paymentIntent.metadata as any
      }
    })

    console.log(`💾 Commande sauvegardée: ${paymentIntent.id}`)

  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde du paiement réussi:', error)
    throw error
  }
}

/**
 * Gère l'échec d'un paiement
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`❌ Paiement échoué: ${paymentIntent.id}`)

    const userId = paymentIntent.metadata?.userId || null

    await prisma.order.upsert({
      where: {
        stripePaymentIntentId: paymentIntent.id
      },
      update: {
        status: 'failed',
        updatedAt: new Date()
      },
      create: {
        stripePaymentIntentId: paymentIntent.id,
        userId: userId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'failed',
        metadata: paymentIntent.metadata as any
      }
    })

  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde du paiement échoué:', error)
    throw error
  }
}

/**
 * Gère l'annulation d'un paiement
 */
async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`🚫 Paiement annulé: ${paymentIntent.id}`)

    await prisma.order.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id
      },
      data: {
        status: 'canceled',
        updatedAt: new Date()
      }
    })

  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde du paiement annulé:', error)
    throw error
  }
}

/**
 * Gère les remboursements
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    console.log(`💸 Remboursement: ${charge.id}`)

    // Récupération du PaymentIntent associé
    const paymentIntentId = charge.payment_intent as string

    if (paymentIntentId) {
      // Vérification si c'est un remboursement total ou partiel
      const isFullRefund = charge.amount_refunded === charge.amount
      const newStatus = isFullRefund ? 'refunded' : 'partially_refunded'

      await prisma.order.updateMany({
        where: {
          stripePaymentIntentId: paymentIntentId
        },
        data: {
          status: newStatus,
          updatedAt: new Date()
        }
      })

      console.log(`💾 Statut mis à jour: ${newStatus} pour ${paymentIntentId}`)
    }

  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde du remboursement:', error)
    throw error
  }
} 