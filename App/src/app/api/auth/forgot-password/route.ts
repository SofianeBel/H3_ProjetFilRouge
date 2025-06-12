import { NextRequest, NextResponse } from 'next/server'

/**
 * API temporaire pour demander une réinitialisation de mot de passe
 * Permet le build sans erreurs Prisma/Resend
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Service temporairement indisponible' },
    { status: 503 }
  )
} 