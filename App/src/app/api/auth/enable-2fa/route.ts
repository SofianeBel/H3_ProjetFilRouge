import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { authenticator } from 'otplib'

/**
 * POST /api/auth/enable-2fa
 * Active le 2FA pour l'utilisateur connecté après vérification d'un OTP
 * Body: { token: string, secret?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Non authentifié' }, { status: 401 })
    }

    const { token, secret } = await request.json()
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token TOTP requis' }, { status: 400 })
    }

    let user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      return NextResponse.json({ success: false, message: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Si un secret temporaire est fourni (setup), sinon on utilise le secret stocké
    const otpSecret = secret || user.twoFactorSecret
    if (!otpSecret) {
      return NextResponse.json({ success: false, message: 'Secret TOTP manquant' }, { status: 400 })
    }

    const isValid = authenticator.verify({ token, secret: otpSecret })
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Code TOTP invalide' }, { status: 400 })
    }

    // Activer 2FA et stocker le secret
    user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: otpSecret
      },
      select: { id: true, twoFactorEnabled: true }
    })

    await prisma.authenticationLog.create({
      data: {
        userId: session.user.id,
        event: 'TWO_FACTOR_ENABLED',
        provider: 'credentials',
        success: true,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ success: true, message: '2FA activé' })
  } catch (error) {
    console.error('Erreur enable 2FA:', error)
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
  }
}

