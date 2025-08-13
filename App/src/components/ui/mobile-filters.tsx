'use client'

import { useState } from 'react'
import { Filter, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Filters } from './filters'

interface MobileFiltersProps {
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
  filtersCount: number
}

/**
 * Composant de filtres mobile avec modal overlay
 * Optimisé pour l'utilisation sur mobile et tablette
 */
export function MobileFilters({
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
  filtersCount
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openFilters = () => setIsOpen(true)
  const closeFilters = () => setIsOpen(false)

  return (
    <>
      {/* Bouton pour ouvrir les filtres */}
      <button
        onClick={openFilters}
        className="lg:hidden flex items-center gap-2 px-4 py-3 bg-[#1A1F28] border border-gray-700 rounded-lg text-white hover:border-[#6B8DE5] transition-colors w-full"
        aria-label="Ouvrir les filtres"
      >
        <Filter className="h-5 w-5 text-[#6B8DE5]" />
        <span className="flex-1 text-left">Filtres et tri</span>
        {filtersCount > 0 && (
          <span className="px-2 py-1 bg-[#6B8DE5] text-white text-xs rounded-full">
            {filtersCount}
          </span>
        )}
        <SlidersHorizontal className="h-5 w-5 text-gray-400" />
      </button>

      {/* Modal overlay pour mobile */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeFilters}
          />
          
          {/* Modal content */}
          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] bg-[#111318] border-t border-gray-700 rounded-t-2xl overflow-hidden">
            {/* Header avec bouton fermer */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#1A1F28]">
              <h2 className="text-lg font-semibold text-white">Filtres et tri</h2>
              <button
                onClick={closeFilters}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Fermer les filtres"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenu scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-4">
                <Filters
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={onCategoryChange}
                  priceRange={priceRange}
                  selectedPriceRange={selectedPriceRange}
                  onPriceRangeChange={onPriceRangeChange}
                  showFeaturedOnly={showFeaturedOnly}
                  onFeaturedChange={onFeaturedChange}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={onSortChange}
                  isMobile={true}
                  className="border-none bg-transparent"
                />
              </div>
            </div>

            {/* Footer avec boutons d'action */}
            <div className="p-4 border-t border-gray-700 bg-[#1A1F28] flex gap-3">
              <button
                onClick={() => {
                  onCategoryChange('all')
                  onPriceRangeChange({})
                  onFeaturedChange(false)
                  onSortChange('featured', 'desc')
                }}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Réinitialiser
              </button>
              <button
                onClick={closeFilters}
                className="flex-1 px-4 py-3 bg-[#6B8DE5] hover:bg-[#5A7BD3] text-white rounded-lg transition-colors font-semibold"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

