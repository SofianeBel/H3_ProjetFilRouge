/**
 * Layout public pour toutes les pages publiques du site Cyna
 * Inclut Header, Footer et gestion des animations avec PageWrapper
 * Exclu automatiquement des pages admin et auth
 */

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PageWrapper } from "@/components/motion/page-wrapper"

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      {/* Header avec glassmorphism et navigation principale */}
      <Header />
      
      {/* Contenu principal avec animations PageWrapper */}
      <PageWrapper>
        <main className="flex-grow">
          {children}
        </main>
      </PageWrapper>
      
      {/* Footer avec liens et informations */}
      <Footer />
    </>
  )
} 