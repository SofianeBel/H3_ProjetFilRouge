import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware pour la protection des routes et redirections
 * Gère la redirection de /contact vers /booking?mode=message
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirection de /contact vers /booking?mode=message (301 pour SEO)
  if (pathname === '/contact') {
    const url = request.nextUrl.clone()
    url.pathname = '/booking'
    url.searchParams.set('mode', 'message')
    return NextResponse.redirect(url, 301)
  }

  // Pour le moment, on laisse passer toutes les autres requêtes
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