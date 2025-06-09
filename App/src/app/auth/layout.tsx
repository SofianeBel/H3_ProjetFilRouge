/**
 * Layout spécial pour les pages d'authentification
 * Pas de header/footer pour une expérience immersive
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111318] via-[#1a1f2e] to-[#0f1419]">
      {children}
    </div>
  )
} 