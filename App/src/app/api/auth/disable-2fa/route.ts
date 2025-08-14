import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

/**
 * POST /api/auth/disable-2fa
 * Désactive le 2FA de l'utilisateur connecté (demande reauth côté UI)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Non authentifié' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: false, twoFactorSecret: null }
    })

    await prisma.authenticationLog.create({
      data: {
        userId: session.user.id,
        event: 'TWO_FACTOR_DISABLED',
        provider: 'credentials',
        success: true,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ success: true, message: '2FA désactivé' })
  } catch (error) {
    console.error('Erreur disable 2FA:', error)
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
  }
}

