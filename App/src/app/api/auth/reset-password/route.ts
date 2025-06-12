import { NextRequest, NextResponse } from 'next/server'

/**
 * API temporaire pour réinitialiser le mot de passe
 * Permet le build sans erreurs Prisma
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Service temporairement indisponible' },
    { status: 503 }
  )
}

/**
 * API temporaire pour vérifier la validité d'un token
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Service temporairement indisponible' },
    { status: 503 }
  )
} 