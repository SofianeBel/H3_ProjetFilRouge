import Stripe from 'stripe'

/**
 * Instance Stripe configurée avec la clé secrète
 * Utilisée côté serveur pour les opérations sécurisées
 */
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY manquante dans les variables d\'environnement')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil', // Version API Stripe supportée
  typescript: true,
})

/**
 * Clé publique Stripe pour le frontend
 * Utilisée pour Stripe Elements et les paiements côté client
 */
export const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY

/**
 * Secret du webhook Stripe pour vérifier l'authenticité des événements
 */
export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET

/**
 * Formate un montant en centimes vers un affichage en euros
 * @param amount - Montant en centimes
 * @param currency - Devise (par défaut EUR)
 * @returns Chaîne formatée (ex: "12,34 €")
 */
export function formatAmount(amount: number, currency: string = 'eur'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

/**
 * Convertit un montant en euros vers des centimes
 * @param euros - Montant en euros
 * @returns Montant en centimes
 */
export function eurosTocents(euros: number): number {
  return Math.round(euros * 100)
}

/**
 * Types pour les statuts de commande Stripe
 */
export type StripeOrderStatus = 
  | 'pending'
  | 'processing' 
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'succeeded'
  | 'canceled'
  | 'failed'
  | 'refunded'
  | 'partially_refunded' 