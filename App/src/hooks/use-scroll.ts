'use client'

import { useState, useEffect } from 'react'

/**
 * Hook personnalisé pour détecter le scroll de façon optimisée
 * Utilise un throttling pour éviter les reflows excessifs
 * 
 * @param threshold - Seuil de pixel où considérer la page scrollée (défaut: 20px)
 * @param throttleMs - Délai de throttling en millisecondes (défaut: 10ms)
 * @returns isScrolled - Boolean indiquant si la page a été scrollée au-delà du seuil
 */
export function useScroll(threshold: number = 20, throttleMs: number = 10) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleScroll = () => {
      // Throttling pour éviter les reflows trop fréquents et améliorer la performance
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        const scrollTop = window.scrollY
        const shouldBeScrolled = scrollTop > threshold
        
        // Ne déclencher setState que si l'état change vraiment
        if (shouldBeScrolled !== isScrolled) {
          setIsScrolled(shouldBeScrolled)
        }
      }, throttleMs)
    }

    // Écouter le scroll avec passive: true pour les performances
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Vérifier l'état initial au montage
    handleScroll()

    // Nettoyage au démontage
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [threshold, throttleMs, isScrolled])

  return isScrolled
} 