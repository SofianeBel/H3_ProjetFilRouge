'use client'

import Link from "next/link"
import { ArrowRight, RefreshCw } from "lucide-react"
import { useState } from "react"

// Composants de recherche et filtres
import { SearchBar } from "@/components/ui/search-bar"
import { Filters } from "@/components/ui/filters"
import { MobileFilters } from "@/components/ui/mobile-filters"
import { ServicesGrid } from "@/components/ui/services-grid"
import { useServicesSearch } from "@/hooks/use-services-search"

/**
 * Page principale des services avec recherche et filtres
 * Implémente les user stories 3.a à 3.e
 */
export default function ServicesPage() {
  // Hook personnalisé pour la gestion de la recherche et des filtres
  const {
    services,
    metadata,
    loading,
    error,
    filters,
    updateSearch,
    updateCategory,
    updatePriceRange,
    updateFeatured,
    updateSort,
    resetFilters,
    search,
    refresh
  } = useServicesSearch()

  // Calcul du nombre de filtres actifs pour l'affichage mobile
  const activeFiltersCount = [
    filters.search && filters.search.trim(),
    filters.category !== 'all',
    filters.featured,
    filters.minPrice !== undefined,
    filters.maxPrice !== undefined,
    filters.sortBy !== 'featured' || filters.sortOrder !== 'desc'
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#111318]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#6B8DE5] via-[#8E63E5] to-[#A67FFB] py-24">
        <div className="container-cyna text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Nos Services de 
            <span className="block text-[#FFE5A3]">Cybersécurité</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            Une approche complète pour protéger votre entreprise contre les cybermenaces.
            Des solutions sur-mesure adaptées aux PME et MSP.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking"
              className="btn-primary"
            >
              Audit gratuit
            </Link>
            <Link 
              href="#services-search"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#8E63E5] transition-colors"
            >
              Découvrir nos services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section de recherche et filtres */}
      <section id="services-search" className="py-16 bg-[#111318]">
        <div className="container-cyna">
          {/* En-tête avec résultats */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Trouvez le Service Idéal
              </h2>
              <div className="flex items-center gap-4 text-gray-400">
                {loading ? (
                  <span>Recherche en cours...</span>
                ) : metadata ? (
                  <>
                    <span>{metadata.totalCount} services disponibles</span>
                    {(filters.search || filters.category !== 'all' || filters.featured || filters.minPrice || filters.maxPrice) && (
                      <span className="text-[#6B8DE5]">
                        (avec filtres appliqués)
                      </span>
                    )}
                  </>
                ) : null}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              {error && (
                <button
                  onClick={refresh}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Réessayer
                </button>
              )}
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="mb-6">
            <SearchBar
              value={filters.search}
              onChange={updateSearch}
              onSearch={search}
              placeholder="Recherchez parmi nos services de cybersécurité..."
              className="w-full"
              showRecentSearches={true}
            />
          </div>

          {/* Filtres mobiles */}
          <div className="mb-8 lg:hidden">
            <MobileFilters
              categories={metadata?.categories || []}
              selectedCategory={filters.category}
              onCategoryChange={updateCategory}
              priceRange={metadata?.priceRange || { min: 0, max: 0 }}
              selectedPriceRange={{
                min: filters.minPrice,
                max: filters.maxPrice
              }}
              onPriceRangeChange={updatePriceRange}
              showFeaturedOnly={filters.featured}
              onFeaturedChange={updateFeatured}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSortChange={updateSort}
              filtersCount={activeFiltersCount}
            />
          </div>

          {/* Contenu principal avec sidebar de filtres */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar des filtres (desktop uniquement) */}
            <div className="hidden lg:block lg:col-span-1">
              <Filters
                categories={metadata?.categories || []}
                selectedCategory={filters.category}
                onCategoryChange={updateCategory}
                priceRange={metadata?.priceRange || { min: 0, max: 0 }}
                selectedPriceRange={{
                  min: filters.minPrice,
                  max: filters.maxPrice
                }}
                onPriceRangeChange={updatePriceRange}
                showFeaturedOnly={filters.featured}
                onFeaturedChange={updateFeatured}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSortChange={updateSort}
                isMobile={false}
                className="sticky top-8"
              />
            </div>

            {/* Grille des résultats */}
            <div className="col-span-1 lg:col-span-3">
              {error ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Erreur de chargement
                  </h3>
                  <p className="text-gray-400 mb-6">{error}</p>
                  <button
                    onClick={refresh}
                    className="btn-primary"
                  >
                    Réessayer
                  </button>
                </div>
              ) : (
                <ServicesGrid
                  services={services}
                  loading={loading}
                  emptyMessage={
                    filters.search || filters.category !== 'all' || filters.featured || filters.minPrice || filters.maxPrice
                      ? "Aucun service ne correspond à vos critères"
                      : "Aucun service disponible"
                  }
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section Processus */}
      <section className="py-24 bg-[#161A22]">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Notre Méthodologie
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Une approche structurée et éprouvée pour garantir votre sécurité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Analyse',
                description: 'Audit initial de votre infrastructure et identification des risques'
              },
              {
                step: '02', 
                title: 'Planification',
                description: 'Conception d\'une stratégie de sécurité adaptée à vos besoins'
              },
              {
                step: '03',
                title: 'Implémentation',
                description: 'Déploiement des solutions avec accompagnement de nos experts'
              },
              {
                step: '04',
                title: 'Monitoring',
                description: 'Surveillance continue et optimisation des dispositifs de sécurité'
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#6B8DE5] to-[#A67FFB] rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{process.title}</h3>
                <p className="text-gray-400">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#6B8DE5] to-[#A67FFB]">
        <div className="container-cyna text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à Renforcer Votre Sécurité ?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour un audit gratuit et découvrez comment nous pouvons protéger votre entreprise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking"
              className="inline-flex items-center px-8 py-4 bg-white text-[#8E63E5] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Demander un audit gratuit
            </Link>
            <Link 
              href="tel:+33123456789"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#8E63E5] transition-colors"
            >
              Appeler maintenant
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 