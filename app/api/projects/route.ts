import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getProjects, getCategories, getPopularTags, createProject } from '@/lib/projects-new'

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') || undefined
    const type = searchParams.get('type') as 'BASIC' | 'IOT' | undefined
    const difficulty = searchParams.get('difficulty') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | undefined
    const search = searchParams.get('search') || undefined
    const tags = searchParams.get('tags')?.split(',') || undefined
    const featured = searchParams.get('featured') === 'true' ? true : undefined
    const admin = searchParams.get('admin') === 'true'
    
    // Only allow admin view for actual admins
    const isAdmin = session?.user?.role === 'ADMIN' && admin

    let projects
    if (isAdmin) {
      // Admin sees all projects including unpublished
      const { getAllProjectsAdmin } = await import('@/lib/projects-new')
      projects = await getAllProjectsAdmin()
    } else {
      // Public sees only published
      projects = await getProjects({
        category,
        type,
        difficulty,
        tags,
        search,
        featured,
      })
    }

    return NextResponse.json({ projects, total: projects.length })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects - Create a new project (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      type,
      imageUrl, 
      videoUrl,
      diagramUrl,
      driveLink, 
      components,
      connections,
      steps,
      working,
      references,
      code,
      fieldLabels,
      tags, 
      category,
      difficulty,
      duration,
      featured,
    } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const project = await createProject(
      session.user.id,
      {
        title,
        description,
        type: type || 'BASIC',
        imageUrl,
        videoUrl,
        diagramUrl,
        driveLink,
        components: components || [],
        connections: connections || [],
        steps: steps || [],
        working,
        references: references || [],
        code,
        fieldLabels: fieldLabels || [],
        tags: tags || [],
        category,
        difficulty: difficulty || 'BEGINNER',
        duration,
      }
    )

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
