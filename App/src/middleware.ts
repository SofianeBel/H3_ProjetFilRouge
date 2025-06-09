import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

/**
 * Middleware NextAuth pour la protection des routes
 * Utilise la configuration authConfig pour déterminer les autorisations
 */
export default NextAuth(authConfig).auth

/**
 * Configuration du matcher pour définir quelles routes sont protégées
 * Exclut les fichiers statiques et les API publiques
 */
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
} 