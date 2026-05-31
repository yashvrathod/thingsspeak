import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getChannelById } from '@/lib/channels'
import { pollChannelEvents } from '@/lib/socket-emitter'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const channelId = request.nextUrl.searchParams.get('channelId')
    const since = request.nextUrl.searchParams.get('since')

    if (!channelId) {
      return new Response('Missing channelId', { status: 400 })
    }

    if (since && isNaN(new Date(since).getTime())) {
      return new Response('Invalid date', { status: 400 })
    }

    const session = await getServerSession(authOptions)
    const channel = await getChannelById(channelId, session?.user?.id)

    if (!channel) {
      return new Response('Channel not found', { status: 404 })
    }

    const sinceDate = since ? new Date(since) : new Date()

    const encoder = new TextEncoder()
    let closed = false

    const stream = new ReadableStream({
      start: async (controller) => {
        const poll = async () => {
          if (closed) return
          try {
            const events = await pollChannelEvents(channelId, sinceDate)
            for (const event of events) {
              const payload = JSON.parse(event.payload)
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
            }
          } catch {
            // Connection likely closed
          }
          if (!closed) {
            setTimeout(poll, 2000)
          }
        }
        poll()
      },
      cancel() {
        closed = true
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error in SSE endpoint:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
