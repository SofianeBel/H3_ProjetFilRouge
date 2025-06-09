import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * API pour créer un utilisateur admin - DÉVELOPPEMENT UNIQUEMENT
 * Cette API doit être supprimée ou sécurisée en production
 */
export async function POST(request: NextRequest) {
  // Vérification de l'environnement - SEULEMENT en développement
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { 
        error: 'Cette API n\'est pas disponible en production pour des raisons de sécurité.',
        code: 'PRODUCTION_DISABLED'
      }, 
      { status: 403 }
    )
  }

  // Vérification supplémentaire : clé secrète de développement
  const devKey = request.headers.get('x-dev-key')
  const expectedDevKey = process.env.DEV_ADMIN_KEY || 'dev-only-key-change-me'
  
  if (devKey !== expectedDevKey) {
    return NextResponse.json(
      { 
        error: 'Clé de développement invalide.',
        code: 'INVALID_DEV_KEY'
      }, 
      { status: 401 }
    )
  }

  try {
    const { name, email, password } = await request.json()

    // Validation des données
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères.' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà.' },
        { status: 409 }
      )
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur admin
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'SUPER_ADMIN', // Rôle le plus élevé pour le dev
        emailVerified: new Date(), // Pré-vérifié en dev
      }
    })

    // Log de création d'admin pour audit
    console.warn(`🚨 ADMIN CRÉÉ EN DÉVELOPPEMENT : ${email} (ID: ${user.id})`)

    return NextResponse.json({
      message: 'Utilisateur admin créé avec succès (développement uniquement)',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    )
  }
}

/**
 * GET - Informations sur l'API (pour debug)
 */
export async function GET() {
  return NextResponse.json({
    api: 'create-admin',
    environment: process.env.NODE_ENV,
    available: process.env.NODE_ENV === 'development',
    message: process.env.NODE_ENV === 'production' 
      ? 'Cette API est désactivée en production.'
      : 'Cette API est disponible uniquement en développement.',
    usage: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-dev-key': 'Clé de développement requise'
      },
      body: {
        name: 'string',
        email: 'string', 
        password: 'string (min 6 caractères)'
      }
    }
  })
} 