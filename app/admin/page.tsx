'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Package, Users, Zap, Activity, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminStats {
  totalUsers: number
  totalChannels: number
  totalDataPoints: number
  totalApiKeys: number
  totalProjects: number
  recentUsers: number
  recentChannels: number
  recentDataPoints: number
  activeApiKeys: number
}

interface TopUser {
  id: string
  name: string | null
  email: string
  dataPoints: number
  channels: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [topUsers, setTopUsers] = useState<TopUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setTopUsers(data.topUsers || [])
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (n: number) => n.toLocaleString()

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, recent: stats?.recentUsers ?? 0, icon: Users, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Total Channels', value: stats?.totalChannels ?? 0, recent: stats?.recentChannels ?? 0, icon: Zap, gradient: 'from-violet-500 to-purple-500' },
    { label: 'Data Points', value: stats?.totalDataPoints ?? 0, recent: stats?.recentDataPoints ?? 0, icon: TrendingUp, gradient: 'from-orange-500 to-amber-500' },
    { label: 'Projects', value: stats?.totalProjects ?? 0, recent: 0, icon: Package, gradient: 'from-emerald-500 to-green-500' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and key metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="relative group p-6 rounded-2xl bg-card border border-border/50 hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br", stat.gradient, "flex items-center justify-center shadow-lg")}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.recent > 0 && (
                  <span className="text-sm font-medium text-emerald-500">+{formatNumber(stat.recent)} 30d</span>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{formatNumber(stat.value)}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-card border border-border/50 p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            Growth (Last 30 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Users', total: stats?.totalUsers ?? 0, recent: stats?.recentUsers ?? 0 },
              { name: 'Channels', total: stats?.totalChannels ?? 0, recent: stats?.recentChannels ?? 0 },
              { name: 'Data Points', total: stats?.totalDataPoints ?? 0, recent: stats?.recentDataPoints ?? 0 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
              <XAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Legend />
              <Bar dataKey="total" fill="#8b5cf6" name="Total" radius={[8, 8, 0, 0]} />
              <Bar dataKey="recent" fill="#22c55e" name="Last 30 days" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-card border border-border/50 p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            Top Users by Data Points
          </h2>
          {topUsers.length > 0 ? (
            <div className="space-y-3">
              {topUsers.slice(0, 5).map((user, i) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-600 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{user.name || user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.channels} channels</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">{user.dataPoints.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>No data yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border/50 p-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-violet-500" />
          Platform Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active API Keys', value: stats?.activeApiKeys ?? 0 },
            { label: 'Total API Keys', value: stats?.totalApiKeys ?? 0 },
            { label: '30-day Users', value: stats?.recentUsers ?? 0 },
            { label: '30-day Data Points', value: stats?.recentDataPoints ?? 0 },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
