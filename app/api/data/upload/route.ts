import { NextRequest, NextResponse } from 'next/server'
import { addDataPoint } from '@/lib/data'
import { getChannelByWriteKey } from '@/lib/channels'
import { prisma } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { emitDataPoint } from '@/lib/socket-emitter'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const body = await request.json()
    const apiKeyId = body?.api_key || body?.write_api_key || ip
    const { allowed, remaining } = await checkRateLimit(`upload:${apiKeyId}`)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': String(remaining) } }
      )
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { api_key, write_api_key, channel_id, ...fieldData } = body

    // Support both user API keys and channel write keys
    let channel = null
    let userId = null

    // Check for channel write API key (preferred for IoT devices)
    const writeKey = write_api_key || api_key
    
    if (writeKey) {
      channel = await getChannelByWriteKey(writeKey)
      
      if (channel) {
        userId = channel.userId
      }
    }

    // If no channel found with write key, check for user API key
    if (!channel && api_key) {
      const apiKeyRecord = await prisma.apiKey.findUnique({
        where: { key: api_key },
      })

      if (!apiKeyRecord) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
      }

      // Check if API key is active and not expired
      if (apiKeyRecord.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'API key is not active' }, { status: 401 })
      }

      if (new Date() > apiKeyRecord.expiresAt) {
        // Update status to expired
        await prisma.apiKey.update({
          where: { id: apiKeyRecord.id },
          data: { status: 'EXPIRED' },
        })
        return NextResponse.json({ error: 'API key has expired' }, { status: 401 })
      }

      userId = apiKeyRecord.userId

      // Update last used and increment count
      await prisma.apiKey.update({
        where: { id: apiKeyRecord.id },
        data: {
          lastUsedAt: new Date(),
          requestCount: { increment: 1 },
        },
      })

      // If channel_id is provided, verify it belongs to this user
      if (channel_id) {
        channel = await prisma.channel.findFirst({
          where: {
            id: channel_id,
            userId: userId,
          },
        })

        if (!channel) {
          return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
        }
      } else {
        return NextResponse.json({ error: 'channel_id is required when using user API key' }, { status: 400 })
      }
    }

    if (!channel || !userId) {
      return NextResponse.json({ error: 'Invalid API key or channel not found' }, { status: 401 })
    }

    // Extract field data (field1-field8) and metadata
    const dataPoint = await addDataPoint(channel.id, userId, {
      field1: fieldData.field1,
      field2: fieldData.field2,
      field3: fieldData.field3,
      field4: fieldData.field4,
      field5: fieldData.field5,
      field6: fieldData.field6,
      field7: fieldData.field7,
      field8: fieldData.field8,
      latitude: fieldData.latitude,
      longitude: fieldData.longitude,
      elevation: fieldData.elevation,
      status: fieldData.status,
    })

    // Emit realtime event (delivered via SSE / Socket.IO)
    await emitDataPoint(dataPoint)

    return NextResponse.json({
      success: true,
      entry_id: dataPoint.id,
      channel_id: channel.id,
      created_at: dataPoint.createdAt,
    }, { status: 201 })
  } catch (error) {
    console.error('Error uploading data:', error)
    return NextResponse.json({ error: 'Failed to upload data' }, { status: 500 })
  }
}
