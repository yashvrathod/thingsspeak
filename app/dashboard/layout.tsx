'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  Radio, 
  Key, 
  FolderOpen, 
  Settings, 
  LogOut, 
  Menu,
  X,
  User,
  ChevronDown,
  BookOpen,
  Activity,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/channels', label: 'Channels', icon: Radio },
    { href: '/dashboard/api-keys', label: 'API Keys', icon: Key },
    { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  const externalLinks = [
    { href: '/docs', label: 'Documentation', icon: BookOpen },
  ]

  if (session?.user?.role === 'ADMIN') {
    navItems.push({ href: '/admin', label: 'Admin', icon: User })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border/60 bg-gradient-to-b from-card to-card/95 h-screen fixed left-0 top-0 z-30">
        <div className="h-16 border-b border-border/50 flex items-center px-6 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-lg">Pulse</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group",
                  isActive
                    ? "bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 dark:text-violet-400"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/20"
                    : "bg-transparent group-hover:bg-muted"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2 px-3 font-medium uppercase tracking-wider">Resources</p>
          {externalLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground group"
              >
                <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center group-hover:bg-muted transition-all">
                  <Icon className="w-4 h-4" />
                </div>
                <span>Documentation</span>
              </Link>
            )
          })}
        </div>

        <div className="border-t border-border/50 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 px-2 h-auto py-2.5 rounded-xl hover:bg-muted/50">
                <Avatar className="w-8 h-8 ring-2 ring-violet-500/20">
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/50 shadow-xl">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden h-16 border-b border-border/60 bg-card/90 backdrop-blur-xl flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-lg">Pulse</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Bell className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-xl z-40 animate-in fade-in duration-200">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                    isActive
                      ? "bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 dark:text-violet-400"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <div className="pt-4 mt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2 px-4 font-medium uppercase tracking-wider">Resources</p>
              {externalLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="pt-4 mt-4 border-t border-border/50">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 px-4 rounded-xl text-destructive"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="w-5 h-5" />
                Sign out
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
