import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { regenerateChannelKeys } from '@/lib/channels'

// POST /api/channels/[id]/keys - Regenerate API keys
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const channel = await regenerateChannelKeys(id, session.user.id)
    
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      readApiKey: channel.readApiKey,
      writeApiKey: channel.writeApiKey,
    })
  } catch (error) {
    console.error('Error regenerating keys:', error)
    return NextResponse.json({ error: 'Failed to regenerate keys' }, { status: 500 })
  }
}
