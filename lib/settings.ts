import { prisma } from './db'

export async function getPlatformSetting(key: string): Promise<string | null> {
  const setting = await prisma.platformSetting.findUnique({ where: { key } })
  return setting?.value ?? null
}

export async function setPlatformSetting(key: string, value: string): Promise<void> {
  await prisma.platformSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  })
}

export async function getPlatformSettings(): Promise<Record<string, string>> {
  const settings = await prisma.platformSetting.findMany()
  return settings.reduce<Record<string, string>>((acc, s) => {
    acc[s.key] = s.value
    return acc
  }, {})
}

export async function getPlatformName(): Promise<string> {
  return (await getPlatformSetting('platformName')) || 'Pulse IoT'
}

export async function getPlatformDescription(): Promise<string> {
  return (await getPlatformSetting('platformDescription')) || 'Enterprise-Grade IoT Infrastructure'
}
