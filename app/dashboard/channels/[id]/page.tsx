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
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
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
      console.log('Fetching channel data for:', channelId)
      const response = await fetch(`/api/channels/${channelId}?data=true&limit=100`)
      console.log('Response status:', response.status)
      if (response.ok) {
        const result = await response.json()
        console.log('Channel result:', result)
        console.log('Data points:', result.data?.points?.length || 0)
        setChannel(result.channel)
        setData(result.data?.points || [])
      } else {
        const error = await response.json()
        console.error('Failed to load channel:', error)
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
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="text-center py-12">
        <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-medium mb-2">Channel not found</h2>
        <Button asChild>
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
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/channels">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{channel.name}</h1>
              {channel.isPublic ? (
                <Badge variant="secondary"><Eye className="w-3 h-3 mr-1" /> Public</Badge>
              ) : (
                <Badge variant="outline"><EyeOff className="w-3 h-3 mr-1" /> Private</Badge>
              )}
            </div>
            {channel.description && (
              <p className="text-muted-foreground mt-1">{channel.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('json')}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm">Total Data Points</p>
            <p className="text-2xl font-semibold">{channel._count.dataPoints.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm">Fields</p>
            <p className="text-2xl font-semibold">{fieldLabels.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm">Created</p>
            <p className="text-2xl font-semibold">{new Date(channel.createdAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="data">Data Table</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="simulator">Device Simulator</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <ChannelCharts data={data} fieldLabels={fieldLabels} />
        </TabsContent>

        <TabsContent value="data">
          <DataTable data={data} fieldLabels={fieldLabels} />
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
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
                    <Input value={channel.readApiKey} readOnly type="password" className="font-mono" />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleCopyKey(channel.readApiKey, 'Read')}
                    >
                      {copiedKey === 'Read' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this key to read data from the channel
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Write API Key</Label>
                  <div className="flex gap-2">
                    <Input value={channel.writeApiKey} readOnly type="password" className="font-mono" />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleCopyKey(channel.writeApiKey, 'Write')}
                    >
                      {copiedKey === 'Write' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this key to send data to the channel
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Regenerate Keys</h4>
                  <p className="text-sm text-muted-foreground">
                    This will invalidate the current keys and generate new ones
                  </p>
                </div>
                <Button variant="outline" onClick={handleRegenerateKeys}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">API Endpoint</h4>
                <code className="bg-muted p-2 rounded text-sm font-mono block">
                  POST /api/data/upload
                </code>
                <p className="text-sm text-muted-foreground mt-2">
                  Send data with: <code className="bg-muted px-1 rounded">write_api_key</code>, <code className="bg-muted px-1 rounded">field1</code>-<code className="bg-muted px-1 rounded">field8</code>
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
