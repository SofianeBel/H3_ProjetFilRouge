const NextAuth = require('next-auth').default
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'

/**
 * Configuration NextAuth v5 complète
 * Gère l'authentification credentials et OAuth
 */
export const {
  handlers,
  auth,
  signIn,
  signOut
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    // Provider Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    
    // Provider Email/Password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Debug des credentials reçus
        console.log('🔍 Credentials reçus:', credentials)
        console.log('🔍 Type de credentials:', typeof credentials)
        
        // Gestion flexible des credentials avec typage
        let email: string, password: string
        
        if (credentials && typeof credentials === 'object') {
          email = (credentials as any).email
          password = (credentials as any).password
        } else {
          console.log('❌ Format de credentials invalide')
          return null
        }
        
        // Validation simple
        if (!email || !password) {
          console.log('❌ Email ou password manquant')
          console.log('📝 Email:', email)
          console.log('📝 Password présent:', !!password)
          return null
        }

        // Validation email basique
        if (!email.includes('@')) {
          console.log('❌ Format email invalide')
          return null
        }

        // Validation password basique
        if (password.length < 6) {
          console.log('❌ Mot de passe trop court')
          return null
        }

        try {
          // Chercher l'utilisateur
          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user || !user.password) {
            console.log('❌ Utilisateur non trouvé')
            return null
          }

          // Vérifier le mot de passe
          const passwordMatch = await bcrypt.compare(password, user.password)

          if (!passwordMatch) {
            console.log('❌ Mot de passe incorrect')
            return null
          }

          console.log('✅ Connexion réussie:', email)
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }

        } catch (error) {
          console.error('Erreur auth:', error)
          return null
        }
      }
    })
  ],
  
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  }
}) 