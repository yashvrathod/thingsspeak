'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User, Mail, Shield, AlertTriangle, Loader2, LogOut, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
  })

  const handleUpdateProfile = async () => {
    setIsUpdating(true)
    toast.info('Profile update coming soon')
    setIsUpdating(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="border-border/50 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            Profile
          </CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="h-11 rounded-xl opacity-60"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>
          <Button onClick={handleUpdateProfile} disabled={isUpdating} className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600">
            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Profile
          </Button>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="border-border/50 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div>
              <h4 className="font-medium">Account Role</h4>
              <p className="text-sm text-muted-foreground">
                Your current role in the platform
              </p>
            </div>
            <Badge variant={session?.user?.role === 'ADMIN' ? 'default' : 'secondary'} className="rounded-full">
              {session?.user?.role}
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div>
              <h4 className="font-medium">Password</h4>
              <p className="text-sm text-muted-foreground">
                Change your account password
              </p>
            </div>
            <Button variant="outline" className="rounded-xl">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-destructive/20 bg-destructive/5">
          <CardTitle className="flex items-center gap-2 text-lg text-destructive">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-destructive to-red-600 flex items-center justify-center text-white">
              <AlertTriangle className="w-4 h-4" />
            </div>
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible account actions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-xl">
            <div>
              <h4 className="font-medium text-destructive">Sign Out</h4>
              <p className="text-sm text-muted-foreground">
                Sign out of your account on this device
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-xl text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
