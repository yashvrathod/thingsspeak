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
  Clock,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
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
  const [recentData, setRecentData] = useState<Record<string, unknown>[]>([])
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
      href: '/dashboard/channels',
      gradient: 'from-blue-500 to-cyan-500',
    },
    { 
      label: 'Total Data Points', 
      value: stats?.dataPointCount || 0, 
      icon: Database, 
      trend: `+${stats?.recentDataPoints || 0}`,
      href: '/dashboard/channels',
      gradient: 'from-violet-500 to-purple-500',
    },
    { 
      label: 'Active API Keys', 
      value: stats?.apiKeyCount || 0, 
      icon: Key, 
      trend: '+0',
      href: '/dashboard/api-keys',
      gradient: 'from-emerald-500 to-green-500',
    },
    { 
      label: 'Activity', 
      value: 'Active', 
      icon: Activity, 
      trend: 'Live',
      href: '/dashboard/channels',
      gradient: 'from-orange-500 to-amber-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-xs font-medium text-violet-600 dark:text-violet-400">
              <Sparkles className="w-3 h-3" />
              Dashboard
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s a quick pulse on your IoT activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="rounded-xl border-border/50">
            <Link href="/dashboard/channels/new">
              <Radio className="w-4 h-4 mr-2" />
              New Channel
            </Link>
          </Button>
          <Button asChild className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20">
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
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))
        ) : (
          statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.label} href={stat.href}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-violet-500/30 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br", stat.gradient, "flex items-center justify-center shadow-lg")}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/10 text-xs font-medium text-violet-600 dark:text-violet-400">
                        <ArrowUpRight className="w-3 h-3" />
                        {stat.trend}
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                      <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
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
        <Card className="border-border/50 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-violet-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>Data points from your channels</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {recentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={recentData}>
                  <defs>
                    <linearGradient id="colorField1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="time" 
                    stroke="var(--muted-foreground)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '0.75rem',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="field1" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorField1)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No data available yet</p>
                  <p className="text-sm mt-1">Start sending data to see activity</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-violet-500" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks to get started</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button asChild variant="outline" className="h-auto py-5 justify-start rounded-xl border-border/50 hover:border-violet-500/30 hover:bg-violet-500/5">
                <Link href="/dashboard/channels/new" className="flex flex-col items-start">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-2">
                    <Radio className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Create Channel</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Set up a new data stream</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-5 justify-start rounded-xl border-border/50 hover:border-violet-500/30 hover:bg-violet-500/5">
                <Link href="/dashboard/api-keys" className="flex flex-col items-start">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-2">
                    <Key className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Get API Key</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Generate access credentials</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-5 justify-start rounded-xl border-border/50 hover:border-violet-500/30 hover:bg-violet-500/5">
                <Link href="/dashboard/projects" className="flex flex-col items-start">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-2">
                    <Database className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Browse Projects</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Explore IoT templates</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-5 justify-start rounded-xl border-border/50 hover:border-violet-500/30 hover:bg-violet-500/5">
                <Link href="/dashboard/settings" className="flex flex-col items-start">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-2">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">View Settings</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Configure your account</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
