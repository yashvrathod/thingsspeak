'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { 
  Radio, 
  Database, 
  Key, 
  Activity,
  ArrowUpRight,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

interface Stats {
  channelCount: number
  dataPointCount: number
  apiKeyCount: number
  recentDataPoints: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentData, setRecentData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, channelsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/channels'),
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData.stats)
        }

        if (channelsRes.ok) {
          const channelsData = await channelsRes.json()
          // Fetch recent data from first channel if available
          if (channelsData.channels?.length > 0) {
            const dataRes = await fetch(`/api/channels/${channelsData.channels[0].id}?data=true&limit=20`)
            if (dataRes.ok) {
              const data = await dataRes.json()
              setRecentData(data.data?.points?.slice(0, 10).reverse() || [])
            }
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchStats()
    }
  }, [session])

  const statCards = [
    { 
      label: 'Channels', 
      value: stats?.channelCount || 0, 
      icon: Radio, 
      trend: '+0',
      href: '/dashboard/channels'
    },
    { 
      label: 'Total Data Points', 
      value: stats?.dataPointCount || 0, 
      icon: Database, 
      trend: `+${stats?.recentDataPoints || 0}`,
      href: '/dashboard/channels'
    },
    { 
      label: 'Active API Keys', 
      value: stats?.apiKeyCount || 0, 
      icon: Key, 
      trend: '+0',
      href: '/dashboard/api-keys'
    },
    { 
      label: 'Activity', 
      value: 'Active', 
      icon: Activity, 
      trend: 'Live',
      href: '/dashboard/channels'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}! Here&apos;s a quick pulse on your IoT activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/channels/new">
              <Radio className="w-4 h-4 mr-2" />
              New Channel
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/api-keys">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(null).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))
        ) : (
          statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.label} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">{stat.label}</p>
                        <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-xs text-accent">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {stat.trend}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Data points from your channels</CardDescription>
          </CardHeader>
          <CardContent>
            {recentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={recentData}>
                  <defs>
                    <linearGradient id="colorField1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="var(--muted-foreground)" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="field1" 
                    stroke="var(--accent)" 
                    fillOpacity={1} 
                    fill="url(#colorField1)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No data available yet</p>
                  <p className="text-sm">Start sending data to see activity</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link href="/dashboard/channels/new" className="flex flex-col items-start">
                  <Radio className="w-5 h-5 mb-2" />
                  <span className="font-medium">Create Channel</span>
                  <span className="text-xs text-muted-foreground">Set up a new data stream</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link href="/dashboard/api-keys" className="flex flex-col items-start">
                  <Key className="w-5 h-5 mb-2" />
                  <span className="font-medium">Get API Key</span>
                  <span className="text-xs text-muted-foreground">Generate access credentials</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link href="/dashboard/projects" className="flex flex-col items-start">
                  <Database className="w-5 h-5 mb-2" />
                  <span className="font-medium">Browse Projects</span>
                  <span className="text-xs text-muted-foreground">Explore IoT templates</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link href="/dashboard/settings" className="flex flex-col items-start">
                  <Activity className="w-5 h-5 mb-2" />
                  <span className="font-medium">View Settings</span>
                  <span className="text-xs text-muted-foreground">Configure your account</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
