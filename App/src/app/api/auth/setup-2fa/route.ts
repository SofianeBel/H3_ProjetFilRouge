import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'

/**
 * GET /api/auth/setup-2fa
 * Génère un secret temporaire et une image QR pour activer 2FA
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      return NextResponse.json({ success: false, message: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const service = 'Cyna'
    const label = user.email
    const secret = authenticator.generateSecret()
    const otpauth = authenticator.keyuri(label, service, secret)
    const qrDataUrl = await QRCode.toDataURL(otpauth)

    return NextResponse.json({ success: true, secret, otpauth, qrDataUrl })
  } catch (error) {
    console.error('Erreur setup 2FA:', error)
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
  }
}

