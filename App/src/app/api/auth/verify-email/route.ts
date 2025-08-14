import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signIn } from '@/auth'
import crypto from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * API de vérification d'email
 * POST: Envoyer un email de vérification
 * GET: Vérifier le token d'email
 */

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Ne pas révéler si l'email existe ou non pour la sécurité
      return NextResponse.json({
        message: 'Si cet email existe, un lien de vérification a été envoyé'
      })
    }

    // Si l'email est déjà vérifié
    if (user.emailVerified) {
      return NextResponse.json({
        message: 'Email déjà vérifié'
      })
    }

    // Supprimer les anciens tokens de vérification pour cet email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    })

    // Générer un nouveau token sécurisé
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 heures

    // Sauvegarder le token en base
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    })

    // URL de vérification
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

    // Envoyer l'email de vérification
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'contact@cyna-it.fr',
        to: email,
        subject: 'Vérifiez votre email - Cyna',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #A67FFB;">Vérifiez votre email</h2>
            <p>Bonjour,</p>
            <p>Merci de vous être inscrit sur Cyna ! Pour finaliser votre inscription, veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background: linear-gradient(135deg, #A67FFB, #8B5CF6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Vérifier mon email
              </a>
            </div>
            <p><strong>Ce lien expire dans 24 heures.</strong></p>
            <p>Si vous n'avez pas créé de compte sur Cyna, vous pouvez ignorer cet email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Cet email a été envoyé par Cyna - Cybersécurité pour PME et MSP
            </p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Email de vérification envoyé'
    })

  } catch (error) {
    console.error('Erreur verification email:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 400 }
      )
    }

    // Trouver le token de vérification
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 400 }
      )
    }

    // Vérifier si le token a expiré
    if (new Date() > verificationToken.expires) {
      // Supprimer le token expiré
      await prisma.verificationToken.delete({
        where: { token }
      })
      return NextResponse.json(
        { error: 'Token expiré' },
        { status: 400 }
      )
    }

    // Trouver l'utilisateur avec cet email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 400 }
      )
    }

    // Transaction pour marquer l'email comme vérifié et supprimer le token
    await prisma.$transaction([
      // Marquer l'email comme vérifié
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      }),
      // Supprimer le token utilisé
      prisma.verificationToken.delete({
        where: { token }
      })
    ])

    // Log de sécurité
    await prisma.authenticationLog.create({
      data: {
        userId: user.id,
        event: 'EMAIL_VERIFICATION',
        success: true,
        ipAddress: '127.0.0.1', // TODO: récupérer la vraie IP
        userAgent: 'email-verification',
        details: JSON.stringify({
          email: user.email
        })
      }
    })

    // Option A: tentative de création de session (si NextAuth v5 le permet)
    try {
      await signIn('credentials', {
        redirect: false,
        email: user.email,
        password: ''
      } as any)
    } catch {}

    return NextResponse.json({
      message: 'Email vérifié avec succès',
      verified: true
    })

  } catch (error) {
    console.error('Erreur vérification token:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 