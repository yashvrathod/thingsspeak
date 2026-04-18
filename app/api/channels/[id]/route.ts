import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getChannelById, updateChannel, deleteChannel, regenerateChannelKeys } from '@/lib/channels'
import { getChannelDataPoints, formatDataForChart, getChannelDataPointsCount } from '@/lib/data'

// GET /api/channels/[id] - Get channel details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    const searchParams = request.nextUrl.searchParams
    const includeData = searchParams.get('data') === 'true'
    const dataLimit = parseInt(searchParams.get('limit') || '100')
    const hours = parseInt(searchParams.get('hours') || '24')

    const channel = await getChannelById(id, session?.user?.id)
    
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    const response: any = { channel }

    if (includeData) {
      // Get recent data points
      const dataPoints = await getChannelDataPoints(id, { limit: dataLimit })
      const totalCount = await getChannelDataPointsCount(id)
      
      response.data = {
        points: formatDataForChart(dataPoints),
        total: totalCount,
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching channel:', error)
    return NextResponse.json({ error: 'Failed to fetch channel' }, { status: 500 })
  }
}

// PATCH /api/channels/[id] - Update channel
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const channel = await updateChannel(id, session.user.id, body)
    
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    return NextResponse.json({ channel })
  } catch (error) {
    console.error('Error updating channel:', error)
    return NextResponse.json({ error: 'Failed to update channel' }, { status: 500 })
  }
}

// DELETE /api/channels/[id] - Delete channel
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const success = await deleteChannel(id, session.user.id)
    
    if (!success) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting channel:', error)
    return NextResponse.json({ error: 'Failed to delete channel' }, { status: 500 })
  }
}
