/**
 * Layout pour les pages publiques (Route Group)
 * Applique automatiquement Header + Footer sur toutes les pages publiques
 * Exclut /admin et /auth qui ont leurs propres layouts
 */

import { PublicLayout } from "@/components/layout/public-layout"

export default function PublicGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PublicLayout>
      {children}
    </PublicLayout>
  )
} 