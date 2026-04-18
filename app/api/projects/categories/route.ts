import { NextResponse } from 'next/server'
import { getProjectCategories, getPopularTags } from '@/lib/projects'

// GET /api/projects/categories - Get project categories and tags
export async function GET() {
  try {
    const [categories, tags] = await Promise.all([
      getProjectCategories(),
      getPopularTags(),
    ])

    return NextResponse.json({ categories, tags })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
