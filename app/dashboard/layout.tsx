'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { ErrorBoundary } from '@/components/error-boundary'
import { 
  LayoutDashboard, 
  Radio, 
  Key, 
  FolderOpen, 
  Settings, 
  LogOut, 
  Menu,
  X,
  BookOpen,
  Activity,
  Bell,
  Search,
  ExternalLink,
  ShieldAlert,
  CreditCard,
  ChevronDown,
  HelpCircle
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
  ]

  const settingsItems = [
    { href: '/dashboard/settings', label: 'Account Settings', icon: Settings },
    { href: '#', label: 'Billing', icon: CreditCard },
  ]

  if (session?.user?.role === 'ADMIN') {
    navItems.push({ href: '/admin', label: 'Admin Console', icon: ShieldAlert })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0">
        <div className="h-16 border-b border-border flex items-center px-6 gap-3">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-lg">Pulse IoT</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Management</p>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Configuration</p>
            {settingsItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 px-2 h-auto py-2 hover:bg-accent">
                <Avatar className="w-8 h-8 border border-border">
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold truncate">{session?.user?.name || 'User'}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{session?.user?.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-lg border-border shadow-lg">
              <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">System Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <div className="lg:hidden h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight">Pulse IoT</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-md"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background z-40 animate-in fade-in duration-200 p-6">
          <nav className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Management</p>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-md transition-all text-sm font-medium",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="pt-6 border-t border-border">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-4 px-4 py-3 text-destructive rounded-md"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="w-5 h-5" />
                <span>Sign out</span>
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar for search/actions */}
        <header className="hidden lg:flex h-16 border-b border-border bg-card/30 items-center justify-between px-12">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search devices, channels, keys..." 
              className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full h-9 w-9">
              <Bell className="w-4 h-5" />
            </Button>
            <div className="h-4 w-[1px] bg-border mx-2" />
            <Button variant="outline" size="sm" className="gap-2 rounded-md font-semibold text-xs h-9">
              <BookOpen className="w-3.5 h-3.5" />
              Docs
              <ExternalLink className="w-3 h-3 opacity-50" />
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 lg:p-12 flex-1">
          <div className="max-w-[1400px] mx-auto">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  )
}
