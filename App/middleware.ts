import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

/**
 * Middleware NextAuth pour la protection des routes
 * Gère l'authentification et l'autorisation automatiquement
 */
export default auth((req: any) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  
  // Protection des routes admin
  if (nextUrl.pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      // Rediriger vers login si pas connecté
      const loginUrl = new URL('/auth/login', nextUrl)
      loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Vérifier si l'utilisateur a le rôle admin
    const userRole = req.auth?.user?.role as string
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      // Rediriger vers la page d'accueil si pas admin
      return NextResponse.redirect(new URL('/', nextUrl))
    }
  }

  // Redirection si déjà connecté sur les pages d'auth
  if (nextUrl.pathname.startsWith('/auth/') && isLoggedIn) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Protéger les routes suivantes
    '/admin/:path*',
    '/auth/:path*',
    // Ne pas matcher les assets statiques
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 