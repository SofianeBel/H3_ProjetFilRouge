import type { NextAuthConfig } from 'next-auth'

/**
 * Configuration NextAuth pour l'authentification
 * Gère la redirection et la protection des routes
 */
export const authConfig = {
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
  },
  callbacks: {
    // Logique d'autorisation pour protéger les routes
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdminPages = nextUrl.pathname.startsWith('/admin')
      const isOnAuthPages = nextUrl.pathname.startsWith('/auth')
      
      // Si on essaie d'accéder aux pages admin
      if (isOnAdminPages) {
        if (!isLoggedIn) {
          // Rediriger vers login si pas connecté
          return false
        }
        // Vérifier si l'utilisateur a le rôle admin
        const userRole = auth?.user?.role as string
        if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
          // Rediriger vers la page d'accueil si pas admin
          return Response.redirect(new URL('/', nextUrl))
        }
        return true
      }
      
      // Si on est sur les pages d'auth et déjà connecté, rediriger vers l'accueil
      if (isOnAuthPages && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl))
      }
      
      return true
    },
    // Enrichir la session avec le rôle utilisateur
    session({ session, token }) {
      if (token.role && session.user) {
        session.user.role = token.role
      }
      return session
    },
    // Enrichir le token JWT avec le rôle
    jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role
      }
      return token
    },
  },
  providers: [], // Les providers seront ajoutés dans auth.ts
} satisfies NextAuthConfig 