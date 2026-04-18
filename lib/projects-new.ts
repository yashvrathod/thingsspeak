'use server'

import { prisma } from './db'
import crypto from 'crypto'

// Create project with all enhanced fields
export async function createProject(
  userId: string,
  data: {
    title: string
    description: string
    type: 'BASIC' | 'IOT'
    imageUrl?: string
    videoUrl?: string
    diagramUrl?: string
    driveLink?: string
    components: string[]
    connections: string[]
    steps: string[]
    working?: string
    references: string[]
    code?: string
    fieldLabels: string[]
    tags: string[]
    category?: string
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    duration?: string
  }
) {
  return prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      imageUrl: data.imageUrl || null,
      videoUrl: data.videoUrl || null,
      diagramUrl: data.diagramUrl || null,
      driveLink: data.driveLink || null,
      components: data.components || [],
      connections: data.connections || [],
      steps: data.steps || [],
      working: data.working || null,
      references: data.references || [],
      code: data.code || null,
      fieldLabels: data.fieldLabels || [],
      tags: data.tags || [],
      category: data.category || null,
      difficulty: data.difficulty,
      duration: data.duration || null,
      userId,
      isPublished: true,
    },
  })
}

// Get all published projects with filters
export async function getProjects(filters?: {
  type?: 'BASIC' | 'IOT'
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: string
  tags?: string[]
  search?: string
  featured?: boolean
}) {
  // Build where clause - show projects that are published OR have null isPublished
  const where: any = {}
  
  // Handle published filter - use not equals false to catch both true and null
  where.isPublished = { not: false }

  if (filters?.type) where.type = filters.type
  if (filters?.difficulty) where.difficulty = filters.difficulty
  if (filters?.category) where.category = filters.category
  if (filters?.featured !== undefined) where.featured = filters.featured
  
  if (filters?.tags && filters.tags.length > 0) {
    where.tags = { hasSome: filters.tags }
  }
  
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  const projects = await prisma.project.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: [
      { createdAt: 'desc' },
    ],
  })

  // Get usage counts separately
  const projectsWithCount = await Promise.all(
    projects.map(async (p) => {
      const count = await (prisma as any).userProject.count({ where: { projectId: p.id } })
      return { ...p, usageCount: count }
    })
  )

  return projectsWithCount
}

// Get all projects for admin (including unpublished)
export async function getAllProjectsAdmin() {
  const projects = await prisma.project.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: [
      { createdAt: 'desc' },
    ],
  })

  // Get usage counts separately
  const projectsWithCount = await Promise.all(
    projects.map(async (p) => {
      const count = await (prisma as any).userProject.count({ where: { projectId: p.id } })
      return { ...p, usageCount: count }
    })
  )

  return projectsWithCount
}

// Get single project by ID
export async function getProjectById(id: string, userId?: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
    },
  })

  if (!project || project.isPublished === false) return null

  // Get usage count
  const usageCount = await (prisma as any).userProject.count({ where: { projectId: id } })

  // Check if current user has activated this project
  let userProject = null
  if (userId) {
    userProject = await (prisma as any).userProject.findFirst({
      where: {
        userId,
        projectId: id,
      },
    })

    if (userProject?.channelId) {
      const channel = await prisma.channel.findUnique({
        where: { id: userProject.channelId },
        select: {
          id: true,
          name: true,
          writeApiKey: true,
          readApiKey: true,
          field1Label: true,
          field2Label: true,
          field3Label: true,
          field4Label: true,
          field5Label: true,
          field6Label: true,
          field7Label: true,
          field8Label: true,
        },
      })
      userProject = { ...userProject, channel }
    }
  }

  return { ...project, usageCount, userProject }
}

// Update project
export async function updateProject(
  id: string,
  userId: string,
  isAdmin: boolean,
  data: Partial<{
    title: string
    description: string
    type: 'BASIC' | 'IOT'
    imageUrl: string
    videoUrl: string
    diagramUrl: string
    driveLink: string
    components: string[]
    connections: string[]
    steps: string[]
    working: string
    references: string[]
    code: string
    fieldLabels: string[]
    tags: string[]
    category: string
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    duration: string
    isPublished: boolean
    featured: boolean
  }>
) {
  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) return null
  if (!isAdmin && project.userId !== userId) {
    throw new Error('Unauthorized to update this project')
  }

  return prisma.project.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })
}

