import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { isRateLimited, recordAttempt, getClientIP } from '@/lib/rate-limit'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes((session.user.role as string) || '')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const take = parseInt(searchParams.get('limit') || '50')

    const messages = await prisma.message.findMany({
      where: { conversationId: params.id },
      orderBy: { createdAt: 'desc' },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take,
    })

    return NextResponse.json({ success: true, messages })
  } catch (e) {
    console.error('Messages GET error', e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes((session.user.role as string) || '')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 })
    }

    const ip = getClientIP(request as unknown as Request)
    if (isRateLimited(`chat-admin:${ip}`)) {
      return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 })
    }

    const userId = (session.user as any).id as string | undefined
    const body = await request.json()
    const { content } = body as { content: string }

    if (!content || !content.trim()) {
      recordAttempt(`chat-admin:${ip}`, false)
      return NextResponse.json({ success: false, message: 'Content required' }, { status: 400 })
    }

    const created = await prisma.message.create({
      data: {
        conversationId: params.id,
        senderType: 'ADMIN',
        senderUserId: userId ?? null,
        content: content.trim(),
      },
    })

    await prisma.conversation.update({
      where: { id: params.id },
      data: { lastMessageAt: created.createdAt },
    })

    recordAttempt(`chat-admin:${ip}`, true)

    return NextResponse.json({ success: true, message: created })
  } catch (e) {
    console.error('Messages POST error', e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
