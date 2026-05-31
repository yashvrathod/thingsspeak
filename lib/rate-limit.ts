import { prisma } from './db'

const CLEANUP_INTERVAL_MS = 60_000
let lastCleanup = 0

export async function checkRateLimit(
  key: string,
  maxRequests = 60,
  windowMs = 60_000
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now()
  const windowStart = new Date(now - windowMs)
  const expiresAt = new Date(now + windowMs)

  // Periodic cleanup (runs at most once per minute)
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    lastCleanup = now
    try {
      await prisma.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } })
      const cutoff = new Date(Date.now() - 86400000)
      await prisma.realtimeEvent.deleteMany({ where: { createdAt: { lt: cutoff } } })
    } catch {}
  }

  const recent = await prisma.rateLimit.count({
    where: { key, createdAt: { gte: windowStart } },
  })

  if (recent >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: expiresAt.getTime() }
  }

  await prisma.rateLimit.create({ data: { key, expiresAt } })

  return { allowed: true, remaining: maxRequests - recent - 1, resetAt: expiresAt.getTime() }
}

