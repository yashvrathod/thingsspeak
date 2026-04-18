'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Activity, Clock, Calendar, History } from 'lucide-react'

interface ChannelChartsProps {
  data: any[]
  fieldLabels: string[]
}

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

export default function ChannelCharts({ data, fieldLabels }: ChannelChartsProps) {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d' | 'all'>('24h')

  // Filter data based on time range
  const filteredData = (() => {
    if (timeRange === 'all') return data
    
    const now = new Date()
    const cutoff = new Date()
    
    switch (timeRange) {
      case '1h':
        cutoff.setHours(now.getHours() - 1)
        break
      case '24h':
        cutoff.setDate(now.getDate() - 1)
        break
      case '7d':
        cutoff.setDate(now.getDate() - 7)
        break
      case '30d':
        cutoff.setDate(now.getDate() - 30)
        break
    }
    
    return data.filter(d => new Date(d.timestamp) >= cutoff)
  })()

  // Reverse for chronological display
  const chartData = [...filteredData].reverse()

  const timeRangeOptions = [
    { value: '1h', label: '1H', icon: Clock },
    { value: '24h', label: '24H', icon: Activity },
    { value: '7d', label: '7D', icon: Calendar },
    { value: '30d', label: '30D', icon: History },
    { value: 'all', label: 'All', icon: History },
  ] as const

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Activity className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No data yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Start sending data to this channel to see visualizations. Use the API endpoint or the device simulator.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">Time Range:</span>
        {timeRangeOptions.map((option) => {
          const Icon = option.icon
          return (
            <Button
              key={option.value}
              variant={timeRange === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(option.value)}
            >
              <Icon className="w-3 h-3 mr-1" />
              {option.label}
            </Button>
          )
        })}
        <Badge variant="secondary" className="ml-auto">
          {filteredData.length} points
        </Badge>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {fieldLabels.slice(0, 4).map((label, index) => {
          const fieldKey = `field${index + 1}`
          const hasData = chartData.some(d => d[fieldKey] !== null && d[fieldKey] !== undefined)
          
          if (!hasData) return null

          return (
            <Card key={fieldKey}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  {label || `Field ${index + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="var(--muted-foreground)"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)"
                      fontSize={10}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem'
                      }}
                      labelStyle={{ color: 'var(--foreground)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={fieldKey} 
                      stroke={COLORS[index]} 
                      strokeWidth={2}
                      dot={false}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Combined Chart - All Fields */}
      {fieldLabels.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>All Fields</CardTitle>
            <CardDescription>Combined view of all data fields</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
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
                <Legend />
                {fieldLabels.slice(0, 8).map((label, index) => (
                  <Line 
                    key={index}
                    type="monotone" 
                    dataKey={`field${index + 1}`} 
                    name={label || `Field ${index + 1}`}
                    stroke={COLORS[index]} 
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
