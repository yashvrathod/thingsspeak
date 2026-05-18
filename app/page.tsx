'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { 
  LayoutDashboard, 
  ArrowRight, 
  Radio,
  Github,
  Twitter,
  Activity,
  ChevronRight,
  Shield,
  RefreshCw,
  Cpu,
  BarChart3,
  Cloud,
  Zap,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function NavButtons() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <div className="w-8 h-8" />
  }
  
  if (session?.user) {
    return (
      <div className="flex items-center gap-6">
        <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Docs
        </Link>
        <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Projects
        </Link>
        <Button asChild className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-violet-500/20">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-6">
      <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Docs
      </Link>
      <Link href="/auth/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Sign In
      </Link>
      <Button asChild className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-violet-500/20">
        <Link href="/auth/signup">Get Started</Link>
      </Button>
    </div>
  )
}

function HeroButtons() {
  const { data: session } = useSession()
  
  if (session?.user) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <Button size="lg" asChild className="rounded-full px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-xl shadow-violet-500/25">
          <Link href="/dashboard">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="rounded-full px-8">
          <Link href="/projects">Browse Projects</Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
      <Button size="lg" asChild className="rounded-full px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-xl shadow-violet-500/25">
        <Link href="/auth/signup">
          Start for Free
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
      <Button size="lg" variant="outline" asChild className="rounded-full px-8">
        <Link href="/dashboard">
          <Play className="w-4 h-4 mr-2" />
          Live Demo
        </Link>
      </Button>
    </div>
  )
}

export default function Home() {
  const features = [
    {
      icon: Radio,
      title: 'Smart Channels',
      description: 'Organize data streams with up to 8 customizable fields per channel.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Secure by Design',
      description: 'Granular API keys with time-based expiry and role-based access.',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Beautiful, interactive charts that update as your sensors fire.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Cpu,
      title: 'Device First',
      description: 'Ready-made libraries for ESP32, Arduino, and Raspberry Pi.',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      icon: RefreshCw,
      title: 'Built-in Simulator',
      description: 'Test your integrations instantly without needing physical hardware.',
      gradient: 'from-emerald-500 to-green-500'
    },
    {
      icon: Cloud,
      title: 'Cloud Export',
      description: 'Export your historical data to CSV or JSON with a single click.',
      gradient: 'from-sky-500 to-blue-500'
    },
  ]

  return (
    <div className="min-h-screen bg-background selection:bg-violet-500/20 selection:text-foreground">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] left-1/4 w-[60%] h-[60%] bg-gradient-to-br from-violet-500/8 to-indigo-500/8 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[15%] right-1/4 w-[50%] h-[50%] bg-gradient-to-tl from-blue-500/6 to-cyan-500/6 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-violet-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Pulse</span>
          </Link>
          <NavButtons />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-sm font-medium text-violet-600 dark:text-violet-400 mb-8">
            <Zap className="w-4 h-4" />
            Introducing Pulse v1.0
            <ArrowRight className="w-4 h-4" />
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 max-w-5xl mx-auto leading-[1.05]">
            <span className="block text-foreground">Collect IoT Data</span>
            <span className="block bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">Like Never Before</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The elegant way to collect, visualize, and analyze your sensor data. 
            Built for developers who value simplicity and speed.
          </p>
          
          <HeroButtons />

          {/* Hero Dashboard Preview */}
          <div className="mt-20 relative max-w-4xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-blue-500/20 rounded-2xl blur-xl" />
            <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-background/60 text-xs text-muted-foreground">
                    app.pulse.io/dashboard
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Temperature', value: '24.8°C', trend: '+2.1%', gradient: 'from-orange-500 to-amber-500' },
                  { label: 'Humidity', value: '58.2%', trend: '-1.3%', gradient: 'from-blue-500 to-cyan-500' },
                  { label: 'Pressure', value: '1013 hPa', trend: '+0.5%', gradient: 'from-violet-500 to-purple-500' },
                  { label: 'Status', value: 'Online', trend: '99.9%', gradient: 'from-emerald-500 to-green-500' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-muted/30 border border-border/40">
                    <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br", stat.gradient, "flex items-center justify-center mb-3")}>
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-emerald-500 mt-1">{stat.trend}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 md:px-8 pb-6 md:pb-8">
                <div className="h-28 rounded-xl bg-gradient-to-r from-violet-500/5 via-indigo-500/5 to-blue-500/5 border border-border/40 flex items-end p-4 gap-1.5">
                  {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-violet-500/60 to-indigo-500/60" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground">A complete platform designed to make IoT data management effortless.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1">
                  <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br", feature.gradient, "flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110")}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* API Preview */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-medium text-violet-600 dark:text-violet-400">
                Developer Friendly
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Simple by Design. <br />
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Powerful by Default.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Connect your devices in seconds. Our minimal HTTP API handles the heavy lifting, 
                so you can focus on building your next great project.
              </p>
              <ul className="space-y-4">
                {[
                  "Standard HTTP POST requests",
                  "Automatic timestamping",
                  "Secure Write API Keys",
                  "Instant data validation"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-base">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-2xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-2xl bg-[#0d1117] border border-white/10 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-xs text-white/40 font-mono">upload.js</span>
                </div>
                <div className="p-6 md:p-8 overflow-x-auto">
                  <pre className="text-sm md:text-base font-mono">
                    <code className="text-white/90">
{`// Pulse API Data Upload
fetch('https://pulse.io/api/data/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    write_api_key: 'your_key',
    field1: 24.8,  // Temperature
    field2: 58.2,  // Humidity
    status: 'Device operational'
  })
});`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 px-8 py-16 md:px-16 md:py-24 overflow-hidden text-center">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-white/10 blur-[80px]" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-white/5 blur-[80px]" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                Ready to pulse your data?
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Join developers worldwide and start collecting your sensor data in minutes. 
                Free to start, easy to scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild className="rounded-full px-8 bg-white text-violet-600 hover:bg-white/90 font-semibold shadow-xl">
                  <Link href="/auth/signup">
                    Create Free Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full px-8 bg-white/10 text-white border-white/30 hover:bg-white/20">
                  <Link href="/dashboard">View Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg tracking-tight">Pulse</span>
              </Link>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                The open-source standard for IoT data visualization. 
                Built with precision and love for the maker community.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-violet-600 hover:border-violet-500/30 transition-all">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-violet-600 hover:border-violet-500/30 transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">Dashboard</Link></li>
                <li><Link href="/projects" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">Projects</Link></li>
                <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">Documentation</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">Sign In</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">Get Started</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026 Pulse. Built with precision for the next generation of IoT.
            </p>
            <div className="flex gap-8">
              <Link href="#" className="text-xs text-muted-foreground hover:text-violet-600 transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-violet-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
