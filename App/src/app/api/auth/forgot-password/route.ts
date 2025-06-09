import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { Resend } from 'resend'
import crypto from 'crypto'

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * API pour demander une réinitialisation de mot de passe
 * POST /api/auth/forgot-password
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validation de l'email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide.' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Pour des raisons de sécurité, on retourne toujours le même message
    // même si l'utilisateur n'existe pas (évite l'énumération d'emails)
    const successMessage = 'Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.'

    if (!user) {
      // Log de tentative sur email inexistant pour monitoring
      console.warn(`Tentative de reset password sur email inexistant: ${email}`)
      return NextResponse.json({ message: successMessage })
    }

    // Vérifier si l'utilisateur a un mot de passe (pas un compte OAuth uniquement)
    if (!user.password) {
      console.warn(`Tentative de reset password sur compte OAuth: ${email}`)
      return NextResponse.json({ 
        error: 'Ce compte utilise une connexion externe (Google, Microsoft). Utilisez votre provider habituel pour vous connecter.' 
      }, { status: 400 })
    }

    // Générer un token sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 3600000) // 1 heure

    // Supprimer les anciens tokens pour cet email
    await prisma.passwordResetToken.deleteMany({
      where: { email: email.toLowerCase() }
    })

    // Créer le nouveau token
    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token: resetToken,
        expires: tokenExpiry,
      }
    })

    // Construire l'URL de réinitialisation
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

    // Envoyer l'email de réinitialisation
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: email,
        subject: 'Réinitialisation de votre mot de passe - Cyna',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Cyna - Cybersécurité</h1>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-bottom: 20px;">Réinitialisation de mot de passe</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Bonjour <strong>${user.name || 'Utilisateur'}</strong>,
              </p>
              
              <p style="color: #666; line-height: 1.6;">
                Vous avez demandé la réinitialisation de votre mot de passe. 
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; font-size: 14px;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
              </p>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  ⚠️ <strong>Important :</strong> Ce lien expire dans 1 heure pour votre sécurité.
                  Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6; font-size: 14px;">
                Cordialement,<br>
                L'équipe Cyna
              </p>
            </div>
            
            <div style="background: #343a40; padding: 20px; text-align: center;">
              <p style="color: #adb5bd; margin: 0; font-size: 12px;">
                Cyna - Solutions de cybersécurité pour PME et MSP<br>
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
            </div>
          </div>
        `
      })

      console.log(`Email de reset password envoyé à: ${email}`)
      
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError)
      
      // Supprimer le token si l'email n'a pas pu être envoyé
      await prisma.passwordResetToken.delete({
        where: { token: resetToken }
      })
      
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: successMessage })

  } catch (error) {
    console.error('Erreur lors de la demande de reset password:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    )
  }
} 