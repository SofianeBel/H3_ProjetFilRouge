import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/test-db
 * Route de test pour vérifier la connexion à la base de données
 */
export async function GET() {
  try {
    // Test simple : compter les contacts
    const contactCount = await prisma.contact.count()
    
    return NextResponse.json({
      success: true,
      message: "Connexion à la base de données réussie",
      data: {
        contactCount,
        database: "SQLite (dev)",
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Erreur test DB:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur de connexion à la base de données",
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 