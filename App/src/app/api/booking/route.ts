/**
 * API pour la gestion des réservations de rendez-vous
 * Permet de créer, lire, modifier et supprimer des demandes de réservation
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

/**
 * Schéma de validation pour les données de réservation
 */
const bookingSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z.string()
    .email('Format d\'email invalide')
    .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
  company: z.string()
    .min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères')
    .max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères'),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^[\d\s\-\+\(\)]{8,20}$/.test(val), {
      message: 'Format de téléphone invalide'
    }),
  service: z.enum(['SOC', 'Audit', 'Pentest', 'CERT'], {
    errorMap: () => ({ message: 'Service invalide' })
  }),
  preferredDate: z.string()
    .refine((val) => {
      const date = new Date(val)
      const now = new Date()
      // Je vérifie que la date est valide et dans le futur
      return !isNaN(date.getTime()) && date > now
    }, {
      message: 'La date choisie doit être dans le futur'
    }),
  message: z.string()
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères')
    .optional()
})

/**
 * GET /api/booking - Récupère la liste des réservations avec pagination et filtres
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Je récupère les paramètres de pagination et filtrage
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') // PENDING, CONFIRMED, COMPLETED, CANCELLED
    const service = searchParams.get('service') // SOC, Audit, Pentest, CERT
    const search = searchParams.get('search') // Recherche par nom ou email
    
    const offset = (page - 1) * limit

    // Construction des filtres pour Prisma avec types corrects
    const where: Record<string, unknown> = {}
    
    if (status && ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      where.status = status
    }
    
    if (service && ['SOC', 'Audit', 'Pentest', 'CERT'].includes(service)) {
      where.service = service
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Récupération des réservations avec pagination
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.count({ where })
    ])

    // Calcul des métadonnées de pagination
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/booking - Crée une nouvelle demande de réservation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données avec Zod
    const validatedData = bookingSchema.parse(body)
    
    // Je vérifie qu'il n'y a pas déjà une réservation trop proche dans le temps
    const preferredDate = new Date(validatedData.preferredDate)
    const timeBuffer = 2 * 60 * 60 * 1000 // 2 heures en millisecondes
    
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        preferredDate: {
          gte: new Date(preferredDate.getTime() - timeBuffer),
          lte: new Date(preferredDate.getTime() + timeBuffer)
        },
        status: {
          in: ['CONFIRMED', 'PENDING']
        }
      }
    })
    
    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Un créneau est déjà réservé à cette heure. Veuillez choisir un autre horaire.' },
        { status: 409 }
      )
    }

    // Création de la réservation
    const booking = await prisma.booking.create({
      data: {
        ...validatedData,
        preferredDate: new Date(validatedData.preferredDate),
        status: 'PENDING'
      }
    })

    // TODO: Envoyer un email de confirmation (à implémenter plus tard)
    console.log('Nouvelle réservation créée:', booking.id)

    return NextResponse.json(
      { 
        message: 'Demande de réservation créée avec succès',
        booking: {
          id: booking.id,
          status: booking.status,
          preferredDate: booking.preferredDate
        }
      },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Je retourne les erreurs de validation de manière claire
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la création de la réservation:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 