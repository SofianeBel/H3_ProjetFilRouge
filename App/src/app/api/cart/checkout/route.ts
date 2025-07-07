import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

/**
 * Schéma de validation pour les items du panier
 */
const CartItemSchema = z.object({
  serviceId: z.string(),
  serviceName: z.string(),
  serviceSlug: z.string(),
  price: z.number().positive(),
  currency: z.string().default('eur'),
  quantity: z.number().int().positive(),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional()
})

const CheckoutRequestSchema = z.object({
  cart: z.array(CartItemSchema).min(1, 'Le panier ne peut pas être vide'),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
})

/**
 * POST /api/cart/checkout
 * Crée une session Stripe Checkout à partir du panier
 */
export async function POST(request: NextRequest) {
  try {
    // Récupération de la session utilisateur (optionnelle)
    const session = await auth()
    
    // Validation du body de la requête
    const body = await request.json()
    const validatedData = CheckoutRequestSchema.parse(body)
    
    const { cart, successUrl, cancelUrl } = validatedData

    // Vérification que tous les plans existent et sont disponibles
    const planIds = cart.map(item => item.serviceId) // serviceId est maintenant l'ID du plan
    const plans = await prisma.servicePlan.findMany({
      where: {
        id: { in: planIds },
        published: true
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            purchaseType: true
          }
        }
      }
    })

    // Vérification que tous les plans du panier sont valides
    if (plans.length !== planIds.length) {
      const foundIds = plans.map(p => p.id)
      const missingIds = planIds.filter(id => !foundIds.includes(id))
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Plans non trouvés ou non disponibles à l'achat: ${missingIds.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Vérification que tous les services associés sont PRE_CONFIGURED
    const invalidServices = plans.filter(plan => plan.service.purchaseType !== 'PRE_CONFIGURED')
    if (invalidServices.length > 0) {
      const invalidNames = invalidServices.map(plan => `${plan.service.name} - ${plan.name}`)
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Ces services ne sont pas disponibles à l'achat direct: ${invalidNames.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Construction des line_items pour Stripe
    const lineItems = cart.map(item => {
      const plan = plans.find(p => p.id === item.serviceId)!
      
      // Si le plan a un stripePriceId, on l'utilise
      if (plan.stripePriceId) {
        return {
          price: plan.stripePriceId,
          quantity: item.quantity
        }
      }
      
      // Sinon, on crée un price_data dynamique
      return {
        price_data: {
          currency: item.currency,
          product_data: {
            name: item.serviceName,
            description: plan.description || plan.service.description || undefined,
            metadata: {
              planId: item.serviceId,
              serviceSlug: item.serviceSlug,
              serviceName: plan.service.name,
              planName: plan.name
            }
          },
          unit_amount: item.price // Prix en centimes
        },
        quantity: item.quantity
      }
    })

    // Métadonnées pour le PaymentIntent
    const metadata: Record<string, string> = {
      cart: JSON.stringify(cart.map(item => ({
        serviceId: item.serviceId,
        serviceSlug: item.serviceSlug,
        serviceName: item.serviceName,
        quantity: item.quantity,
        price: item.price
      })))
    }

    // Ajout de l'userId si l'utilisateur est connecté
    if (session?.user?.id) {
      metadata.userId = session.user.id
    }

    // URLs de redirection
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const finalSuccessUrl = successUrl || `${baseUrl}/cart/success?session_id={CHECKOUT_SESSION_ID}`
    const finalCancelUrl = cancelUrl || `${baseUrl}/cart`

    // Création de la session Stripe Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata,
      // Configuration optionnelle
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC']
      },
      customer_email: session?.user?.email || undefined,
      // Expire après 24h
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    })

    return NextResponse.json({
      success: true,
      data: {
        sessionId: checkoutSession.id,
        url: checkoutSession.url
      }
    })

  } catch (error) {
    console.error('Erreur API checkout:', error)
    
    // Gestion des erreurs de validation Zod
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
    
    // Gestion des erreurs Stripe
    if (error && typeof error === 'object' && 'type' in error) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Erreur lors de la création de la session de paiement",
          error: (error as any).message || 'Erreur Stripe'
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur interne du serveur",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 