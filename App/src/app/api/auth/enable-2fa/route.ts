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

    let body: any
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json({ success: false, message: 'Corps JSON invalide' }, { status: 400 })
    }

    const { token, secret } = body || {}
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token TOTP requis' }, { status: 400 })
    }

    if (!/^\d{6}$/.test(String(token))) {
      return NextResponse.json({ success: false, message: 'Format de code TOTP invalide' }, { status: 400 })
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

    let isValid = false
    try {
      isValid = authenticator.verify({ token: String(token), secret: String(otpSecret) })
    } catch (err) {
      console.error('Erreur vérification TOTP:', err)
      return NextResponse.json({ success: false, message: 'Erreur de vérification TOTP' }, { status: 400 })
    }
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Code TOTP invalide' }, { status: 400 })
    }

    // Activer 2FA et stocker le secret
    try {
      user = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          twoFactorEnabled: true,
          twoFactorSecret: otpSecret
        },
        select: { id: true }
      })
    } catch (e: any) {
      const message = String(e?.message || '')
      if (message.includes('Unknown argument `twoFactorEnabled`')) {
        // Fallback Windows: client Prisma non régénéré → mise à jour SQL brute
        await prisma.$executeRawUnsafe(
          'UPDATE "users" SET "twoFactorEnabled" = 1, "twoFactorSecret" = ? WHERE "id" = ?',
          String(otpSecret),
          String(session.user.id)
        )
      } else {
        throw e
      }
    }

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
  } catch (error: any) {
    console.error('Erreur enable 2FA:', error)
    return NextResponse.json({ success: false, message: process.env.NODE_ENV !== 'production' ? (error?.message || 'Erreur serveur') : 'Erreur serveur' }, { status: 500 })
  }
}

