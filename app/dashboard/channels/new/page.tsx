'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Radio, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function NewChannelPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    field1Label: '',
    field2Label: '',
    field3Label: '',
    field4Label: '',
    field5Label: '',
    field6Label: '',
    field7Label: '',
    field8Label: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          isPublic: formData.isPublic,
          field1Label: formData.field1Label || undefined,
          field2Label: formData.field2Label || undefined,
          field3Label: formData.field3Label || undefined,
          field4Label: formData.field4Label || undefined,
          field5Label: formData.field5Label || undefined,
          field6Label: formData.field6Label || undefined,
          field7Label: formData.field7Label || undefined,
          field8Label: formData.field8Label || undefined,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Channel created successfully')
        router.push(`/dashboard/channels/${data.channel.id}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create channel')
      }
    } catch (error) {
      console.error('Error creating channel:', error)
      toast.error('Failed to create channel')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/channels">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Create Channel</h1>
          <p className="text-muted-foreground">Set up a new IoT data channel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5" />
              Channel Details
            </CardTitle>
            <CardDescription>
              Configure your channel settings and field labels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Channel Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Temperature Sensor #1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this channel will be used for..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublic">Public Channel</Label>
                  <p className="text-sm text-muted-foreground">
                    Anyone with the link can view this channel&apos;s data
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
              </div>
            </div>

            <Separator />

            {/* Field Labels */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Field Labels</h3>
                <p className="text-sm text-muted-foreground">
                  Define labels for up to 8 data fields (like ThingSpeak)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <Label htmlFor={`field${i + 1}Label`}>Field {i + 1}</Label>
                    <Input
                      id={`field${i + 1}Label`}
                      placeholder={`e.g., ${['Temperature', 'Humidity', 'Pressure', 'Light', 'Voltage', 'Current', 'CO2', 'Motion'][i]}`}
                      value={formData[`field${i + 1}Label` as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [`field${i + 1}Label`]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/channels">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Radio className="w-4 h-4 mr-2" />
                Create Channel
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
