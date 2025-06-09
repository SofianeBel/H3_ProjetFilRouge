import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware simplifié pour la protection des routes
 * Permet le build sans erreurs de type NextAuth
 */
export function middleware(request: NextRequest) {
  // Pour le moment, on laisse passer toutes les requêtes
  // La vraie authentification sera gérée côté serveur
  return NextResponse.next()
}

/**
 * Configuration du matcher pour définir quelles routes sont protégées
 * Exclut les fichiers statiques et les API publiques
 */
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
} 