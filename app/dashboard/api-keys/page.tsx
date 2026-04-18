'use client'

import { useEffect, useState } from 'react'
import { Key, Plus, Trash2, RefreshCw, Copy, Check, Calendar, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface ApiKey {
  id: string
  key: string
  name: string | null
  expiresAt: string
  status: string
  createdAt: string
  lastUsedAt: string | null
  requestCount: number
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyData, setNewKeyData] = useState<{ name: string; expiresInDays: number } | null>(null)
  const [showNewKey, setShowNewKey] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', expiresInDays: '30' })

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.apiKeys)
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
      toast.error('Failed to load API keys')
    } finally {
      setIsLoading(false)
    }
  }

  const createApiKey = async () => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          expiresInDays: parseInt(formData.expiresInDays),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewKeyData(data.apiKey)
        setShowNewKey(true)
        setIsDialogOpen(false)
        fetchApiKeys()
        toast.success('API key created successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create API key')
      }
    } catch (error) {
      toast.error('Failed to create API key')
    } finally {
      setIsCreating(false)
      setFormData({ name: '', expiresInDays: '30' })
    }
  }

  const revokeApiKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/api-keys?id=${keyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setApiKeys(apiKeys.filter(k => k.id !== keyId))
        toast.success('API key revoked')
      } else {
        toast.error('Failed to revoke API key')
      }
    } catch (error) {
      toast.error('Failed to revoke API key')
    }
  }

  const regenerateApiKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/api-keys/${keyId}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresInDays: 30 }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewKeyData(data.apiKey)
        setShowNewKey(true)
        fetchApiKeys()
        toast.success('API key regenerated')
      } else {
        toast.error('Failed to regenerate API key')
      }
    } catch (error) {
      toast.error('Failed to regenerate API key')
    }
  }

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date() > new Date(expiresAt)
    
    if (status === 'REVOKED') {
      return <Badge variant="destructive">Revoked</Badge>
    }
    if (status === 'EXPIRED' || isExpired) {
      return <Badge variant="secondary">Expired</Badge>
    }
    return <Badge variant="default" className="bg-green-500">Active</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">API Keys</h1>
          <p className="text-muted-foreground mt-1">
            Manage your API keys for IoT data access
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to access the IoT platform API
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Key Name (Optional)</Label>
                <Input
                  id="name"
                  placeholder="e.g., Arduino Sensor #1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Expires In</Label>
                <Select
                  value={formData.expiresInDays}
                  onValueChange={(v) => setFormData({ ...formData, expiresInDays: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createApiKey} disabled={isCreating}>
                {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Create Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* New Key Alert */}
      {showNewKey && newKeyData && (
        <Card className="border-accent bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Key className="w-5 h-5" />
              Your New API Key
            </CardTitle>
            <CardDescription>
              Copy this key now. You won&apos;t be able to see it again!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-background p-3 rounded font-mono text-sm break-all">
                {newKeyData.key}
              </code>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => copyToClipboard(newKeyData.key, 'new')}
              >
                {copiedId === 'new' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Expires: {new Date(newKeyData.expiresAt).toLocaleDateString()}
            </div>
            <Button onClick={() => setShowNewKey(false)} variant="outline" className="w-full">
              I&apos;ve Saved My Key
            </Button>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(null).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : apiKeys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No API keys yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Create an API key to start sending data from your IoT devices
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{apiKey.name || 'Unnamed Key'}</h3>
                      {getStatusBadge(apiKey.status, apiKey.expiresAt)}
                    </div>
                    <code className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                      {apiKey.key}
                    </code>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Expires: {new Date(apiKey.expiresAt).toLocaleDateString()}
                      </span>
                      {apiKey.lastUsedAt && (
                        <span className="flex items-center gap-1">
                          Last used: {new Date(apiKey.lastUsedAt).toLocaleDateString()}
                        </span>
                      )}
                      <span>{apiKey.requestCount.toLocaleString()} requests</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(apiKey.key.replace('...', ''), apiKey.id)}
                    >
                      {copiedId === apiKey.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => regenerateApiKey(apiKey.id)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => revokeApiKey(apiKey.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>How to use your API keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Upload Data</h4>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <p className="text-green-600">POST /api/data/upload</p>
              <p className="text-muted-foreground mt-2">Body (JSON):</p>
              <pre className="mt-1">
{`{
  "api_key": "your_api_key_here",
  "channel_id": "your_channel_id",
  "field1": 25.5,
  "field2": 60.0,
  "status": "ok"
}`}
              </pre>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Using Channel Write Key (Simpler)</h4>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <p className="text-green-600">POST /api/data/upload</p>
              <p className="text-muted-foreground mt-2">Body (JSON):</p>
              <pre className="mt-1">
{`{
  "write_api_key": "channel_write_key",
  "field1": 25.5,
  "field2": 60.0
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
