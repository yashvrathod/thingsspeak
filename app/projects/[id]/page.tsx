'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft,
  Clock,
  Zap,
  BookOpen,
  CheckCircle,
  Circle,
  Play,
  Cpu,
  Wrench,
  ListOrdered,
  Lightbulb,
  ExternalLink,
  Bookmark,
  Copy,
  Check,
  Loader2,
  Radio
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface Project {
  id: string
  title: string
  description: string
  type: 'BASIC' | 'IOT'
  imageUrl: string | null
  videoUrl: string | null
  diagramUrl: string | null
  driveLink: string | null
  components: string[]
  connections: string[]
  steps: string[]
  working: string | null
  references: string[]
  code: string | null
  fieldLabels: string[]
  tags: string[]
  category: string | null
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: string | null
  usageCount: number
  userProject?: {
    id: string
    channelId: string | null
    completed: boolean
    bookmarks: boolean
    channel?: {
      id: string
      name: string
      writeApiKey: string
      readApiKey: string
    }
  } | null
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isActivating, setIsActivating] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const projectId = params?.id as string

  useEffect(() => {
    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const fetchProject = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching project with ID:', projectId)
      const response = await fetch(`/api/projects/${projectId}`)
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Project data:', data)
        setProject(data.project)
      } else {
        const error = await response.json()
        console.error('API error:', error)
        toast.error(error.error || 'Project not found')
        setProject(null)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Failed to load project')
      setProject(null)
    } finally {
      setIsLoading(false)
    }
  }

  const activateProject = async () => {
    try {
      setIsActivating(true)
      const response = await fetch(`/api/projects/${projectId}/activate`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const data = await response.json()
        setProject(prev => prev ? { ...prev, userProject: data.userProject } : null)
        toast.success(data.alreadyActivated ? 'Project already activated' : 'Project activated! Channel created.')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to activate project')
      }
    } catch (error) {
      toast.error('Failed to activate project')
    } finally {
      setIsActivating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'ADVANCED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-64 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link href="/projects">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/projects" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={getDifficultyColor(project.difficulty)}>
              {project.difficulty}
            </Badge>
            {project.type === 'IOT' && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Zap className="w-3 h-3 mr-1" />
                IoT Project
              </Badge>
            )}
            {project.category && (
              <Badge variant="outline">{project.category}</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-lg text-muted-foreground">{project.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
            {project.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {project.duration}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Bookmark className="w-4 h-4" />
              {project.usageCount} users building this
            </span>
          </div>
        </div>

        {/* Video Section */}
        {project.videoUrl && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Video Tutorial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <iframe
                  src={project.videoUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diagram Section */}
        {project.diagramUrl && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Circuit Diagram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={project.diagramUrl} 
                alt="Circuit Diagram"
                className="w-full rounded-lg border"
              />
            </CardContent>
          </Card>
        )}

        {/* Components Section */}
        {project.components.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Components Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.components.map((component, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span>{component}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Connections/Pinout Section */}
        {project.connections.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5" />
                Pinout / Circuit Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {project.connections.map((connection, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                    <span className="text-accent font-mono">{index + 1}.</span>
                    <span>{connection}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Working Principle */}
        {project.working && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Working Principle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{project.working}</p>
            </CardContent>
          </Card>
        )}

        {/* Step-by-Step Instructions */}
        {project.steps.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListOrdered className="w-5 h-5" />
                Step-by-Step Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {project.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-muted-foreground">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* IoT Specific Sections */}
        {project.type === 'IOT' && (
          <>
            {/* Code Section */}
            {project.code && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Arduino / ESP32 Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code className="text-foreground">{project.code}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(project.code || '')}
                    >
                      {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Integration Section */}
            <Card className="mb-8 border-accent/20">
              <CardHeader className="bg-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  IoT Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {!project.userProject ? (
                  <div className="text-center py-6">
                    <h3 className="font-semibold mb-2">Ready to build this project?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click below to automatically create a channel with pre-configured fields for this project.
                    </p>
                    <Button onClick={activateProject} disabled={isActivating} size="lg">
                      {isActivating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Use This Project
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Project activated! Channel created.</span>
                    </div>
                    
                    {project.userProject.channel && (
                      <div className="space-y-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Channel Name</p>
                          <p className="text-sm text-muted-foreground">{project.userProject.channel.name}</p>
                        </div>
                        
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Write API Key</p>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-background px-2 py-1 rounded flex-1 truncate">
                              {project.userProject.channel.writeApiKey}
                            </code>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(project.userProject?.channel?.writeApiKey || '')}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Paste this key in your Arduino code where it says YOUR_WRITE_API_KEY
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button asChild variant="outline">
                            <Link href={`/dashboard/channels/${project.userProject.channel.id}`}>
                              <Radio className="w-4 h-4 mr-2" />
                              View Channel
                            </Link>
                          </Button>
                          <Button asChild>
                            <Link href={`/dashboard/channels/${project.userProject.channel.id}`}>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Live Data
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Basic Project Notice */}
        {project.type === 'BASIC' && (
          <Card className="mb-8 bg-muted">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Hardware-Based Project</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a hardware/electronics project and does not require API integration. 
                    Follow the circuit diagram and instructions above to build it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* References */}
        {project.references.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                References & Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {project.references.map((ref, index) => (
                  <li key={index}>
                    <a 
                      href={ref} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline flex items-center gap-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Resources Link */}
        {project.driveLink && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Download Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access additional files, datasheets, and resources for this project.
              </p>
              <Button asChild variant="outline">
                <a href={project.driveLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Google Drive
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <Separator className="my-8" />
        <div className="flex items-center justify-between">
          <Link href="/projects">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <div className="flex gap-2">
            {project.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
