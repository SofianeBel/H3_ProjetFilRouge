import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Schéma de validation pour la réinitialisation de mot de passe
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

/**
 * API pour réinitialiser le mot de passe
 * GET /api/auth/reset-password?token=... - Valider un token
 * POST /api/auth/reset-password - Réinitialiser le mot de passe
 */

/**
 * GET - Valider la validité d'un token de réinitialisation
 * Vérifie si le token existe, n'est pas expiré et n'a pas été utilisé
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant', valid: false },
        { status: 400 }
      )
    }

    // Chercher le token de réinitialisation
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token invalide', valid: false },
        { status: 400 }
      )
    }

    // Vérifier si le token a expiré
    if (new Date() > resetToken.expires) {
      // Supprimer le token expiré pour nettoyer la base
      await prisma.passwordResetToken.delete({
        where: { token }
      })
      
      return NextResponse.json(
        { error: 'Token expiré', valid: false },
        { status: 400 }
      )
    }

    // Vérifier si le token a déjà été utilisé
    if (resetToken.used) {
      return NextResponse.json(
        { error: 'Token déjà utilisé', valid: false },
        { status: 400 }
      )
    }

    // Token valide
    return NextResponse.json({
      valid: true,
      email: resetToken.email
    })

  } catch (error) {
    console.error('Erreur validation token:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', valid: false },
      { status: 500 }
    )
  }
}

/**
 * POST - Réinitialiser le mot de passe avec un token valide
 * Met à jour le mot de passe de l'utilisateur et invalide le token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données d'entrée
    const validationResult = resetPasswordSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const { token, password } = validationResult.data

    // Chercher le token de réinitialisation
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 400 }
      )
    }

    // Vérifier si le token a expiré
    if (new Date() > resetToken.expires) {
      // Supprimer le token expiré
      await prisma.passwordResetToken.delete({
        where: { token }
      })
      
      return NextResponse.json(
        { error: 'Token expiré' },
        { status: 400 }
      )
    }

    // Vérifier si le token a déjà été utilisé
    if (resetToken.used) {
      return NextResponse.json(
        { error: 'Token déjà utilisé' },
        { status: 400 }
      )
    }

    // Chercher l'utilisateur associé à cet email
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 400 }
      )
    }

    // Hasher le nouveau mot de passe avec le même algorithme que l'inscription
    const hashedPassword = await bcrypt.hash(password, 12)

    // Transaction pour mettre à jour le mot de passe et invalider tous les tokens
    await prisma.$transaction([
      // Mettre à jour le mot de passe de l'utilisateur
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      }),
      
      // Invalider tous les tokens de réinitialisation pour cet email
      // (sécurité : empêche la réutilisation de tokens multiples)
      prisma.passwordResetToken.deleteMany({
        where: { email: resetToken.email }
      })
    ])

    // Log de sécurité pour audit
    await prisma.authenticationLog.create({
      data: {
        userId: user.id,
        event: 'PASSWORD_RESET_SUCCESS',
        success: true,
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: JSON.stringify({
          email: user.email,
          tokenUsed: token.substring(0, 8) + '...' // Log partiel du token pour audit
        })
      }
    })

    return NextResponse.json({
      message: 'Mot de passe réinitialisé avec succès',
      passwordReset: true
    })

  } catch (error) {
    console.error('Erreur reset-password:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 