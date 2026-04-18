import { prisma } from './db'
import crypto from 'crypto'

export interface CreateChannelInput {
  name: string
  description?: string
  isPublic?: boolean
  userId: string
  field1Label?: string
  field2Label?: string
  field3Label?: string
  field4Label?: string
  field5Label?: string
  field6Label?: string
  field7Label?: string
  field8Label?: string
}

export interface UpdateChannelInput {
  name?: string
  description?: string
  isPublic?: boolean
  field1Label?: string
  field2Label?: string
  field3Label?: string
  field4Label?: string
  field5Label?: string
  field6Label?: string
  field7Label?: string
  field8Label?: string
}

function generateChannelKey(): string {
  return crypto.randomBytes(16).toString('hex')
}

export async function createChannel(input: CreateChannelInput) {
  const readApiKey = generateChannelKey()
  const writeApiKey = generateChannelKey()

  return await prisma.channel.create({
    data: {
      name: input.name,
      description: input.description,
      isPublic: input.isPublic ?? false,
      userId: input.userId,
      readApiKey,
      writeApiKey,
      field1Label: input.field1Label,
      field2Label: input.field2Label,
      field3Label: input.field3Label,
      field4Label: input.field4Label,
      field5Label: input.field5Label,
      field6Label: input.field6Label,
      field7Label: input.field7Label,
      field8Label: input.field8Label,
    },
  })
}

export async function getUserChannels(userId: string) {
  return await prisma.channel.findMany({
    where: { userId },
    include: {
      _count: {
        select: { dataPoints: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getChannelById(channelId: string, userId?: string) {
  const whereClause: any = { id: channelId }
  
  // If userId provided, check ownership or public status
  if (userId) {
    whereClause.OR = [
      { userId },
      { isPublic: true },
    ]
  } else {
    whereClause.isPublic = true
  }

  return await prisma.channel.findFirst({
    where: whereClause,
    include: {
      _count: {
        select: { dataPoints: true },
      },
    },
  })
}

export async function updateChannel(channelId: string, userId: string, input: UpdateChannelInput) {
  const channel = await prisma.channel.findFirst({
    where: { id: channelId, userId },
  })

  if (!channel) {
    return null
  }

  return await prisma.channel.update({
    where: { id: channelId },
    data: input,
  })
}

export async function deleteChannel(channelId: string, userId: string) {
  const channel = await prisma.channel.findFirst({
    where: { id: channelId, userId },
  })

  if (!channel) {
    return false
  }

  await prisma.channel.delete({
    where: { id: channelId },
  })

  return true
}

export async function getChannelByWriteKey(writeApiKey: string) {
  return await prisma.channel.findUnique({
    where: { writeApiKey },
  })
}

export async function getChannelByReadKey(readApiKey: string) {
  return await prisma.channel.findUnique({
    where: { readApiKey },
  })
}

export async function regenerateChannelKeys(channelId: string, userId: string) {
  const channel = await prisma.channel.findFirst({
    where: { id: channelId, userId },
  })

  if (!channel) {
    return null
  }

  const readApiKey = generateChannelKey()
  const writeApiKey = generateChannelKey()

  return await prisma.channel.update({
    where: { id: channelId },
    data: { readApiKey, writeApiKey },
  })
}
