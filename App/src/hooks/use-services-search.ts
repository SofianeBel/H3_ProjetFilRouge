'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  longDescription: string | null
  price: number | null
  currency: string
  purchaseType: 'PRE_CONFIGURED' | 'QUOTE'
  featured: boolean
  category: string | null
  icon: string | null
  color: string | null
  plans?: any[]
}

interface SearchFilters {
  search: string
  category: string
  minPrice?: number
  maxPrice?: number
  featured: boolean
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface SearchMetadata {
  totalCount: number
  categories: string[]
  priceRange: { min: number; max: number }
  appliedFilters: any
}

interface UseServicesSearchReturn {
  // État des données
  services: Service[]
  metadata: SearchMetadata | null
  loading: boolean
  error: string | null
  
  // Filtres et recherche
  filters: SearchFilters
  updateSearch: (search: string) => void
  updateCategory: (category: string) => void
  updatePriceRange: (range: { min?: number; max?: number }) => void
  updateFeatured: (featured: boolean) => void
  updateSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  resetFilters: () => void
  
  // Actions
  search: () => void
  refresh: () => void
}

/**
 * Hook personnalisé pour gérer la recherche et les filtres des services
 * Centralise toute la logique de l'état et des appels API
 */
export function useServicesSearch(): UseServicesSearchReturn {
  // État des données
  const [services, setServices] = useState<Service[]>([])
  const [metadata, setMetadata] = useState<SearchMetadata | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // État des filtres
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    category: 'all',
    featured: false,
    sortBy: 'featured',
    sortOrder: 'desc'
  })

  // Construction de l'URL avec les paramètres
  const buildSearchUrl = useCallback((searchFilters: SearchFilters) => {
    const params = new URLSearchParams()
    
    if (searchFilters.search.trim()) {
      params.set('search', searchFilters.search.trim())
    }
    
    if (searchFilters.category !== 'all') {
      params.set('category', searchFilters.category)
    }
    
    if (searchFilters.minPrice !== undefined) {
      params.set('minPrice', searchFilters.minPrice.toString())
    }
    
    if (searchFilters.maxPrice !== undefined) {
      params.set('maxPrice', searchFilters.maxPrice.toString())
    }
    
    if (searchFilters.featured) {
      params.set('featured', 'true')
    }
    
    if (searchFilters.sortBy !== 'featured' || searchFilters.sortOrder !== 'desc') {
      params.set('sortBy', searchFilters.sortBy)
      params.set('sortOrder', searchFilters.sortOrder)
    }

    return `/api/services?${params.toString()}`
  }, [])

  // Fonction de recherche
  const performSearch = useCallback(async (searchFilters: SearchFilters) => {
    setLoading(true)
    setError(null)

    try {
      const url = buildSearchUrl(searchFilters)
      console.log('Recherche avec URL:', url)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la recherche')
      }
      
      setServices(data.data || [])
      setMetadata(data.metadata || null)
      
    } catch (err) {
      console.error('Erreur lors de la recherche de services:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setServices([])
      setMetadata(null)
    } finally {
      setLoading(false)
    }
  }, [buildSearchUrl])

  // Debounce pour la recherche automatique
  const [debouncedFilters, setDebouncedFilters] = useState(filters)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 300) // Délai de 300ms pour éviter trop d'appels API

    return () => clearTimeout(timer)
  }, [filters])

  // Effectuer la recherche quand les filtres debouncés changent
  useEffect(() => {
    performSearch(debouncedFilters)
  }, [debouncedFilters, performSearch])

  // Recherche initiale au montage du composant
  useEffect(() => {
    performSearch(filters)
  }, []) // Uniquement au montage

  // Actions pour mettre à jour les filtres
  const updateSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }))
  }, [])

  const updateCategory = useCallback((category: string) => {
    setFilters(prev => ({ ...prev, category }))
  }, [])

  const updatePriceRange = useCallback((range: { min?: number; max?: number }) => {
    setFilters(prev => ({ 
      ...prev, 
      minPrice: range.min, 
      maxPrice: range.max 
    }))
  }, [])

  const updateFeatured = useCallback((featured: boolean) => {
    setFilters(prev => ({ ...prev, featured }))
  }, [])

  const updateSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'all',
      featured: false,
      sortBy: 'featured',
      sortOrder: 'desc'
    })
  }, [])

  // Action de recherche manuelle
  const search = useCallback(() => {
    performSearch(filters)
  }, [filters, performSearch])

  // Action de rafraîchissement
  const refresh = useCallback(() => {
    performSearch(filters)
  }, [filters, performSearch])

  // Mémorisation des valeurs pour éviter les re-renders inutiles
  const memoizedReturn = useMemo(() => ({
    // État des données
    services,
    metadata,
    loading,
    error,
    
    // Filtres et recherche
    filters,
    updateSearch,
    updateCategory,
    updatePriceRange,
    updateFeatured,
    updateSort,
    resetFilters,
    
    // Actions
    search,
    refresh
  }), [
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
  ])

  return memoizedReturn
}

