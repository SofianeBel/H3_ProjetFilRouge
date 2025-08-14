'use client'

import Link from 'next/link'
import { CheckCircle, ArrowRight, Star, Crown, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  price: number | null
  currency: string
  purchaseType: 'PRE_CONFIGURED' | 'QUOTE'
  featured: boolean
  category: string | null
  icon: string | null
  color: string | null
  plans?: ServicePlan[]
}

interface ServicePlan {
  id: string
  name: string
  slug: string
  price: number
  popular: boolean
  recommended: boolean
  features: any
}

interface ServicesGridProps {
  services: Service[]
  loading?: boolean
  emptyMessage?: string
  className?: string
}

/**
 * Composant de grille pour afficher les services avec leurs informations
 * Supporte l'affichage responsive et les badges de popularité
 */
export function ServicesGrid({
  services,
  loading = false,
  emptyMessage = "Aucun service trouvé",
  className
}: ServicesGridProps) {
  // Formatage du prix en euros
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  // Génération des icônes dynamiques basées sur les catégories
  const getIconForCategory = (category: string | null, iconName: string | null) => {
    if (iconName) return iconName
    
    switch (category?.toLowerCase()) {
      case 'soc':
      case 'monitoring':
        return 'Eye'
      case 'audit':
      case 'security':
        return 'Shield'
      case 'pentest':
      case 'testing':
        return 'AlertTriangle'
      case 'cert':
      case 'emergency':
        return 'Users'
      default:
        return 'Shield'
    }
  }

  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8", className)}>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-[#1A1F28] rounded-2xl p-8 border border-gray-700 animate-pulse"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-xl bg-gray-700 mr-4" />
              <div>
                <div className="h-6 bg-gray-700 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-24" />
              </div>
            </div>
            <div className="h-4 bg-gray-700 rounded w-full mb-4" />
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-6" />
            <div className="space-y-3 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-5 w-5 bg-gray-700 rounded-full mr-3" />
                  <div className="h-4 bg-gray-700 rounded flex-1" />
                </div>
              ))}
            </div>
            <div className="h-10 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!services.length) {
    return (
      <div className={cn("text-center py-16", className)}>
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Essayez de modifier vos critères de recherche ou explorez nos différentes catégories de services.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8", className)}>
      {services.map((service) => {
        // Prix à afficher (soit le prix du service, soit le prix minimum des plans)
        const displayPrice = service.price || 
          (service.plans && service.plans.length > 0 
            ? Math.min(...service.plans.map(plan => plan.price))
            : null)

        // Vérifier si le service a des plans populaires ou recommandés
        const hasPopularPlan = service.plans?.some(plan => plan.popular)
        const hasRecommendedPlan = service.plans?.some(plan => plan.recommended)

        return (
          <div
            key={service.id}
            className="group bg-[#1A1F28] rounded-2xl p-8 border border-gray-700 hover:border-[#6B8DE5] transition-all duration-300 hover:transform hover:scale-105 relative overflow-hidden"
          >
            {/* Badges de popularité */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {service.featured && (
                <div className="flex items-center bg-gradient-to-r from-[#6B8DE5] to-[#A67FFB] px-3 py-1 rounded-full text-white text-xs font-medium">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Populaire
                </div>
              )}
              {hasRecommendedPlan && (
                <div className="flex items-center bg-gradient-to-r from-[#10B981] to-[#059669] px-3 py-1 rounded-full text-white text-xs font-medium">
                  <Crown className="h-3 w-3 mr-1 fill-current" />
                  Recommandé
                </div>
              )}
              {hasPopularPlan && (
                <div className="flex items-center bg-gradient-to-r from-[#F59E0B] to-[#D97706] px-3 py-1 rounded-full text-white text-xs font-medium">
                  <Zap className="h-3 w-3 mr-1 fill-current" />
                  Tendance
                </div>
              )}
            </div>

            {/* Header du service */}
            <div className="flex items-center mb-6">
              <div className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center mr-4",
                service.color 
                  ? `bg-gradient-to-r ${service.color}` 
                  : "bg-gradient-to-r from-[#6B8DE5] to-[#A67FFB]"
              )}>
                {/* Ici nous pourrions rendre les icônes dynamiquement */}
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white group-hover:text-[#6B8DE5] transition-colors">
                  {service.name}
                </h3>
                {service.category && (
                  <p className="text-gray-400 capitalize">{service.category}</p>
                )}
              </div>
            </div>

            {/* Description */}
            {service.description && (
              <p className="text-gray-300 mb-6 leading-relaxed line-clamp-3">
                {service.description}
              </p>
            )}

            {/* Prix */}
            <div className="mb-6">
              {displayPrice ? (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-white">
                    {formatPrice(displayPrice)}
                  </span>
                  {service.purchaseType === 'PRE_CONFIGURED' ? (
                    <span className="text-gray-400 ml-2">/ service</span>
                  ) : (
                    <span className="text-gray-400 ml-2">à partir de</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-[#6B8DE5]">
                    Sur devis
                  </span>
                </div>
              )}
            </div>

            {/* Plans ou caractéristiques */}
            {service.plans && service.plans.length > 0 ? (
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                  Plans disponibles
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {service.plans.slice(0, 3).map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between p-3 bg-[#252A35] rounded-lg border border-gray-600"
                    >
                      <div className="flex items-center">
                        <span className="text-white font-medium">{plan.name}</span>
                        {plan.popular && (
                          <Star className="h-4 w-4 text-[#F59E0B] ml-2 fill-current" />
                        )}
                      </div>
                      <span className="text-[#6B8DE5] font-semibold">
                        {formatPrice(plan.price)}
                      </span>
                    </div>
                  ))}
                  {service.plans.length > 3 && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      +{service.plans.length - 3} autres plans
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                  Caractéristiques
                </h4>
                <div className="space-y-3">
                  {[
                    "Solution complète et personnalisée",
                    "Support expert 24h/7j",
                    "Conformité réglementaire",
                    "ROI mesurable"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#6B8DE5] mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lien vers le détail */}
            <Link
              href={`/services/${service.slug}`}
              className="inline-flex items-center text-[#6B8DE5] hover:text-[#A67FFB] font-semibold group-hover:translate-x-2 transition-all duration-300"
            >
              {service.purchaseType === 'PRE_CONFIGURED' ? 'Commander maintenant' : 'En savoir plus'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}

