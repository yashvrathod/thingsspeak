import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getChannelById } from '@/lib/channels'
import { getChannelDataPoints, formatDataForChart } from '@/lib/data'

// GET /api/channels/[id]/export - Export channel data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    const channel = await getChannelById(id, session?.user?.id)
    
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'json'
    const startDate = searchParams.get('start') ? new Date(searchParams.get('start')!) : undefined
    const endDate = searchParams.get('end') ? new Date(searchParams.get('end')!) : undefined

    const dataPoints = await getChannelDataPoints(id, {
      limit: 10000,
      startDate,
      endDate,
    })

    if (format === 'csv') {
      // Generate CSV
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

      const headers = ['timestamp', ...fieldLabels.filter(Boolean), 'latitude', 'longitude', 'status']
      
      const rows = dataPoints.map((point: typeof dataPoints[0]) => [
        point.createdAt.toISOString(),
        point.field1,
        point.field2,
        point.field3,
        point.field4,
        point.field5,
        point.field6,
        point.field7,
        point.field8,
        point.latitude,
        point.longitude,
        point.status,
      ].join(','))

      const csv = [headers.join(','), ...rows].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="channel-${id}-data.csv"`,
        },
      })
    }

    // Default JSON format
    return NextResponse.json({
      channel: {
        id: channel.id,
        name: channel.name,
        field1Label: channel.field1Label,
        field2Label: channel.field2Label,
        field3Label: channel.field3Label,
        field4Label: channel.field4Label,
        field5Label: channel.field5Label,
        field6Label: channel.field6Label,
        field7Label: channel.field7Label,
        field8Label: channel.field8Label,
      },
      data: formatDataForChart(dataPoints),
      count: dataPoints.length,
    })
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}
