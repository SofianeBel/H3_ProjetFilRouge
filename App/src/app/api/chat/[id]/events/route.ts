import { NextRequest } from 'next/server'
import { subscribe } from '@/lib/pubsub'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const channel = `chat:${params.id}`
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const write = (data: string) => controller.enqueue(encoder.encode(data))

      // Heartbeat
      const heartbeat = setInterval(() => write(`event: ping\ndata: ${Date.now()}\n\n`), 15000)
      write(`event: open\ndata: connected\n\n`)

      const unsubscribe = subscribe(channel, (event) => {
        write(`event: ${event.type}\n`)
        write(`data: ${JSON.stringify(event.payload)}\n\n`)
      })

      const close = () => {
        clearInterval(heartbeat)
        unsubscribe()
        controller.close()
      }

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
