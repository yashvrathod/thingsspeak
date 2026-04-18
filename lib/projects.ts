import { prisma } from './db'

export interface CreateProjectInput {
  title: string
  description: string
  imageUrl?: string
  driveLink: string
  tags?: string[]
  category?: string
  userId: string
}

export interface UpdateProjectInput {
  title?: string
  description?: string
  imageUrl?: string
  driveLink?: string
  tags?: string[]
  category?: string
  isPublished?: boolean
}

export async function createProject(input: CreateProjectInput) {
  return await prisma.project.create({
    data: {
      title: input.title,
      description: input.description,
      imageUrl: input.imageUrl,
      driveLink: input.driveLink,
      tags: input.tags || [],
      category: input.category,
      userId: input.userId,
    },
  })
}

export async function getAllProjects(options?: {
  category?: string
  tag?: string
  publishedOnly?: boolean
  limit?: number
  offset?: number
}) {
  const { category, tag, publishedOnly = true, limit = 50, offset = 0 } = options || {}

  const whereClause: any = {}
  
  if (publishedOnly) {
    whereClause.isPublished = true
  }
  
  if (category) {
    whereClause.category = category
  }
  
  if (tag) {
    whereClause.tags = { has: tag }
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: whereClause,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.project.count({ where: whereClause }),
  ])

  return { projects, total }
}

export async function getProjectById(projectId: string) {
  return await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  })
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput
) {
  return await prisma.project.update({
    where: { id: projectId },
    data: input,
  })
}

export async function deleteProject(projectId: string) {
  await prisma.project.delete({
    where: { id: projectId },
  })
  return true
}

export async function getProjectCategories() {
  const categories = await prisma.project.groupBy({
    by: ['category'],
    where: { isPublished: true },
    _count: { category: true },
  })

  return categories
    .filter(c => c.category)
    .map(c => ({
      name: c.category,
      count: c._count.category,
    }))
}

export async function getPopularTags() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    select: { tags: true },
  })

  const tagCounts: Record<string, number> = {}
  
  projects.forEach(project => {
    project.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
}

export async function searchProjects(query: string) {
  return await prisma.project.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ],
    },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
}
