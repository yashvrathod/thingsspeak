'use client'

import { useEffect, useState } from 'react'
import { Search, Shield, User, Loader2, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  channels: number
  dataPoints: number
  apiKeys: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 50

  useEffect(() => {
    fetchUsers()
  }, [page, searchQuery])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const url = new URL('/api/admin/users', window.location.origin)
      url.searchParams.set('page', page.toString())
      url.searchParams.set('limit', limit.toString())
      if (searchQuery) url.searchParams.set('search', searchQuery)
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setTotal(data.total)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
        toast.success('User role updated')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update user')
      }
    } catch (error) {
      toast.error('Failed to update user role')
    }
  }

  const filteredUsers = users

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage platform users and permissions</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={() => setPage(1)}>
          Search
        </Button>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array(5).fill(null).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Channels</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Data Points</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">API Keys</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Select 
                        value={user.role} 
                        onValueChange={(value) => updateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-2" />
                              User
                            </div>
                          </SelectItem>
                          <SelectItem value="ADMIN">
                            <div className="flex items-center">
                              <Shield className="w-3 h-3 mr-2" />
                              Admin
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{user.channels}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{user.dataPoints.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{user.apiKeys}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page * limit >= total}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Users</p>
            <p className="text-2xl font-semibold text-foreground">{total.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Admins</p>
            <p className="text-2xl font-semibold text-accent">
              {users.filter((u) => u.role === 'ADMIN').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Active Channels</p>
            <p className="text-2xl font-semibold text-green-600">
              {users.reduce((acc, u) => acc + u.channels, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Data Points</p>
            <p className="text-2xl font-semibold text-blue-600">
              {users.reduce((acc, u) => acc + u.dataPoints, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
