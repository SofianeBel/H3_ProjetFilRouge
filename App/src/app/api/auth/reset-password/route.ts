import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * API pour réinitialiser le mot de passe avec un token valide
 * POST /api/auth/reset-password
 */
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    // Validation des données
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token et mot de passe requis.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères.' },
        { status: 400 }
      )
    }

    // Vérifier le token de réinitialisation
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré.' },
        { status: 400 }
      )
    }

    // Vérifier si le token n'est pas expiré
    if (resetToken.expires < new Date()) {
      // Supprimer le token expiré
      await prisma.passwordResetToken.delete({
        where: { token }
      })
      
      return NextResponse.json(
        { error: 'Token expiré. Veuillez demander un nouveau lien de réinitialisation.' },
        { status: 400 }
      )
    }

    // Vérifier si le token n'a pas déjà été utilisé
    if (resetToken.used) {
      return NextResponse.json(
        { error: 'Ce token a déjà été utilisé.' },
        { status: 400 }
      )
    }

    // Trouver l'utilisateur correspondant
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable.' },
        { status: 404 }
      )
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Transaction pour mettre à jour le mot de passe et marquer le token comme utilisé
    await prisma.$transaction(async (tx) => {
      // Mettre à jour le mot de passe
      await tx.user.update({
        where: { id: user.id },
        data: { 
          password: hashedPassword,
          // Optionnel : forcer la vérification email si pas déjà fait
          emailVerified: user.emailVerified || new Date()
        }
      })

      // Marquer le token comme utilisé
      await tx.passwordResetToken.update({
        where: { token },
        data: { used: true }
      })

      // Supprimer tous les autres tokens de reset pour cet email
      await tx.passwordResetToken.deleteMany({
        where: { 
          email: resetToken.email,
          token: { not: token }
        }
      })
    })

    // Log de sécurité
    console.log(`Mot de passe réinitialisé pour: ${user.email} (ID: ${user.id})`)

    return NextResponse.json({
      message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.'
    })

  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    )
  }
}

/**
 * API pour vérifier la validité d'un token de réinitialisation
 * GET /api/auth/reset-password?token=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token requis.' },
        { status: 400 }
      )
    }

    // Vérifier le token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json(
        { valid: false, error: 'Token invalide.' },
        { status: 400 }
      )
    }

    // Vérifier l'expiration
    if (resetToken.expires < new Date()) {
      // Supprimer le token expiré
      await prisma.passwordResetToken.delete({
        where: { token }
      })
      
      return NextResponse.json(
        { valid: false, error: 'Token expiré.' },
        { status: 400 }
      )
    }

    // Vérifier si déjà utilisé
    if (resetToken.used) {
      return NextResponse.json(
        { valid: false, error: 'Token déjà utilisé.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      email: resetToken.email,
      expiresAt: resetToken.expires
    })

  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    )
  }
} 