'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ErrorBoundary } from '@/components/error-boundary'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Package, 
  Key, 
  Users, 
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: Package },
    { href: '/admin/keys', label: 'API Keys', icon: Key },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "border-r border-border/60 bg-gradient-to-b from-card to-card/95 transition-all duration-300 flex flex-col relative",
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="h-16 border-b border-border/50 flex items-center px-6 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          {sidebarOpen && <span className="font-bold tracking-tight text-foreground">Pulse Admin</span>}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false)
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
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0",
                  isActive
                    ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/20"
                    : "bg-transparent group-hover:bg-muted"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Toggle Button */}
        <div className="h-16 border-t border-border/50 flex items-center px-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center py-2.5 px-3 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-16 border-b border-border/50 bg-background/60 backdrop-blur-xl px-8 flex items-center gap-4 sticky top-0 z-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-violet-500" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">Admin Panel</h1>
        </div>
        <div className="p-8 max-w-7xl mx-auto"><ErrorBoundary>{children}</ErrorBoundary></div>
      </main>
    </div>
  )
}
