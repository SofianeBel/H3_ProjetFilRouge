'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Interface pour un plan de service
 */
interface ServicePlan {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  currency: string
  features?: string[]
  popular?: boolean
  recommended?: boolean
}

/**
 * Interface pour la réponse API des plans
 */
interface PlansResponse {
  success: boolean
  message?: string
  data?: {
    service: {
      id: string
      name: string
      slug: string
      description?: string
    }
    plans: ServicePlan[]
  }
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
  const [plans, setPlans] = useState<ServicePlan[]>([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)

  // Récupération des plans au montage du composant
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true)
        const response = await fetch(`/api/services/${serviceSlug}/plans`)
        const data: PlansResponse = await response.json()
        
        if (data.success && data.data) {
          setPlans(data.data.plans)
        } else {
          console.error('Erreur lors du chargement des plans:', data.message)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des plans:', error)
      } finally {
        setIsLoadingPlans(false)
      }
    }

    fetchPlans()
  }, [serviceSlug])

  // Fonction pour trouver le plan correspondant
  const findPlan = (): ServicePlan | null => {
    return plans.find(plan => 
      plan.slug.toLowerCase() === planName.toLowerCase() ||
      plan.name.toLowerCase() === planName.toLowerCase()
    ) || null
  }

  // Fonction pour gérer l'ajout au panier
  const handleAddToCart = async () => {
    const plan = findPlan()
    
    if (!plan) {
      console.error(`Plan "${planName}" non trouvé pour le service "${serviceSlug}"`)
      return
    }

    try {
      setIsLoading(true)
      
      // On utilise maintenant l'ID réel du plan
      addItem({
        serviceId: plan.id, // ID réel du plan en BDD
        serviceName: `${serviceSlug.toUpperCase()} - ${plan.name}`,
        serviceSlug,
        price: plan.price, // Prix en centimes depuis la BDD
        currency: plan.currency.toUpperCase()
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

  // Si les plans sont en cours de chargement
  if (isLoadingPlans) {
    return (
      <button
        disabled
        className={cn(
          "btn-primary w-full flex items-center justify-center gap-2 opacity-75 cursor-not-allowed",
          className
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement...
      </button>
    )
  }

  // Si le plan n'existe pas
  const plan = findPlan()
  if (!plan) {
    return (
      <button
        disabled
        className={cn(
          "btn-primary w-full flex items-center justify-center gap-2 opacity-50 cursor-not-allowed",
          className
        )}
      >
        <ShoppingCart className="h-4 w-4" />
        Plan indisponible
      </button>
    )
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