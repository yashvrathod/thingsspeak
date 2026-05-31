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
  Play,
  CheckCircle2,
  Lock,
  Search,
  Server,
  Globe,
  Database
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/animations/reveal'
import { PulseIndicator } from '@/components/ui/pulse-indicator'

function NavButtons() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <div className="w-8 h-8" />
  }
  
  return (
    <div className="flex items-center gap-6">
      <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Docs
      </Link>
      <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Templates
      </Link>
      {session?.user ? (
        <Button asChild className="rounded-md px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/auth/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Button asChild className="rounded-md px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

function HeroButtons() {
  const { data: session } = useSession()

  if (session?.user) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" asChild className="rounded-md px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md">
          <Link href="/dashboard/channels/new">
            Create Channel
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="rounded-md px-8 h-12 border-border hover:bg-accent hover:text-accent-foreground font-bold transition-all">
          <Link href="/projects">
            Browse Templates
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button size="lg" asChild className="rounded-md px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md">
        <Link href="/auth/signup">
          Start Building
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
      <Button size="lg" variant="outline" asChild className="rounded-md px-8 h-12 border-border hover:bg-accent hover:text-accent-foreground font-bold transition-all">
        <Link href="/docs">
          Request Demo
        </Link>
      </Button>
    </div>
  )
}

function CtaButtons() {
  const { data: session } = useSession()

  if (session?.user) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" asChild className="rounded-md h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
          <Link href="/dashboard/channels/new">Create New Channel</Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="rounded-md h-14 px-10 border-border font-bold">
          <Link href="/projects">Explore Templates</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button size="lg" asChild className="rounded-md h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
        <Link href="/auth/signup">Create Free Account</Link>
      </Button>
      <Button size="lg" variant="outline" asChild className="rounded-md h-14 px-10 border-border font-bold">
        <Link href="/docs">Read Documentation</Link>
      </Button>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary pro-grid">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">Pulse IoT</span>
          </Link>
          <NavButtons />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-bold text-primary uppercase tracking-wider mb-8">
              <Server className="w-3.5 h-3.5" />
              Enterprise-Grade IoT Infrastructure
            </div>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1] text-slate-900 dark:text-white">
              Industrial Data Visualization <br />
              <span className="text-primary">Simplified for Scale.</span>
            </h1>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect thousands of devices, collect real-time sensor data, and gain 
              actionable insights with our high-performance visualization engine.
            </p>
          </Reveal>
          
          <Reveal delay={0.3}>
            <HeroButtons />
          </Reveal>

          {/* Structured Preview */}
          <Reveal delay={0.5} distance={40} className="mt-20">
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-primary/5 rounded-xl blur-3xl -z-10" />
              <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden text-left">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground font-mono">system_v4.2 // dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PulseIndicator color="emerald" size="sm" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Syncing_Live</span>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      { label: 'Active Nodes', value: '1,284', icon: Server, color: 'text-blue-600' },
                      { label: 'Inbound Rate', value: '14.2k/s', icon: Activity, color: 'text-emerald-600' },
                      { label: 'Network Health', value: '99.98%', icon: Shield, color: 'text-indigo-600' },
                    ].map((s) => (
                      <div key={s.label} className="p-5 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <s.icon className={cn("w-5 h-5", s.color)} />
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Metric_A1</span>
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-48 w-full bg-muted/20 border border-border rounded-lg flex items-end p-4 gap-2">
                    {[30, 45, 35, 60, 50, 80, 70, 90, 85, 60, 75, 55, 40, 65, 95, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8">Powering Industrial Ecosystems Globally</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
            {/* Simple Logo Placeholders */}
            {['LOGISTICS', 'SENSORTAKE', 'NODEGRID', 'DATASPHERE', 'IOT_CORE'].map(l => (
              <span key={l} className="text-xl font-black italic tracking-tighter">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-20 space-y-4 text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Precision-Engineered Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Pulse provides the robust tools necessary for high-stakes industrial monitoring and data management.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Radio,
                title: 'Data Channels',
                description: 'Multiplexed sensor data streams with support for up to 8 granular fields per channel.'
              },
              {
                icon: Shield,
                title: 'Secure Gateways',
                description: 'Military-grade encryption for all inbound and outbound telemetry with role-based access.'
              },
              {
                icon: Globe,
                title: 'Global Delivery',
                description: 'Edge-cached data retrieval ensuring low-latency visualization for international operations.'
              },
              {
                icon: Zap,
                title: 'Real-time Logic',
                description: 'Serverless event triggers and alerts based on real-time sensor threshold violations.'
              },
              {
                icon: Database,
                title: 'Historian Archive',
                description: 'High-fidelity historical data storage with instant CSV/JSON export capabilities.'
              },
              {
                icon: Cpu,
                title: 'Native SDKs',
                description: 'Optimized libraries for industry-standard hardware including ESP32, Arduino, and Linux.'
              }
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <div className="p-8 rounded-xl border border-border bg-card hover:border-primary/40 transition-all hover:shadow-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{f.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study / Impact Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal direction="left">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Reliability at Every Layer.</h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Our architecture is built to handle the rigorous demands of industrial automation. 
                  From sub-second latency to 99.99% uptime, Pulse is the backbone of your IoT operation.
                </p>
                <div className="space-y-4">
                  {[
                    "Distributed Multi-Region Infrastructure",
                    "End-to-End TLS 1.3 Communication",
                    "Automated Device Provisioning",
                    "API-First Architecture"
                  ].map(t => (
                    <div key={t} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="font-semibold text-slate-200">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.2}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-2xl opacity-50" />
                <div className="relative rounded-xl border border-white/10 bg-black/40 p-8 font-mono text-sm leading-relaxed overflow-x-auto">
                  <div className="flex justify-between items-center mb-6 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                    <span>device_uplink.sh</span>
                    <span>v2.0.1</span>
                  </div>
                  <code className="text-emerald-400">
                    <p>$ curl -X POST https://api.pulse.io/v1/update \</p>
                    <p className="pl-4">-H "X-API-Key: px_live_8a2..." \</p>
                    <p className="pl-4">-d "field1=24.8&field2=58.2" </p>
                    <p className="mt-4 text-slate-400"># Response [200 OK]</p>
                    <p className="text-blue-400">{`{ "status": "success", "id": 48291 }`}</p>
                  </code>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-background">
        <Reveal distance={20}>
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">Secure Your Infrastructure.</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Start monitoring your industrial assets today. Deploy our cloud-native 
              engine and visualize your telemetry in minutes.
            </p>
            <CtaButtons />
            <p className="mt-8 text-sm text-muted-foreground">No credit card required. Up to 3,000 requests/hour included.</p>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-tight">Pulse IoT</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                The standard for industrial data visualization and device management. 
                Built for security-conscious engineering teams.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 rounded-md border border-border hover:bg-accent transition-colors"><Github className="w-5 h-5" /></a>
                <a href="#" className="p-2 rounded-md border border-border hover:bg-accent transition-colors"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Product</h4>
              <ul className="space-y-3">
                {[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Templates', href: '/projects' }, { label: 'Security', href: '#' }, { label: 'Pricing', href: '#' }].map(i => (
                  <li key={i.label}><Link href={i.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{i.label}</Link></li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Support</h4>
              <ul className="space-y-3">
                {['Documentation', 'API Reference', 'System Status', 'Contact'].map(i => (
                  <li key={i}><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{i}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2026 Pulse IoT Systems. All rights reserved.</p>
            <div className="flex gap-8 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
