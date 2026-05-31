import { NextRequest, NextResponse } from 'next/server'
import { getChannelDataPoints, formatDataForChart } from '@/lib/data'
import { getChannelByReadKey } from '@/lib/channels'
import { checkRateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// GET /api/data/read?read_api_key=xxx&results=100
// Public endpoint — uses channel read API key for auth
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const readApiKey = searchParams.get('read_api_key') || searchParams.get('api_key')
    const limit = Math.min(parseInt(searchParams.get('results') || '100'), 8000)
    const startDate = searchParams.get('start') ? new Date(searchParams.get('start')!) : undefined
    const endDate = searchParams.get('end') ? new Date(searchParams.get('end')!) : undefined

    if (!readApiKey) {
      return NextResponse.json({ error: 'Missing read_api_key parameter' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { allowed } = await checkRateLimit(`read:${ip}`, 120)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const channel = await getChannelByReadKey(readApiKey)
    if (!channel) {
      return NextResponse.json({ error: 'Invalid read API key' }, { status: 401 })
    }

    const dataPoints = await getChannelDataPoints(channel.id, {
      limit,
      startDate,
      endDate,
    })

    const fieldLabels = [
      channel.field1Label,
      channel.field2Label,
      channel.field3Label,
      channel.field4Label,
      channel.field5Label,
      channel.field6Label,
      channel.field7Label,
      channel.field8Label,
    ]

    const format = searchParams.get('format') || 'json'

    if (format === 'csv') {
      const esc = (v: unknown) => {
        const s = v?.toString() ?? ''
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
      }

      const headers = ['created_at', ...fieldLabels.filter(Boolean), 'latitude', 'longitude', 'status']
      const rows = dataPoints.map((p) =>
        [
          esc(p.createdAt.toISOString()),
          esc(p.field1),
          esc(p.field2),
          esc(p.field3),
          esc(p.field4),
          esc(p.field5),
          esc(p.field6),
          esc(p.field7),
          esc(p.field8),
          esc(p.latitude),
          esc(p.longitude),
          esc(p.status),
        ].join(',')
      )
      const csv = [headers.join(','), ...rows].join('\n')
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="channel-${channel.id}.csv"`,
        },
      })
    }

    return NextResponse.json({
      channel: { id: channel.id, name: channel.name },
      feeds: formatDataForChart(dataPoints),
      count: dataPoints.length,
    })
  } catch (error) {
    console.error('Error in read endpoint:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
