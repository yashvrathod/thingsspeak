import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { Providers } from '@/components/providers'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Pulse - Seamless IoT Data Platform',
  description: 'A modern, elegant IoT data platform for collecting, visualizing, and analyzing sensor data. Built with Next.js, PostgreSQL, and real-time charts.',
  keywords: ['IoT', 'Pulse', 'sensor data', 'Arduino', 'ESP32', 'data visualization', 'API', 'ThingSpeak'],
  authors: [{ name: 'Pulse' }],
  openGraph: {
    title: 'Pulse',
    description: 'Modern, elegant IoT data platform for seamless connectivity.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
