import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { regenerateApiKey } from '@/lib/api-keys'

// POST /api/api-keys/[id]/regenerate - Regenerate an API key
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { expiresInDays } = body

    if (!expiresInDays || expiresInDays < 1 || expiresInDays > 365) {
      return NextResponse.json({ error: 'Invalid expiry time' }, { status: 400 })
    }

    const apiKey = await regenerateApiKey(params.id, session.user.id, expiresInDays)
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    return NextResponse.json({ apiKey })
  } catch (error) {
    console.error('Error regenerating API key:', error)
    return NextResponse.json({ error: 'Failed to regenerate API key' }, { status: 500 })
  }
}
