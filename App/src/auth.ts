import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { authConfig } from './auth.config'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

// Instance Prisma pour l'authentification
const prisma = new PrismaClient()

/**
 * Récupère un utilisateur par email depuis la base de données
 */
async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return user
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    throw new Error('Impossible de récupérer l\'utilisateur.')
  }
}

/**
 * Configuration NextAuth avec providers OAuth entreprise
 */
export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    // Google Workspace - pour les entreprises
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
    }),

    // Microsoft Azure AD - pour Microsoft 365
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile User.Read",
        }
      },
    }),

    // Authentification par credentials pour les comptes internes
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        // Validation avec Zod
        const parsedCredentials = z
          .object({ 
            email: z.string().email(), 
            password: z.string().min(6) 
          })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          return null
        }

        const { email, password } = parsedCredentials.data
        
        try {
          const user = await getUser(email)
          
          if (!user || !user.password) {
            return null
          }
          
          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) {
            // Retourner l'utilisateur sans le mot de passe
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: user.role,
            }
          }
        } catch (error) {
          console.error('Erreur lors de l\'authentification:', error)
        }

        return null
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      
      if (account) {
        token.provider = account.provider
      }
      
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
        ;(session.user as any).role = token.role as string
        ;(session.user as any).provider = token.provider as string
      }
      
      return session
    }
  },
}) 