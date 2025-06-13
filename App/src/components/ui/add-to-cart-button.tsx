'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Fonction utilitaire pour obtenir le prix d'un plan
 * Retourne le prix en centimes
 */
const getPriceForPlan = (serviceSlug: string, planName: string): number => {
  // Mapping des prix par service et plan (en centimes)
  const prices: Record<string, Record<string, number>> = {
    'soc': {
      'pme': 250000, // 2500€
      'entreprise': 500000, // 5000€
      'enterprise': 0 // Sur devis
    },
    'pentest': {
      'basique': 150000, // 1500€
      'avance': 300000, // 3000€
      'premium': 500000 // 5000€
    },
    'audit': {
      'pme': 250000, // 2500€
      'eti': 590000, // 5900€
      'groupe': 0 // Sur devis
    },
    'formation': {
      'sensibilisation': 50000, // 500€
      'technique': 150000, // 1500€
      'expert': 300000 // 3000€
    },
    'compliance': {
      'evaluation': 200000, // 2000€
      'mise-en-conformite': 500000, // 5000€
      'accompagnement': 800000 // 8000€
    },
    'incident': {
      'investigation': 300000, // 3000€
      'remediation': 500000, // 5000€
      'forensic': 800000 // 8000€
    },
    'cert': {
      'iso27001': 1000000, // 10000€
      'iso27005': 800000, // 8000€
      'custom': 0 // Sur devis
    }
  }

  const servicePrices = prices[serviceSlug.toLowerCase()]
  if (!servicePrices) {
    console.warn(`Prix non trouvé pour le service: ${serviceSlug}`)
    return 0
  }

  const price = servicePrices[planName.toLowerCase()]
  if (price === undefined) {
    console.warn(`Prix non trouvé pour le plan: ${planName} du service: ${serviceSlug}`)
    return 0
  }

  return price
}

/**
 * Composant bouton pour ajouter un service au panier
 * Gère les états de chargement et le feedback utilisateur
 */
interface AddToCartButtonProps {
  serviceSlug: string
  planName: string
  className?: string
  children?: React.ReactNode
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  serviceSlug,
  planName,
  className,
  children
}) => {
  const { addItem } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  // Fonction pour gérer l'ajout au panier
  const handleAddToCart = async () => {
    try {
      setIsLoading(true)
      
      // On crée un serviceId unique basé sur le service et le plan
      const serviceId = `${serviceSlug}-${planName.toLowerCase()}`
      
      // On ajoute le service au panier avec le plan sélectionné
      addItem({
        serviceId,
        serviceName: `${serviceSlug.toUpperCase()} - ${planName}`,
        serviceSlug,
        price: getPriceForPlan(serviceSlug, planName), // Prix en centimes
        currency: 'EUR'
      })
      
      // Feedback visuel de succès
      setIsAdded(true)
      
      // Reset du feedback après 2 secondes
      setTimeout(() => {
        setIsAdded(false)
      }, 2000)
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error)
      // Ici on pourrait ajouter une notification d'erreur
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={cn(
        "btn-primary w-full flex items-center justify-center gap-2 transition-all duration-300",
        isAdded && "bg-green-500 hover:bg-green-600",
        isLoading && "opacity-75 cursor-not-allowed",
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Ajout en cours...
        </>
      ) : isAdded ? (
        <>
          <Check className="h-4 w-4" />
          Ajouté au panier !
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {children || 'Ajouter au panier'}
        </>
      )}
    </button>
  )
} 