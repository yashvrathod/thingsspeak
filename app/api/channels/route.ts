import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createChannel, getUserChannels } from '@/lib/channels'
import { prisma } from '@/lib/db'

// GET /api/channels - Get all user channels
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const channels = await getUserChannels(session.user.id)
    
    return NextResponse.json({ channels })
  } catch (error) {
    console.error('Error fetching channels:', error)
    return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 })
  }
}

// POST /api/channels - Create a new channel
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, isPublic, field1Label, field2Label, field3Label, field4Label, field5Label, field6Label, field7Label, field8Label } = body

    if (!name) {
      return NextResponse.json({ error: 'Channel name is required' }, { status: 400 })
    }

    // Check if user has reached channel limit (free tier: 4 channels)
    const existingChannels = await prisma.channel.count({
      where: { userId: session.user.id },
    })

    if (existingChannels >= 10) {
      return NextResponse.json({ error: 'Channel limit reached' }, { status: 403 })
    }

    const channel = await createChannel({
      name,
      description,
      isPublic,
      userId: session.user.id,
      field1Label,
      field2Label,
      field3Label,
      field4Label,
      field5Label,
      field6Label,
      field7Label,
      field8Label,
    })

    return NextResponse.json({ channel }, { status: 201 })
  } catch (error) {
    console.error('Error creating channel:', error)
    return NextResponse.json({ error: 'Failed to create channel' }, { status: 500 })
  }
}
