import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited, recordAttempt, getClientIP, getTimeUntilUnblock } from '@/lib/rate-limit'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

// Schéma de validation pour l'inscription
const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

/**
 * API route pour l'inscription d'un nouvel utilisateur
 * POST /api/auth/register
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request as unknown as Request)
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: `Trop de tentatives. Réessayez dans ${getTimeUntilUnblock(ip)}s.` }, { status: 429 })
    }
    const body = await request.json()
    
    // Validation des données
    const validationResult = registerSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const { name, email, password } = validationResult.data

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur avec le rôle CLIENT par défaut
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CLIENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })

    // Générer un token de vérification d'email et envoyer l'email
    try {
      // Nettoyage des anciens tokens (au cas où)
      await prisma.verificationToken.deleteMany({ where: { identifier: email } })

      const token = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      })

      const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'contact@cyna-it.fr',
        to: email,
        subject: 'Vérifiez votre email - Cyna',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #A67FFB;">Bienvenue sur Cyna</h2>
            <p>Merci pour votre inscription. Veuillez confirmer votre adresse email :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background: linear-gradient(135deg, #A67FFB, #8B5CF6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Vérifier mon email
              </a>
            </div>
            <p style="color:#64748b">Ce lien expire dans 24 heures.</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de vérification:', emailError)
      // Ne pas échouer la création, mais informer côté client
    }

    const resp = NextResponse.json(
      { 
        message: 'Compte créé avec succès',
        user 
      },
      { status: 201 }
    )
    recordAttempt(ip, true)
    return resp

  } catch (error) {
    const ip = getClientIP(request as unknown as Request)
    recordAttempt(ip, false)
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  } finally {
    // prisma géré par '@/lib/prisma'
  }
} 