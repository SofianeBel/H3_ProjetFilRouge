'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Filter, X, Star, Tag, Euro, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FiltersProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  priceRange: { min: number; max: number }
  selectedPriceRange: { min?: number; max?: number }
  onPriceRangeChange: (range: { min?: number; max?: number }) => void
  showFeaturedOnly: boolean
  onFeaturedChange: (featured: boolean) => void
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  className?: string
  isMobile?: boolean
}

/**
 * Composant de filtres pour les services
 * Implémente les user stories 3.b, 3.c et 3.d
 */
export function Filters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  selectedPriceRange,
  onPriceRangeChange,
  showFeaturedOnly,
  onFeaturedChange,
  sortBy,
  sortOrder,
  onSortChange,
  className,
  isMobile = false
}: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(!isMobile)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Calcul du nombre de filtres actifs
  useEffect(() => {
    const filters: string[] = []
    
    if (selectedCategory !== 'all') {
      filters.push(`Catégorie: ${selectedCategory}`)
    }
    
    if (selectedPriceRange.min !== undefined || selectedPriceRange.max !== undefined) {
      const minStr = selectedPriceRange.min ? `${selectedPriceRange.min / 100}€` : '0€'
      const maxStr = selectedPriceRange.max ? `${selectedPriceRange.max / 100}€` : '∞'
      filters.push(`Prix: ${minStr} - ${maxStr}`)
    }
    
    if (showFeaturedOnly) {
      filters.push('Populaires uniquement')
    }
    
    if (sortBy !== 'featured' || sortOrder !== 'desc') {
      const sortLabels = {
        name: 'Nom',
        price: 'Prix',
        created: 'Date',
        featured: 'Popularité'
      }
      filters.push(`Tri: ${sortLabels[sortBy as keyof typeof sortLabels]} ${sortOrder === 'asc' ? '↑' : '↓'}`)
    }
    
    setActiveFilters(filters)
  }, [selectedCategory, selectedPriceRange, showFeaturedOnly, sortBy, sortOrder])

  // Réinitialisation des filtres
  const resetFilters = () => {
    onCategoryChange('all')
    onPriceRangeChange({})
    onFeaturedChange(false)
    onSortChange('featured', 'desc')
  }

  // Formatage du prix en euros
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  return (
    <div className={cn("bg-[#1A1F28] border border-gray-700 rounded-xl", className)}>
      {/* Header avec toggle pour mobile */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-[#6B8DE5] mr-2" />
          <h3 className="font-semibold text-white">Filtres</h3>
          {activeFilters.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-[#6B8DE5] text-white text-xs rounded-full">
              {activeFilters.length}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {activeFilters.length > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Réinitialiser
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              aria-label={isExpanded ? "Masquer les filtres" : "Afficher les filtres"}
              title={isExpanded ? "Masquer les filtres" : "Afficher les filtres"}
            >
              <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
            </button>
          )}
        </div>
      </div>

      {/* Contenu des filtres */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Filtres actifs (chips) */}
          {activeFilters.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-[#6B8DE5] bg-opacity-20 text-[#6B8DE5] px-3 py-1 rounded-full text-sm"
                  >
                    {filter}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filtre par catégorie */}
          <div>
            <label className="flex items-center text-sm font-medium text-white mb-3">
              <Tag className="h-4 w-4 mr-2" />
              Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 bg-[#252A35] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#6B8DE5] focus:border-[#6B8DE5] transition-colors"
              aria-label="Sélectionner une catégorie"
              title="Filtrer par catégorie"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par prix */}
          {priceRange.max > 0 && (
            <div>
              <label className="flex items-center text-sm font-medium text-white mb-3">
                <Euro className="h-4 w-4 mr-2" />
                Gamme de prix
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={selectedPriceRange.min ? selectedPriceRange.min / 100 : ''}
                    onChange={(e) => {
                      const min = e.target.value ? parseInt(e.target.value) * 100 : undefined
                      onPriceRangeChange({ ...selectedPriceRange, min })
                    }}
                    className="flex-1 px-3 py-2 bg-[#252A35] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#6B8DE5] focus:border-[#6B8DE5] transition-colors"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={selectedPriceRange.max ? selectedPriceRange.max / 100 : ''}
                    onChange={(e) => {
                      const max = e.target.value ? parseInt(e.target.value) * 100 : undefined
                      onPriceRangeChange({ ...selectedPriceRange, max })
                    }}
                    className="flex-1 px-3 py-2 bg-[#252A35] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#6B8DE5] focus:border-[#6B8DE5] transition-colors"
                  />
                </div>
                <div className="text-xs text-gray-400">
                  Gamme disponible: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                </div>
                
                {/* Boutons de gammes prédéfinies */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Moins de 500€', max: 50000 },
                    { label: '500€ - 1000€', min: 50000, max: 100000 },
                    { label: '1000€ - 2000€', min: 100000, max: 200000 },
                    { label: 'Plus de 2000€', min: 200000 }
                  ].map((range, index) => (
                    <button
                      key={index}
                      onClick={() => onPriceRangeChange({ min: range.min, max: range.max })}
                      className="px-3 py-1 text-xs bg-[#252A35] hover:bg-[#6B8DE5] text-gray-300 hover:text-white border border-gray-600 hover:border-[#6B8DE5] rounded-full transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filtre par popularité */}
          <div>
            <label className="flex items-center text-sm font-medium text-white mb-3">
              <Star className="h-4 w-4 mr-2" />
              Popularité
            </label>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => onFeaturedChange(e.target.checked)}
                  className="mr-3 rounded border-gray-600 bg-[#252A35] text-[#6B8DE5] focus:ring-[#6B8DE5] focus:ring-offset-0"
                />
                <span className="text-gray-300">Services populaires uniquement</span>
              </label>
            </div>
          </div>

          {/* Tri */}
          <div>
            <label className="flex items-center text-sm font-medium text-white mb-3">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Trier par
            </label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value, sortOrder)}
                className="flex-1 px-3 py-2 bg-[#252A35] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#6B8DE5] focus:border-[#6B8DE5] transition-colors"
                aria-label="Choisir le critère de tri"
                title="Trier par"
              >
                <option value="featured">Popularité</option>
                <option value="name">Nom</option>
                <option value="price">Prix</option>
                <option value="created">Date de création</option>
              </select>
              <button
                onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-[#252A35] border border-gray-600 rounded-lg text-white hover:bg-[#6B8DE5] hover:border-[#6B8DE5] transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
