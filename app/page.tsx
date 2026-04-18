'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { 
  LayoutDashboard, 
  Zap, 
  BarChart3, 
  Lock, 
  Cloud, 
  ArrowRight, 
  Radio,
  Key,
  FolderOpen,
  Github,
  Twitter,
  BookOpen,
  Activity,
  ChevronRight,
  Shield,
  RefreshCw,
  Cpu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

// Navigation buttons based on auth state
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
        <Button asChild variant="secondary" size="sm" className="gap-2 rounded-full px-4">
          <Link href="/dashboard">
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            Dashboard
          </Link>
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
      <Button asChild size="sm" className="rounded-full px-5">
        <Link href="/auth/signup">
          Get Started
        </Link>
      </Button>
    </div>
  )
}

// Hero buttons based on auth state
function HeroButtons() {
  const { data: session } = useSession()
  
  if (session?.user) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <Button size="lg" asChild className="rounded-full px-8 shadow-lg shadow-primary/20">
          <Link href="/dashboard">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="rounded-full px-8">
          <Link href="/projects">
            Browse Projects
          </Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
      <Button size="lg" asChild className="rounded-full px-8 shadow-lg shadow-primary/20">
        <Link href="/auth/signup">
          Start for Free
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
      <Button size="lg" variant="outline" asChild className="rounded-full px-8">
        <Link href="/dashboard">
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
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      icon: Shield,
      title: 'Secure by Design',
      description: 'Granular API keys with time-based expiry and role-based access.',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Beautiful, interactive charts that update as your sensors fire.',
      color: 'text-pink-500',
      bg: 'bg-pink-500/10'
    },
    {
      icon: Cpu,
      title: 'Device First',
      description: 'Ready-made libraries for ESP32, Arduino, and Raspberry Pi.',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    {
      icon: RefreshCw,
      title: 'Built-in Simulator',
      description: 'Test your integrations instantly without needing physical hardware.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      icon: Cloud,
      title: 'Cloud Export',
      description: 'Export your historical data to CSV or JSON with a single click.',
      color: 'text-sky-500',
      bg: 'bg-sky-500/10'
    },
  ]

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground transition-transform group-hover:scale-105">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Pulse</span>
          </Link>
          <NavButtons />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/50 text-xs font-medium text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Introducing Pulse v1.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-[1.1]">
            Seamless IoT Data. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Real-time Insights.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The elegant way to collect, visualize, and analyze your sensor data. 
            Built for developers who value simplicity and speed.
          </p>
          
          <HeroButtons />

          {/* Trust Labels */}
          <div className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 grayscale opacity-50">
            <span className="text-sm font-semibold tracking-widest uppercase">Open Source</span>
            <span className="text-sm font-semibold tracking-widest uppercase">ESP32 Ready</span>
            <span className="text-sm font-semibold tracking-widest uppercase">Secure API</span>
            <span className="text-sm font-semibold tracking-widest uppercase">Real-time</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative bg-muted/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground">A complete platform designed to make IoT data management effortless.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="group p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300", feature.bg)}>
                    <Icon className={cn("w-6 h-6", feature.color)} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* API Preview */}
      <section className="py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                Developer Friendly
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Simple by Design. <br />
                Powerful by Default.
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
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-2xl bg-[#0d1117] border border-white/10 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">upload.js</span>
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
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[3rem] bg-primary px-8 py-16 md:px-16 md:py-24 overflow-hidden text-center">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-white/10 blur-[80px]" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-accent/20 blur-[80px]" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-primary-foreground">
                Ready to pulse your data?
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Join developers worldwide and start collecting your sensor data in minutes. 
                Free to start, easy to scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" asChild className="rounded-full px-8 text-primary font-bold">
                  <Link href="/auth/signup">
                    Create Free Account
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full px-8 bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-white/10 transition-colors">
                  <Link href="/dashboard">
                    View Demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-16 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg tracking-tight">Pulse</span>
              </Link>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                The open-source standard for IoT data visualization. 
                Built with precision and love for the maker community.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 transition-all">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">Projects</Link></li>
                <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sign In</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-primary transition-colors">Get Started</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026 Pulse. Built with precision for the next generation of IoT.
            </p>
            <div className="flex gap-8">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">Privacy Policy</Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
