import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { activateProject } from '@/lib/projects-new'

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

    const result = await activateProject(session.user.id, id)
    
    return NextResponse.json({ 
      userProject: result,
      alreadyActivated: result.alreadyActivated 
    })
  } catch (error: any) {
    console.error('Error activating project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to activate project' },
      { status: 500 }
    )
  }
}
