'use client'

import { useState } from 'react'
import { Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  displayKey: string
  lastUsed: string
  created: string
}

const mockKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production Key',
    key: 'sk_prod_1234567890abcdefghijklmnop',
    displayKey: 'sk_prod_••••••••••••••••••••••••••••',
    lastUsed: '5 minutes ago',
    created: '2024-01-10',
  },
  {
    id: '2',
    name: 'Development Key',
    key: 'sk_dev_0987654321zyxwvutsrqponmlkji',
    displayKey: 'sk_dev_••••••••••••••••••••••••••••',
    lastUsed: '1 hour ago',
    created: '2024-02-15',
  },
  {
    id: '3',
    name: 'Testing Key',
    key: 'sk_test_abcdefghijklmnopqrstuvwxyz',
    displayKey: 'sk_test_••••••••••••••••••••••••••••',
    lastUsed: '2 days ago',
    created: '2024-03-01',
  },
]

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(mockKeys)
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set())

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

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
  }

  const deleteKey = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">API Keys</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage API keys for authentication</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Generate Key
        </button>
      </div>

      {/* Keys List */}
      <div className="space-y-4">
        {keys.map((apiKey) => (
          <div key={apiKey.id} className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{apiKey.name}</h3>
                <p className="text-sm text-muted-foreground">Created {apiKey.created}</p>
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
                  {revealedKeys.has(apiKey.id) ? apiKey.key : apiKey.displayKey}
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
                <span>Last used: {apiKey.lastUsed}</span>
                <span className="px-2 py-1 bg-muted rounded text-foreground font-medium">Read & Write</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-muted border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          Total API keys: <span className="font-semibold text-foreground">{keys.length}</span>
        </p>
      </div>
    </div>
  )
}
