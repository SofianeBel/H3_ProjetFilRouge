import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited, recordAttempt, getTimeUntilUnblock, getClientIP } from '@/lib/rate-limit'

/**
 * Proxy de connexion pour appliquer un rate limiting serveur côté API
 * POST /api/auth/login
 * Body: { email, password, otp? }
 */
export async function POST(request: NextRequest) {
  const ip = getClientIP(request as unknown as Request)
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: `Trop de tentatives. Réessayez dans ${getTimeUntilUnblock(ip)}s.` }, { status: 429 })
  }
  try {
    const body = await request.json()
    // Rediriger vers le handler NextAuth
    const url = new URL('/api/auth/callback/credentials', process.env.NEXTAUTH_URL)
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        csrfToken: '',
        email: body.email,
        password: body.password,
        otp: body.otp || ''
      }) as unknown as BodyInit
    })
    recordAttempt(ip, response.ok)
    return response
  } catch (e) {
    recordAttempt(ip, false)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

