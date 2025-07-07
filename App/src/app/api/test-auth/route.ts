import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * Test simple d'authentification sans NextAuth
 * pour débugger le problème
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔍 Body reçu:', body)
    
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json({
        error: 'Email et password requis'
      }, { status: 400 })
    }
    
    // Chercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json({
        error: 'Utilisateur non trouvé'
      }, { status: 401 })
    }
    
    if (!user.password) {
      return NextResponse.json({
        error: 'Utilisateur sans mot de passe'
      }, { status: 401 })
    }
    
    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
      return NextResponse.json({
        error: 'Mot de passe incorrect'
      }, { status: 401 })
    }
    
    // Succès
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
    
  } catch (error) {
    console.error('Erreur test auth:', error)
    return NextResponse.json({
      error: 'Erreur serveur'
    }, { status: 500 })
  }
} 