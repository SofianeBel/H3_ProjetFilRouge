import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, fingerprint } = await request.json()

    const visitor = await prisma.visitor.create({
      data: { name: name ?? null, email: email ?? null, fingerprint: fingerprint ?? null },
    })

    const conversation = await prisma.conversation.create({
      data: {
        visitorId: visitor.id,
        status: 'OPEN',
        lastMessageAt: new Date(),
      },
    })

    // In a real app, issue a signed token bound to visitor/conversation
    return NextResponse.json({ success: true, visitorId: visitor.id, conversationId: conversation.id })
  } catch (e) {
    console.error('chat/start error', e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
