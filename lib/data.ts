import { prisma } from './db'

export interface DataPointInput {
  field1?: number
  field2?: number
  field3?: number
  field4?: number
  field5?: number
  field6?: number
  field7?: number
  field8?: number
  latitude?: number
  longitude?: number
  elevation?: number
  status?: string
}

export async function addDataPoint(
  channelId: string,
  userId: string,
  data: DataPointInput
) {
  return await prisma.dataPoint.create({
    data: {
      channelId,
      userId,
      field1: data.field1,
      field2: data.field2,
      field3: data.field3,
      field4: data.field4,
      field5: data.field5,
      field6: data.field6,
      field7: data.field7,
      field8: data.field8,
      latitude: data.latitude,
      longitude: data.longitude,
      elevation: data.elevation,
      status: data.status,
    },
  })
}

export async function getChannelDataPoints(
  channelId: string,
  options?: {
    limit?: number
    startDate?: Date
    endDate?: Date
    offset?: number
  }
) {
  const { limit = 100, startDate, endDate, offset = 0 } = options || {}

  const whereClause: any = { channelId }
  
  if (startDate || endDate) {
    whereClause.createdAt = {}
    if (startDate) whereClause.createdAt.gte = startDate
    if (endDate) whereClause.createdAt.lte = endDate
  }

  return await prisma.dataPoint.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })
}

export async function getChannelDataPointsCount(channelId: string) {
  return await prisma.dataPoint.count({
    where: { channelId },
  })
}

export async function getRecentDataPoints(channelId: string, hours: number = 24) {
  const cutoff = new Date()
  cutoff.setHours(cutoff.getHours() - hours)

  return await prisma.dataPoint.findMany({
    where: {
      channelId,
      createdAt: { gte: cutoff },
    },
    orderBy: { createdAt: 'asc' },
  })
}

export async function deleteOldDataPoints(channelId: string, days: number) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  return await prisma.dataPoint.deleteMany({
    where: {
      channelId,
      createdAt: { lt: cutoff },
    },
  })
}

export function formatDataForChart(dataPoints: any[]) {
  return dataPoints.map(point => ({
    timestamp: point.createdAt.toISOString(),
    time: point.createdAt.toLocaleTimeString(),
    date: point.createdAt.toLocaleDateString(),
    field1: point.field1,
    field2: point.field2,
    field3: point.field3,
    field4: point.field4,
    field5: point.field5,
    field6: point.field6,
    field7: point.field7,
    field8: point.field8,
    status: point.status,
  }))
}

export async function exportDataToCSV(dataPoints: any[], fieldLabels: string[]) {
  const headers = ['timestamp', ...fieldLabels.filter(Boolean), 'latitude', 'longitude', 'status']
  
  const rows = dataPoints.map(point => [
    point.createdAt.toISOString(),
    point.field1,
    point.field2,
    point.field3,
    point.field4,
    point.field5,
    point.field6,
    point.field7,
    point.field8,
    point.latitude,
    point.longitude,
    point.status,
  ].join(','))

  return [headers.join(','), ...rows].join('\n')
}

export async function getUserStats(userId: string) {
  const [channelCount, dataPointCount, apiKeyCount] = await Promise.all([
    prisma.channel.count({ where: { userId } }),
    prisma.dataPoint.count({ where: { userId } }),
    prisma.apiKey.count({ where: { userId } }),
  ])

  // Get data points created in last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentDataPoints = await prisma.dataPoint.count({
    where: {
      userId,
      createdAt: { gte: thirtyDaysAgo },
    },
  })

  return {
    channelCount,
    dataPointCount,
    apiKeyCount,
    recentDataPoints,
  }
}
