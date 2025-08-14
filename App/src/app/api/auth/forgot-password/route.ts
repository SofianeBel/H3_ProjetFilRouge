import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { isRateLimited, recordAttempt, getClientIP, getTimeUntilUnblock } from '@/lib/rate-limit'

// Initialisation de Resend pour l'envoi d'emails
const resend = new Resend(process.env.RESEND_API_KEY)

// Schéma de validation pour la demande de réinitialisation
const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide')
})

/**
 * API pour demander une réinitialisation de mot de passe
 * POST /api/auth/forgot-password
 * 
 * Génère un token sécurisé et envoie un email de réinitialisation
 * Retourne toujours un message neutre pour éviter la fuite d'informations
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request as unknown as Request)
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: `Trop de tentatives. Réessayez dans ${getTimeUntilUnblock(ip)}s.` }, { status: 429 })
    }
    const body = await request.json()
    
    // Validation des données d'entrée
    const validationResult = forgotPasswordSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Email invalide',
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    // Vérifier si l'utilisateur existe (sans révéler l'information)
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Toujours retourner le même message pour éviter l'énumération d'emails
    const neutralMessage = 'Si cet email existe dans notre système, un lien de réinitialisation a été envoyé'

    // Si l'utilisateur n'existe pas, on retourne quand même un succès
    if (!user) {
      return NextResponse.json({
        message: neutralMessage
      })
    }

    // Supprimer les anciens tokens de réinitialisation pour cet email
    // Cela évite l'accumulation de tokens et limite les tentatives
    await prisma.passwordResetToken.deleteMany({
      where: { email }
    })

    // Générer un token cryptographiquement sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Définir l'expiration à 1 heure (sécurité)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 heure

    // Sauvegarder le token en base de données
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expires: expiresAt,
        used: false
      }
    })

    // Construire l'URL de réinitialisation
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

    // Envoyer l'email de réinitialisation via Resend
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'contact@cyna-it.fr',
        to: email,
        subject: 'Réinitialisation de votre mot de passe - Cyna',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #A67FFB; margin: 0; font-size: 28px;">Cyna</h1>
                <p style="color: #64748b; margin: 5px 0 0 0;">Cybersécurité pour PME et MSP</p>
              </div>
              
              <h2 style="color: #1e293b; margin-bottom: 20px;">Réinitialisation de mot de passe</h2>
              
              <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
                Bonjour,
              </p>
              
              <p style="color: #475569; line-height: 1.6; margin-bottom: 25px;">
                Vous avez demandé la réinitialisation de votre mot de passe sur Cyna. 
                Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #A67FFB, #8B5CF6); 
                          color: white; 
                          padding: 14px 28px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          display: inline-block; 
                          font-weight: 600;
                          font-size: 16px;">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              
              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 25px 0;">
                <p style="color: #92400e; margin: 0; font-weight: 600;">⚠️ Important :</p>
                <p style="color: #92400e; margin: 5px 0 0 0; font-size: 14px;">
                  Ce lien expire dans <strong>1 heure</strong> pour votre sécurité.
                </p>
              </div>
              
              <p style="color: #475569; line-height: 1.6; margin-bottom: 15px;">
                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. 
                Votre mot de passe actuel reste inchangé.
              </p>
              
              <p style="color: #475569; line-height: 1.6; margin-bottom: 25px;">
                Pour votre sécurité, ne partagez jamais ce lien avec personne.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
              
              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                Cet email a été envoyé automatiquement par Cyna.<br>
                Si vous avez des questions, contactez-nous à contact@cyna-it.fr
              </p>
            </div>
          </div>
        `
      })

      // Log de sécurité pour audit
      await prisma.authenticationLog.create({
        data: {
          userId: user.id,
          event: 'PASSWORD_RESET_REQUEST',
          success: true,
          ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
          userAgent: request.headers.get('user-agent') || 'unknown',
          details: JSON.stringify({
            email: user.email,
            tokenExpires: expiresAt.toISOString()
          })
        }
      })

    } catch (emailError) {
      console.error('Erreur envoi email de réinitialisation:', emailError)
      
      // Supprimer le token si l'email n'a pas pu être envoyé
      await prisma.passwordResetToken.deleteMany({
        where: { email }
      })
      
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    const resp = NextResponse.json({
      message: neutralMessage
    })
    recordAttempt(ip, true)
    return resp

  } catch (error) {
    const ip = getClientIP(request as unknown as Request)
    recordAttempt(ip, false)
    console.error('Erreur forgot-password:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 