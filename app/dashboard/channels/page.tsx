'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Radio, Plus, MoreVertical, Eye, EyeOff, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

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
  _count: {
    dataPoints: number
  }
}

const gradients = [
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-orange-500 to-amber-500',
  'from-emerald-500 to-green-500',
  'from-sky-500 to-blue-500',
]

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null)

  useEffect(() => {
    fetchChannels()
  }, [])

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels')
      if (response.ok) {
        const data = await response.json()
        setChannels(data.channels)
      }
    } catch (error) {
      console.error('Error fetching channels:', error)
      toast.error('Failed to load channels')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteChannel = async (channelId: string) => {
    try {
      const response = await fetch(`/api/channels/${channelId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setChannels(channels.filter(c => c.id !== channelId))
        toast.success('Channel deleted successfully')
      } else {
        toast.error('Failed to delete channel')
      }
    } catch (error) {
      console.error('Error deleting channel:', error)
      toast.error('Failed to delete channel')
    } finally {
      setChannelToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Channels</h1>
          <p className="text-muted-foreground mt-1">
            Manage your IoT data channels
          </p>
        </div>
        <Button asChild className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20">
          <Link href="/dashboard/channels/new">
            <Plus className="w-4 h-4 mr-2" />
            New Channel
          </Link>
        </Button>
      </div>

      {/* Channels Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(null).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : channels.length === 0 ? (
        <Card className="border-border/50 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center mb-4">
              <Radio className="w-8 h-8 text-violet-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">No channels yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your first channel to start collecting IoT data. Channels organize your data streams.
            </p>
            <Button asChild className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
              <Link href="/dashboard/channels/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Channel
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((channel, index) => (
            <Card key={channel.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-violet-500/30 rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center shadow-lg shrink-0`}>
                      <Radio className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">{channel.name}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {channel._count.dataPoints.toLocaleString()} data points
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/channels/${channel.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setChannelToDelete(channel)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {channel.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {channel.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  {channel.isPublic ? (
                    <Badge variant="secondary" className="text-xs rounded-full">
                      <Eye className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs rounded-full">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>

                {/* Field Labels Preview */}
                <div className="flex flex-wrap gap-1">
                  {[channel.field1Label, channel.field2Label].filter(Boolean).map((label, i) => (
                    <Badge key={i} variant="outline" className="text-xs rounded-full bg-muted/30">
                      {label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!channelToDelete} onOpenChange={() => setChannelToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Channel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{channelToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => channelToDelete && deleteChannel(channelToDelete.id)}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
