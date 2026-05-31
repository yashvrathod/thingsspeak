import { prisma } from './db'

export type DataPointEvent = {
  id: string
  channelId: string
  field1?: number | null
  field2?: number | null
  field3?: number | null
  field4?: number | null
  field5?: number | null
  field6?: number | null
  field7?: number | null
  field8?: number | null
  latitude?: number | null
  longitude?: number | null
  elevation?: number | null
  status?: string | null
  createdAt: Date
}

export async function emitDataPoint(event: DataPointEvent): Promise<void> {
  try {
    await prisma.realtimeEvent.create({
      data: {
        type: 'data_point',
        channelId: event.channelId,
        payload: JSON.stringify(event),
      },
    })
  } catch (error) {
    console.error('Failed to enqueue realtime event:', error)
  }
}

export async function pollChannelEvents(
  channelId: string,
  since: Date,
  limit = 50
) {
  const events = await prisma.realtimeEvent.findMany({
    where: {
      channelId,
      createdAt: { gt: since },
    },
    orderBy: { createdAt: 'asc' },
    take: limit,
  })

  await prisma.realtimeEvent.deleteMany({
    where: {
      channelId,
      id: { in: events.map((e) => e.id) },
    },
  })

  return events
}
