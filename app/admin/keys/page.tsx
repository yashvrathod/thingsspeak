'use client'

import { useEffect, useState } from 'react'
import { Plus, Copy, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ApiKey {
  id: string
  name: string | null
  key: string
  status: string
  lastUsedAt: string | null
  createdAt: string
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      const response = await fetch('/api/api-keys')
      if (response.ok) {
        const data = await response.json()
        setKeys(data.apiKeys)
      }
    } catch {
      toast.error('Failed to load API keys')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const copyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  const deleteKey = async (id: string) => {
    try {
      const response = await fetch(`/api/api-keys?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setKeys((prev) => prev.filter((k) => k.id !== id))
        toast.success('API key revoked')
      } else {
        toast.error('Failed to revoke key')
      }
    } catch {
      toast.error('Failed to revoke key')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">API Keys</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage API keys for authentication</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity" disabled>
          <Plus className="w-4 h-4" />
          Generate Key
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {keys.map((apiKey) => (
            <div key={apiKey.id} className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{apiKey.name || 'Unnamed Key'}</h3>
                  <p className="text-sm text-muted-foreground">Created {new Date(apiKey.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => deleteKey(apiKey.id)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-4 flex items-center justify-between gap-4">
                  <code className="text-sm font-mono text-foreground break-all">
                    {revealedKeys.has(apiKey.id) ? apiKey.key : `${apiKey.key.slice(0, 12)}...${apiKey.key.slice(-4)}`}
                  </code>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleReveal(apiKey.id)}
                      className="p-2 hover:bg-border rounded-lg transition-colors"
                      title={revealedKeys.has(apiKey.id) ? 'Hide' : 'Show'}
                    >
                      {revealedKeys.has(apiKey.id) ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="p-2 hover:bg-border rounded-lg transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last used: {apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt).toLocaleDateString() : 'Never'}</span>
                  <span className="px-2 py-1 bg-muted rounded text-foreground font-medium">
                    {apiKey.status === 'ACTIVE' ? 'Active' : apiKey.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-muted border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          Total API keys: <span className="font-semibold text-foreground">{keys.length}</span>
        </p>
      </div>
    </div>
  )
}
