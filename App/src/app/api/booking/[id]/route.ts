/**
 * API pour les opérations sur une réservation spécifique
 * PATCH pour modifier le statut, DELETE pour supprimer
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

/**
 * Schéma de validation pour la mise à jour d'une réservation
 */
const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Statut invalide' })
  }).optional(),
  preferredDate: z.string()
    .refine((val) => {
      if (!val) return true // Optionnel
      const date = new Date(val)
      const now = new Date()
      return !isNaN(date.getTime()) && date > now
    }, {
      message: 'La date choisie doit être dans le futur'
    })
    .optional(),
  message: z.string()
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères')
    .optional()
})

/**
 * GET /api/booking/[id] - Récupère une réservation spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams

    // Je vérifie que l'ID est valide
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'ID de réservation manquant ou invalide' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({ booking })

  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/booking/[id] - Met à jour une réservation (statut, date, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const body = await request.json()

    // Je vérifie que l'ID est valide
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'ID de réservation manquant ou invalide' },
        { status: 400 }
      )
    }

    // Validation des données avec Zod
    const validatedData = updateBookingSchema.parse(body)

    // Je vérifie que la réservation existe
    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    // Si on change la date, je vérifie les conflits
    if (validatedData.preferredDate) {
      const newDate = new Date(validatedData.preferredDate)
      const timeBuffer = 2 * 60 * 60 * 1000 // 2 heures

      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          id: { not: id }, // Exclure la réservation actuelle
          preferredDate: {
            gte: new Date(newDate.getTime() - timeBuffer),
            lte: new Date(newDate.getTime() + timeBuffer)
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
    }

    // Préparation des données de mise à jour
    const updateData: Record<string, unknown> = {
      ...validatedData,
      ...(validatedData.preferredDate && {
        preferredDate: new Date(validatedData.preferredDate)
      }),
      updatedAt: new Date()
    }

    // Mise à jour de la réservation
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData
    })

    console.log(`Réservation ${id} mise à jour:`, updatedBooking.status)

    return NextResponse.json({
      message: 'Réservation mise à jour avec succès',
      booking: updatedBooking
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
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

    console.error('Erreur lors de la mise à jour de la réservation:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/booking/[id] - Supprime une réservation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams

    // Je vérifie que l'ID est valide
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'ID de réservation manquant ou invalide' },
        { status: 400 }
      )
    }

    // Je vérifie que la réservation existe
    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    // Suppression de la réservation
    await prisma.booking.delete({
      where: { id }
    })

    console.log(`Réservation ${id} supprimée`)

    return NextResponse.json({
      message: 'Réservation supprimée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 