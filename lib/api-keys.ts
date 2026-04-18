import { prisma } from './db'
import crypto from 'crypto'

export interface ApiKeyInput {
  name?: string
  expiresInDays: number
  userId: string
}

export interface ApiKeyResult {
  id: string
  key: string
  name?: string | null
  expiresAt: Date
  status: string
}

export function generateApiKey(): string {
  // Generate a secure API key: iot_live_xxxxxxxx...
  const randomBytes = crypto.randomBytes(32).toString('hex')
  return `iot_live_${randomBytes}`
}

export async function createApiKey(input: ApiKeyInput): Promise<ApiKeyResult> {
  const key = generateApiKey()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + input.expiresInDays)

  const apiKey = await prisma.apiKey.create({
    data: {
      key,
      name: input.name,
      expiresAt,
      userId: input.userId,
      status: 'ACTIVE',
    },
  })

  return {
    id: apiKey.id,
    key: apiKey.key,
    name: apiKey.name,
    expiresAt: apiKey.expiresAt,
    status: apiKey.status,
  }
}

export async function validateApiKey(key: string): Promise<{
  valid: boolean
  userId?: string
  error?: string
}> {
  if (!key || !key.startsWith('iot_live_')) {
    return { valid: false, error: 'Invalid API key format' }
  }

  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
  })

  if (!apiKey) {
    return { valid: false, error: 'API key not found' }
  }

  // Check if revoked
  if (apiKey.status === 'REVOKED') {
    return { valid: false, error: 'API key has been revoked' }
  }

  // Check if expired
  if (new Date() > apiKey.expiresAt) {
    // Update status to expired
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { status: 'EXPIRED' },
    })
    return { valid: false, error: 'API key has expired' }
  }

  // Update last used and increment request count
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: {
      lastUsedAt: new Date(),
      requestCount: { increment: 1 },
    },
  })

  return { valid: true, userId: apiKey.userId }
}

export async function revokeApiKey(keyId: string, userId: string): Promise<boolean> {
  try {
    const apiKey = await prisma.apiKey.findFirst({
      where: { id: keyId, userId },
    })

    if (!apiKey) {
      return false
    }

    await prisma.apiKey.update({
      where: { id: keyId },
      data: { status: 'REVOKED' },
    })

    return true
  } catch (error) {
    console.error('Error revoking API key:', error)
    return false
  }
}

export async function regenerateApiKey(keyId: string, userId: string, expiresInDays: number): Promise<ApiKeyResult | null> {
  try {
    const existingKey = await prisma.apiKey.findFirst({
      where: { id: keyId, userId },
    })

    if (!existingKey) {
      return null
    }

    // Delete old key
    await prisma.apiKey.delete({
      where: { id: keyId },
    })

    // Create new key with same name
    const newKey = generateApiKey()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    const apiKey = await prisma.apiKey.create({
      data: {
        key: newKey,
        name: existingKey.name,
        expiresAt,
        userId,
        status: 'ACTIVE',
      },
    })

    return {
      id: apiKey.id,
      key: apiKey.key,
      name: apiKey.name,
      expiresAt: apiKey.expiresAt,
      status: apiKey.status,
    }
  } catch (error) {
    console.error('Error regenerating API key:', error)
    return null
  }
}

export async function getUserApiKeys(userId: string) {
  const apiKeys = await prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return apiKeys.map(key => ({
    ...key,
    // Mask the key for display (show only first 8 and last 4 chars)
    key: key.key.length > 12 
      ? `${key.key.slice(0, 12)}...${key.key.slice(-4)}`
      : key.key,
  }))
}
