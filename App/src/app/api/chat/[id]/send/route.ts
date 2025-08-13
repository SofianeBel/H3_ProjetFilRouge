import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publish } from '@/lib/pubsub'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { content } = await request.json()
    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, message: 'Content required' }, { status: 400 })
    }

    const msg = await prisma.message.create({
      data: {
        conversationId: params.id,
        senderType: 'VISITOR',
        content: content.trim(),
      },
    })

    await prisma.conversation.update({ where: { id: params.id }, data: { lastMessageAt: msg.createdAt } })

    publish(`chat:${params.id}`, { type: 'message', payload: { id: msg.id, content: msg.content, senderType: msg.senderType, createdAt: msg.createdAt } })

    return NextResponse.json({ success: true, message: msg })
  } catch (e) {
    console.error('chat/send error', e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
