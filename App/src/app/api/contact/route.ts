import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

// Initialisation de Resend pour l'envoi d'emails
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Schéma de validation pour les demandes de contact
 * Utilise Zod pour valider les données entrantes
 */
const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  company: z.string().optional(),
  phone: z.string().optional(),
  service: z.enum(["SOC", "Audit", "Pentest", "CERT", "Autre"]).optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
})

/**
 * POST /api/contact
 * Traite les demandes de contact et envoie un email de notification
 */
export async function POST(request: NextRequest) {
  try {
    // Parse et validation des données
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // Sauvegarde en base de données avec Prisma
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company,
        phone: validatedData.phone,
        service: validatedData.service,
        message: validatedData.message,
      }
    })

    console.log('Contact créé avec succès:', contact.id)

    // Envoi de l'email de notification (si Resend est configuré)
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: ['contact@cyna-it.fr'], // Email de réception
          subject: `Nouvelle demande de contact - ${validatedData.service || 'Général'}`,
          html: `
            <h2>Nouvelle demande de contact</h2>
            <p><strong>Nom:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            ${validatedData.company ? `<p><strong>Entreprise:</strong> ${validatedData.company}</p>` : ''}
            ${validatedData.phone ? `<p><strong>Téléphone:</strong> ${validatedData.phone}</p>` : ''}
            ${validatedData.service ? `<p><strong>Service:</strong> ${validatedData.service}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
          `,
        })

        // Email de confirmation au client
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: [validatedData.email],
          subject: 'Confirmation de votre demande - Cyna',
          html: `
            <h2>Merci pour votre demande</h2>
            <p>Bonjour ${validatedData.name},</p>
            <p>Nous avons bien reçu votre demande concernant nos services de cybersécurité.</p>
            <p>Notre équipe vous contactera dans les plus brefs délais.</p>
            <br>
            <p>Cordialement,</p>
            <p>L'équipe Cyna</p>
          `,
        })
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError)
        // On continue même si l'email échoue
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Votre demande a été envoyée avec succès. Nous vous contacterons rapidement." 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur API contact:', error)

    // Erreur de validation Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Données invalides", 
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    // Erreur générique
    return NextResponse.json(
      { 
        success: false, 
        message: "Une erreur est survenue. Veuillez réessayer." 
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/contact
 * Retourne les informations de contact (pour tests)
 */
export async function GET() {
  return NextResponse.json({
    message: "API Contact Cyna - Utilisez POST pour envoyer une demande",
    endpoints: {
      POST: "/api/contact - Envoyer une demande de contact"
    },
    schema: {
      name: "string (requis, min 2 caractères)",
      email: "string (requis, format email)",
      company: "string (optionnel)",
      phone: "string (optionnel)", 
      service: "enum: SOC|Audit|Pentest|CERT|Autre (optionnel)",
      message: "string (requis, min 10 caractères)"
    }
  })
} 