// Delete project
export async function deleteProject(id: string, userId: string, isAdmin: boolean) {
  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) return false
  if (!isAdmin && project.userId !== userId) {
    throw new Error('Unauthorized to delete this project')
  }

  await prisma.project.delete({
    where: { id },
  })

  return true
}

// Get all unique categories
export async function getCategories() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    select: { category: true },
    distinct: ['category'],
  })

  return projects.map(p => p.category).filter(Boolean) as string[]
}

// Get all unique tags with counts
export async function getPopularTags(limit = 20) {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    select: { tags: true },
  })

  const tagCounts: Record<string, number> = {}
  projects.forEach(p => {
    p.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }))
}

// Generate channel keys
function generateChannelKey(): string {
  return crypto.randomBytes(16).toString('hex')
}

// Activate/Use a project (for IOT projects - creates channel)
export async function activateProject(
  userId: string,
  projectId: string,
  channelName?: string
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId, isPublished: true },
  })

  if (!project) {
    throw new Error('Project not found')
  }

  const proj = project as any

  // Check if user already activated this project
  const existing = await (prisma as any).userProject.findFirst({
    where: { userId, projectId },
  })

  if (existing) {
    // Get channel info if exists
    let channel = null
    if (existing.channelId) {
      channel = await prisma.channel.findUnique({
        where: { id: existing.channelId },
        select: {
          id: true,
          name: true,
          writeApiKey: true,
          readApiKey: true,
        },
      })
    }
    return { ...existing, channel, project, alreadyActivated: true }
  }

  // Create a new channel for IOT projects
  let channelId: string | null = null
  let channel = null

  if (proj.type === 'IOT') {
    const readApiKey = generateChannelKey()
    const writeApiKey = generateChannelKey()

    channel = await prisma.channel.create({
      data: {
        name: channelName || project.title,
        description: `Auto-created for project: ${project.title}`,
        isPublic: false,
        userId,
        readApiKey,
        writeApiKey,
        field1Label: proj.fieldLabels?.[0] || null,
        field2Label: proj.fieldLabels?.[1] || null,
        field3Label: proj.fieldLabels?.[2] || null,
        field4Label: proj.fieldLabels?.[3] || null,
        field5Label: proj.fieldLabels?.[4] || null,
        field6Label: proj.fieldLabels?.[5] || null,
        field7Label: proj.fieldLabels?.[6] || null,
        field8Label: proj.fieldLabels?.[7] || null,
      },
    })
    
    channelId = channel.id
  }

  // Create user project record
  const userProject = await (prisma as any).userProject.create({
    data: {
      userId,
      projectId,
      channelId,
    },
  })

  return { ...userProject, channel, project, alreadyActivated: false }
}

// Toggle bookmark
export async function toggleBookmark(userId: string, projectId: string) {
  const userProject = await prisma.userProject.findFirst({
    where: { userId, projectId },
  })

  if (userProject) {
    return (prisma as any).userProject.update({
      where: { id: userProject.id },
      data: { bookmarks: !userProject.bookmarks },
    })
  }

  // Create new with bookmark
  return (prisma as any).userProject.create({
    data: {
      userId,
      projectId,
      bookmarks: true,
    },
  })
}

// Mark project as completed
export async function markCompleted(userId: string, projectId: string, completed: boolean) {
  const userProject = await prisma.userProject.findFirst({
    where: { userId, projectId },
  })

  if (userProject) {
    return prisma.userProject.update({
      where: { id: userProject.id },
      data: { completed },
    })
  }

  return prisma.userProject.create({
    data: {
      userId,
      projectId,
      completed,
    },
  })
}

// Get user's bookmarked projects
export async function getUserBookmarks(userId: string) {
  const userProjects = await prisma.userProject.findMany({
    where: { userId, bookmarks: true },
    include: { project: true },
    orderBy: { createdAt: 'desc' },
  })

  return userProjects
}

// Get user's activated projects
export async function getUserProjects(userId: string) {
  const userProjects = await prisma.userProject.findMany({
    where: { userId },
    include: { 
      project: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Get channel info for each
  const withChannels = await Promise.all(
    userProjects.map(async (up) => {
      let channel = null
      if (up.channelId) {
        channel = await prisma.channel.findUnique({
          where: { id: up.channelId },
          select: {
            id: true,
            name: true,
            writeApiKey: true,
            readApiKey: true,
          },
        })
      }
      return { ...up, channel }
    })
  )

  return withChannels
}
