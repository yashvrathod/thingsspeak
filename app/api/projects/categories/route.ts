import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCategories, getPopularTags } from '@/lib/projects-new'

export async function GET() {
  try {
    const [categories, tags] = await Promise.all([
      getCategories(),
      getPopularTags(),
    ])

    const categoriesWithCounts = await Promise.all(
      categories.map(async (name) => ({
        name,
        count: await prisma.project.count({ where: { category: name, isPublished: true } }),
      }))
    )

    return NextResponse.json({ categories: categoriesWithCounts, tags })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
