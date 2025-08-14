import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { formatAmount } from '@/lib/stripe'

/**
 * GET /api/orders/[id]/invoice
 * Génère et retourne les données de facturation d'une commande
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

    // Récupérer la commande avec toutes les relations
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        billingAddress: true,
        shippingAddress: true,
        paymentMethod: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que la commande est payée
    if (order.status !== 'succeeded') {
      return NextResponse.json(
        { success: false, message: 'Cette commande n\'est pas encore payée' },
        { status: 400 }
      )
    }

    // Extraire les détails du panier depuis les métadonnées
    const cartItems = order.metadata && typeof order.metadata === 'object' && 'cart' in order.metadata
      ? JSON.parse(order.metadata.cart as string)
      : []

    // Calculs financiers
    const subtotalHT = order.amount // Prix en centimes HT
    const tauxTVA = 0.20 // 20%
    const montantTVA = Math.round(subtotalHT * tauxTVA)
    const totalTTC = subtotalHT + montantTVA

    // Données de la facture
    const invoiceData = {
      // Informations commande
      order: {
        id: order.id,
        stripePaymentIntentId: order.stripePaymentIntentId,
        status: order.status,
        currency: order.currency,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      },

      // Informations client
      customer: {
        id: order.user?.id,
        name: order.user?.name,
        email: order.user?.email
      },

      // Adresses
      billingAddress: order.billingAddress ? {
        company: order.billingAddress.company,
        firstName: order.billingAddress.firstName,
        lastName: order.billingAddress.lastName,
        addressLine1: order.billingAddress.addressLine1,
        addressLine2: order.billingAddress.addressLine2,
        city: order.billingAddress.city,
        postalCode: order.billingAddress.postalCode,
        region: order.billingAddress.region,
        country: order.billingAddress.country,
        phone: order.billingAddress.phone
      } : null,

      shippingAddress: order.shippingAddress ? {
        company: order.shippingAddress.company,
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        addressLine1: order.shippingAddress.addressLine1,
        addressLine2: order.shippingAddress.addressLine2,
        city: order.shippingAddress.city,
        postalCode: order.shippingAddress.postalCode,
        region: order.shippingAddress.region,
        country: order.shippingAddress.country,
        phone: order.shippingAddress.phone
      } : null,

      // Méthode de paiement
      paymentMethod: order.paymentMethod ? {
        type: order.paymentMethod.type,
        label: order.paymentMethod.label,
        cardLastFour: order.paymentMethod.cardLastFour,
        cardBrand: order.paymentMethod.cardBrand
      } : null,

      // Articles commandés
      items: cartItems.map((item: any) => ({
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        serviceSlug: item.serviceSlug,
        quantity: item.quantity,
        unitPrice: item.price, // Prix unitaire en centimes
        totalPrice: item.price * item.quantity // Prix total en centimes
      })),

      // Totaux financiers
      financial: {
        subtotalHT: subtotalHT,
        tauxTVA: tauxTVA,
        montantTVA: montantTVA,
        totalTTC: totalTTC,
        currency: order.currency
      },

      // Totaux formatés pour l'affichage
      formattedAmounts: {
        subtotalHT: formatAmount(subtotalHT, order.currency),
        montantTVA: formatAmount(montantTVA, order.currency),
        totalTTC: formatAmount(totalTTC, order.currency)
      },

      // Informations de facturation
      invoice: {
        number: `CYNA-${order.createdAt.getFullYear()}-${order.id.substring(0, 8).toUpperCase()}`,
        date: order.createdAt.toISOString().split('T')[0],
        dueDate: new Date(order.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +30 jours
      }
    }

    return NextResponse.json({
      success: true,
      data: invoiceData
    })

  } catch (error) {
    console.error('Erreur lors de la génération de la facture:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

