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
          <h1 className="text-3xl font-semibold">Channels</h1>
          <p className="text-muted-foreground mt-1">
            Manage your IoT data channels
          </p>
        </div>
        <Button asChild>
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
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : channels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Radio className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No channels yet</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              Create your first channel to start collecting IoT data. Channels organize your data streams.
            </p>
            <Button asChild>
              <Link href="/dashboard/channels/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Channel
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <Card key={channel.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Radio className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{channel.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {channel._count.dataPoints.toLocaleString()} data points
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/channels/${channel.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/channels/${channel.id}/edit`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Edit
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
                    <Badge variant="secondary" className="text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>

                {/* Field Labels Preview */}
                <div className="flex flex-wrap gap-1">
                  {[channel.field1Label, channel.field2Label, channel.field3Label, channel.field4Label]
                    .filter(Boolean)
                    .slice(0, 4)
                    .map((label, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  {[channel.field1Label, channel.field2Label, channel.field3Label, channel.field4Label]
                    .filter(Boolean).length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{[channel.field1Label, channel.field2Label, channel.field3Label, channel.field4Label]
                        .filter(Boolean).length - 4}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!channelToDelete} onOpenChange={() => setChannelToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Channel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{channelToDelete?.name}&quot;? This action cannot be undone.
              All data points in this channel will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => channelToDelete && deleteChannel(channelToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
