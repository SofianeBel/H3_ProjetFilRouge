'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Clock, X, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
  showRecentSearches?: boolean
}

interface RecentSearch {
  query: string
  timestamp: number
  count: number
}

/**
 * Composant de barre de recherche avec support des recherches récentes
 * Implémente les user stories 3.a et 3.e
 */
export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Rechercher des services...",
  className,
  showRecentSearches = true
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Chargement des recherches récentes depuis localStorage
  useEffect(() => {
    if (showRecentSearches && typeof window !== 'undefined') {
      const stored = localStorage.getItem('cyna-recent-searches')
      if (stored) {
        try {
          const parsed: RecentSearch[] = JSON.parse(stored)
          // Trier par nombre d'occurrences puis par récence
          const sorted = parsed
            .sort((a, b) => {
              if (b.count !== a.count) return b.count - a.count
              return b.timestamp - a.timestamp
            })
            .slice(0, 5) // Garder seulement les 5 plus récentes/populaires
          setRecentSearches(sorted)
        } catch (error) {
          console.error('Erreur lors du chargement des recherches récentes:', error)
        }
      }
    }
  }, [showRecentSearches])

  // Gestion des clics en dehors du dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sauvegarde d'une recherche récente
  const saveRecentSearch = (query: string) => {
    if (!query.trim() || !showRecentSearches || typeof window === 'undefined') return

    const trimmedQuery = query.trim()
    const now = Date.now()

    setRecentSearches(prev => {
      const existing = prev.find(search => search.query.toLowerCase() === trimmedQuery.toLowerCase())
      let updated: RecentSearch[]

      if (existing) {
        // Augmenter le compteur et mettre à jour le timestamp
        updated = prev.map(search =>
          search.query.toLowerCase() === trimmedQuery.toLowerCase()
            ? { ...search, count: search.count + 1, timestamp: now }
            : search
        )
      } else {
        // Ajouter nouvelle recherche
        updated = [{ query: trimmedQuery, timestamp: now, count: 1 }, ...prev]
      }

      // Trier et limiter à 10 éléments
      const sorted = updated
        .sort((a, b) => {
          if (b.count !== a.count) return b.count - a.count
          return b.timestamp - a.timestamp
        })
        .slice(0, 10)

      // Sauvegarder dans localStorage
      localStorage.setItem('cyna-recent-searches', JSON.stringify(sorted))
      
      return sorted.slice(0, 5) // Afficher seulement les 5 premiers
    })
  }

  // Supprimer une recherche récente
  const removeRecentSearch = (queryToRemove: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(search => search.query !== queryToRemove)
      localStorage.setItem('cyna-recent-searches', JSON.stringify(updated))
      return updated
    })
  }

  // Vider toutes les recherches récentes
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('cyna-recent-searches')
  }

  // Gestion de la soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      saveRecentSearch(value)
      onSearch(value)
      setShowDropdown(false)
      inputRef.current?.blur()
    }
  }

  // Gestion du focus
  const handleFocus = () => {
    setIsExpanded(true)
    if (showRecentSearches && recentSearches.length > 0) {
      setShowDropdown(true)
    }
  }

  // Gestion du blur
  const handleBlur = () => {
    // Petit délai pour permettre les clics sur les suggestions
    setTimeout(() => {
      setIsExpanded(false)
    }, 150)
  }

  // Sélection d'une recherche récente
  const selectRecentSearch = (query: string) => {
    onChange(query)
    saveRecentSearch(query)
    onSearch(query)
    setShowDropdown(false)
    inputRef.current?.blur()
  }

  return (
    <div className={cn("relative w-full max-w-2xl", className)} ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "relative flex items-center bg-[#1A1F28] border border-gray-700 rounded-xl transition-all duration-300",
          isExpanded ? "ring-2 ring-[#6B8DE5] border-[#6B8DE5]" : "hover:border-gray-600"
        )}>
          <Search className="absolute left-4 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('')
                onSearch('')
                inputRef.current?.focus()
              }}
              className="absolute right-4 p-1 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700"
              aria-label="Effacer la recherche"
              title="Effacer la recherche"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown des recherches récentes */}
      {showDropdown && showRecentSearches && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1F28] border border-gray-700 rounded-xl shadow-2xl z-50 py-2">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="h-4 w-4 mr-2" />
              Recherches récentes
            </div>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Tout effacer
            </button>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-2 hover:bg-[#252A35] transition-colors group cursor-pointer"
                onClick={() => selectRecentSearch(search.query)}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <TrendingUp className="h-4 w-4 text-gray-500 mr-3 flex-shrink-0" />
                  <span className="text-white truncate">{search.query}</span>
                  {search.count > 1 && (
                    <span className="ml-2 text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded-full">
                      {search.count}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeRecentSearch(search.query)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all ml-2"
                  aria-label={`Supprimer la recherche "${search.query}"`}
                  title="Supprimer cette recherche"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
