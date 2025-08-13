import { NextRequest } from 'next/server'
import { auth } from '@/auth'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes((session.user.role as string) || '')) {
    return new Response('Unauthorized', { status: 403 })
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const write = (data: string) => controller.enqueue(encoder.encode(data))

      // Heartbeat
      const heartbeat = setInterval(() => write(`event: ping\ndata: ${Date.now()}\n\n`), 15000)

      // Placeholder: immediate open event; real impl should push on DB triggers or polling
      write(`event: open\ndata: connected\n\n`)

      const close = () => {
        clearInterval(heartbeat)
        controller.close()
      }

      // Abort handling
      req.signal.addEventListener('abort', close)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
