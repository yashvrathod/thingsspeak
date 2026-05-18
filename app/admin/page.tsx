'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Package, Users, Zap, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

const chartData = [
  { name: 'Jan', devices: 120, dataPoints: 2400 },
  { name: 'Feb', devices: 150, dataPoints: 2210 },
  { name: 'Mar', devices: 180, dataPoints: 2290 },
  { name: 'Apr', devices: 220, dataPoints: 2000 },
  { name: 'May', devices: 280, dataPoints: 2181 },
  { name: 'Jun', devices: 320, dataPoints: 2500 },
]

const recentActivity = [
  { id: 1, action: 'Device registered', device: 'Sensor-001', time: '2 hours ago' },
  { id: 2, action: 'Data point collected', device: 'Sensor-002', time: '1 hour ago' },
  { id: 3, action: 'Device offline', device: 'Sensor-003', time: '30 mins ago' },
  { id: 4, action: 'Configuration updated', device: 'Sensor-004', time: '15 mins ago' },
]

export default function Dashboard() {
  const stats = [
    { label: 'Active Devices', value: '1,234', icon: Zap, trend: '+12%', gradient: 'from-violet-500 to-purple-500' },
    { label: 'Total Users', value: '892', icon: Users, trend: '+8%', gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Projects', value: '24', icon: Package, trend: '+2', gradient: 'from-emerald-500 to-green-500' },
    { label: 'Data Points', value: '2.4M', icon: TrendingUp, trend: '+23%', gradient: 'from-orange-500 to-amber-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here&apos;s what&apos;s happening with your IoT devices.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="relative group p-6 rounded-2xl bg-card border border-border/50 hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br", stat.gradient, "flex items-center justify-center shadow-lg")}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-emerald-500">{stat.trend}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-card border border-border/50 p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            Device Growth
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
              <XAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="devices"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-card border border-border/50 p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            Data Collection
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
              <XAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Legend />
              <Bar
                dataKey="dataPoints"
                fill="#8b5cf6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl bg-card border border-border/50 p-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-violet-500" />
          Recent Activity
        </h2>
        <div className="space-y-1">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-500/50" />
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.device}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
