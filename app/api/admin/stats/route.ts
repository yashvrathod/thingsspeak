import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }

    // Get total counts
    const [
      totalUsers,
      totalChannels,
      totalDataPoints,
      totalApiKeys,
      totalProjects,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.channel.count(),
      prisma.dataPoint.count(),
      prisma.apiKey.count(),
      prisma.project.count(),
    ])

    // Get data from last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      recentUsers,
      recentChannels,
      recentDataPoints,
      activeApiKeys,
    ] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.channel.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.dataPoint.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.apiKey.count({
        where: { status: 'ACTIVE' },
      }),
    ])

    // Get top users by data points
    const topUsers = await prisma.user.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            dataPoints: true,
            channels: true,
          },
        },
      },
      orderBy: {
        dataPoints: { _count: 'desc' },
      },
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        totalChannels,
        totalDataPoints,
        totalApiKeys,
        totalProjects,
        recentUsers,
        recentChannels,
        recentDataPoints,
        activeApiKeys,
      },
      topUsers: topUsers.map((user: typeof topUsers[0]) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        dataPoints: user._count.dataPoints,
        channels: user._count.channels,
      })),
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 })
  }
}
