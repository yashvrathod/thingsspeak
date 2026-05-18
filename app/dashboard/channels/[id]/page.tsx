'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Radio, 
  Download, 
  RefreshCw, 
  Key,
  Eye,
  EyeOff,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  BarChart3,
  Table2,
  Cpu,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import ChannelCharts from './components/channel-charts'
import DataTable from './components/data-table'
import DeviceSimulator from './components/device-simulator'

interface Channel {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  createdAt: string
  readApiKey: string
  writeApiKey: string
  field1Label: string | null
  field2Label: string | null
  field3Label: string | null
  field4Label: string | null
  field5Label: string | null
  field6Label: string | null
  field7Label: string | null
  field8Label: string | null
  _count: {
    dataPoints: number
  }
}

export default function ChannelDetailPage() {
  const params = useParams()
  const channelId = params.id as string
  
  const [channel, setChannel] = useState<Channel | null>(null)
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    fetchChannelData()
  }, [channelId])

  const fetchChannelData = async () => {
    try {
      const response = await fetch(`/api/channels/${channelId}?data=true&limit=100`)
      if (response.ok) {
        const result = await response.json()
        setChannel(result.channel)
        setData(result.data?.points || [])
      } else {
        toast.error('Failed to load channel')
      }
    } catch (error) {
      console.error('Error fetching channel:', error)
      toast.error('Failed to load channel')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyKey = (key: string, type: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(type)
    toast.success(`${type} key copied to clipboard`)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`/api/channels/${channelId}/export?format=${format}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `channel-${channelId}-data.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success(`Data exported as ${format.toUpperCase()}`)
      }
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  const handleRegenerateKeys = async () => {
    try {
      const response = await fetch(`/api/channels/${channelId}/keys`, {
        method: 'POST',
      })
      if (response.ok) {
        const result = await response.json()
        setChannel(prev => prev ? { ...prev, readApiKey: result.readApiKey, writeApiKey: result.writeApiKey } : null)
        toast.success('API keys regenerated successfully')
      }
    } catch (error) {
      toast.error('Failed to regenerate keys')
    }
  }

  const fieldLabels = [
    channel?.field1Label,
    channel?.field2Label,
    channel?.field3Label,
    channel?.field4Label,
    channel?.field5Label,
    channel?.field6Label,
    channel?.field7Label,
    channel?.field8Label,
  ].filter((label): label is string => Boolean(label))

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center mx-auto mb-4">
          <Radio className="w-8 h-8 text-violet-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">Channel not found</h2>
        <Button asChild className="rounded-xl">
          <Link href="/dashboard/channels">Back to Channels</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl shrink-0">
            <Link href="/dashboard/channels">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{channel.name}</h1>
              {channel.isPublic ? (
                <Badge variant="secondary" className="rounded-full"><Eye className="w-3 h-3 mr-1" /> Public</Badge>
              ) : (
                <Badge variant="outline" className="rounded-full"><EyeOff className="w-3 h-3 mr-1" /> Private</Badge>
              )}
            </div>
            {channel.description && (
              <p className="text-muted-foreground mt-1">{channel.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Created {new Date(channel.createdAt).toLocaleDateString()} &middot; {channel._count.dataPoints.toLocaleString()} data points
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')} className="rounded-xl border-border/50">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('json')} className="rounded-xl border-border/50">
            <Download className="w-4 h-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Data Points', value: channel._count.dataPoints.toLocaleString(), gradient: 'from-violet-500 to-indigo-500' },
          { label: 'Fields', value: fieldLabels.length, gradient: 'from-blue-500 to-cyan-500' },
          { label: 'Created', value: new Date(channel.createdAt).toLocaleDateString(), gradient: 'from-emerald-500 to-green-500' },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50 rounded-xl overflow-hidden">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br", stat.gradient, "flex items-center justify-center shadow-lg shrink-0")}>
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList className="rounded-xl p-1 bg-muted/50 border border-border/50">
          <TabsTrigger value="charts" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="data" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            <Table2 className="w-4 h-4 mr-2" />
            Data Table
          </TabsTrigger>
          <TabsTrigger value="api" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            <Key className="w-4 h-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="simulator" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            <Cpu className="w-4 h-4 mr-2" />
            Simulator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <ChannelCharts data={data} fieldLabels={fieldLabels} />
        </TabsContent>

        <TabsContent value="data">
          <DataTable data={data} fieldLabels={fieldLabels} />
        </TabsContent>

        <TabsContent value="api">
          <Card className="border-border/50 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Key className="w-5 h-5 text-violet-500" />
                API Keys
              </CardTitle>
              <CardDescription>
                Use these keys to read from and write to this channel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Read API Key</Label>
                  <div className="flex gap-2">
                    <Input value={channel.readApiKey} readOnly type="password" className="font-mono rounded-xl" />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleCopyKey(channel.readApiKey, 'Read')}
                      className="rounded-xl shrink-0"
                    >
                      {copiedKey === 'Read' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Write API Key</Label>
                  <div className="flex gap-2">
                    <Input value={channel.writeApiKey} readOnly type="password" className="font-mono rounded-xl" />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleCopyKey(channel.writeApiKey, 'Write')}
                      className="rounded-xl shrink-0"
                    >
                      {copiedKey === 'Write' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between bg-muted/30 rounded-xl p-4">
                <div>
                  <h4 className="font-medium">Regenerate Keys</h4>
                  <p className="text-sm text-muted-foreground">
                    This will invalidate current keys
                  </p>
                </div>
                <Button variant="outline" onClick={handleRegenerateKeys} className="rounded-xl">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>

              <Separator />

              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                <h4 className="font-medium">API Endpoint</h4>
                <code className="bg-background p-2 rounded-lg text-sm font-mono block border border-border/50">
                  POST /api/data/upload
                </code>
                <p className="text-sm text-muted-foreground">
                  Send data with: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">write_api_key</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-xs">field1</code>-<code className="bg-muted px-1.5 py-0.5 rounded text-xs">field8</code>
                </p>
                <Button variant="link" asChild className="px-0">
                  <Link href="/docs/api" target="_blank">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View API Documentation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulator">
          <DeviceSimulator channelId={channel.id} writeApiKey={channel.writeApiKey} onDataSent={fetchChannelData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
