/**
 * Page d'accueil modernisée - Phase 2 du plan UI
 * Layout automatique avec Header/Footer via PublicLayout
 * Utilise les nouveaux composants avec animations Framer Motion
 */

import { HeroModern } from "@/components/sections/hero-modern"
import { ServicesGrid } from "@/components/sections/services-grid"
import { AboutSection } from "@/components/sections/about-section"

export default function HomePage() {
  return (
    <>
      {/* Hero Section moderne avec gradients et animations */}
      <HeroModern />
      
      {/* Services Grid avec hover effects et stagger animations */}
      <ServicesGrid />
      
      {/* About Section avec statistiques animées */}
      <AboutSection />
    </>
  )
}
