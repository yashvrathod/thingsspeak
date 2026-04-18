'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Loader2, ImageIcon, ExternalLink, Tag, Video, Cpu, Zap, BookOpen, Wrench, ListOrdered, Lightbulb, Code, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
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
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: string | null
  tags: string[]
  category: string | null
  isPublished: boolean
  featured: boolean
  createdAt: string
  user: {
    name: string | null
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'BASIC' as 'BASIC' | 'IOT',
    driveLink: '',
    imageUrl: '',
    videoUrl: '',
    diagramUrl: '',
    category: '',
    difficulty: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    duration: '',
    tags: '',
    components: '',
    connections: '',
    steps: '',
    working: '',
    references: '',
    code: '',
    fieldLabels: '',
    featured: false,
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?admin=true')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  const createProject = async () => {
    setIsCreating(true)
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        driveLink: formData.driveLink || undefined,
        imageUrl: formData.imageUrl || undefined,
        videoUrl: formData.videoUrl || undefined,
        diagramUrl: formData.diagramUrl || undefined,
        category: formData.category || undefined,
        difficulty: formData.difficulty,
        duration: formData.duration || undefined,
        tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        components: formData.components.split('\n').map((t: string) => t.trim()).filter(Boolean),
        connections: formData.connections.split('\n').map((t: string) => t.trim()).filter(Boolean),
        steps: formData.steps.split('\n').map((t: string) => t.trim()).filter(Boolean),
        working: formData.working || undefined,
        references: formData.references.split('\n').map((t: string) => t.trim()).filter(Boolean),
        code: formData.code || undefined,
        fieldLabels: formData.fieldLabels.split(',').map((t: string) => t.trim()).filter(Boolean),
        featured: formData.featured,
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success('Project created successfully')
        setIsDialogOpen(false)
        fetchProjects()
        setFormData({
          title: '',
          description: '',
          type: 'BASIC',
          driveLink: '',
          imageUrl: '',
          videoUrl: '',
          diagramUrl: '',
          category: '',
          difficulty: 'BEGINNER',
          duration: '',
          tags: '',
          components: '',
          connections: '',
          steps: '',
          working: '',
          references: '',
          code: '',
          fieldLabels: '',
          featured: false,
        })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create project')
      }
    } catch (error) {
      toast.error('Failed to create project')
    } finally {
      setIsCreating(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId))
        toast.success('Project deleted')
      } else {
        toast.error('Failed to delete project')
      }
    } catch (error) {
      toast.error('Failed to delete project')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your IoT projects and devices</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Create a comprehensive project guide with documentation, diagrams, and code
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="iot">IoT Settings</TabsTrigger>
                <TabsTrigger value="publish">Publish</TabsTrigger>
              </TabsList>
              
              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Smart Temperature Monitor"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Project Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: 'BASIC' | 'IOT') => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BASIC">
                          <div className="flex items-center">
                            <Cpu className="w-4 h-4 mr-2" />
                            Basic Electronics
                          </div>
                        </SelectItem>
                        <SelectItem value="IOT">
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-2" />
                            IoT Project
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief overview of what this project does..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select 
                      value={formData.difficulty} 
                      onValueChange={(value: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => 
                        setFormData({ ...formData, difficulty: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Estimated Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 2 hours"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Home Automation"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="Arduino, ESP32, Temperature, WiFi, Sensors..."
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
              </TabsContent>
              
              {/* Media Tab */}
              <TabsContent value="media" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Thumbnail Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Video Tutorial URL (YouTube or Drive)
                  </Label>
                  <Input
                    id="videoUrl"
                    placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="diagramUrl" className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Circuit Diagram Image URL
                  </Label>
                  <Input
                    id="diagramUrl"
                    placeholder="https://..."
                    value={formData.diagramUrl}
                    onChange={(e) => setFormData({ ...formData, diagramUrl: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="driveLink" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Google Drive Resources Link
                  </Label>
                  <Input
                    id="driveLink"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={formData.driveLink}
                    onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                  />
                </div>
              </TabsContent>
              
              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="components" className="flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    Components Required (one per line)
                  </Label>
                  <Textarea
                    id="components"
                    placeholder="Arduino Uno&#10;DHT22 Temperature Sensor&#10;Breadboard&#10;Jumper Wires..."
                    value={formData.components}
                    onChange={(e) => setFormData({ ...formData, components: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="connections" className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Pinout / Circuit Connections (one per line)
                  </Label>
                  <Textarea
                    id="connections"
                    placeholder="DHT22 VCC → Arduino 5V&#10;DHT22 GND → Arduino GND&#10;DHT22 DATA → Arduino Pin 2..."
                    value={formData.connections}
                    onChange={(e) => setFormData({ ...formData, connections: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="steps" className="flex items-center gap-2">
                    <ListOrdered className="w-4 h-4" />
                    Step-by-Step Instructions (one per line)
                  </Label>
                  <Textarea
                    id="steps"
                    placeholder="Step 1: Connect the DHT22 sensor to the breadboard&#10;Step 2: Wire the VCC pin to Arduino 5V&#10;Step 3: Upload the code to Arduino..."
                    value={formData.steps}
                    onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="working" className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Working Principle
                  </Label>
                  <Textarea
                    id="working"
                    placeholder="Explain how the project works, the logic behind it, and any important technical details..."
                    value={formData.working}
                    onChange={(e) => setFormData({ ...formData, working: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="references" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    References & Links (one per line)
                  </Label>
                  <Textarea
                    id="references"
                    placeholder="https://arduino.cc/en/guide/introduction&#10;https://learn.sparkfun.com/tutorials..."
                    value={formData.references}
                    onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              {/* IoT Settings Tab */}
              <TabsContent value="iot" className="space-y-4 py-4">
                {formData.type === 'IOT' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="code" className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Arduino / ESP32 Code
                      </Label>
                      <Textarea
                        id="code"
                        placeholder="// Paste your complete Arduino code here&#10;#include &lt;WiFi.h&gt;&#10;#include &lt;DHT.h&gt;&#10;&#10;void setup() {&#10;  // Your setup code&#10;}&#10;&#10;void loop() {&#10;  // Your loop code&#10;}"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        rows={10}
                        className="font-mono text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fieldLabels" className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Channel Field Labels (comma separated)
                      </Label>
                      <Input
                        id="fieldLabels"
                        placeholder="Temperature, Humidity, Pressure, Light..."
                        value={formData.fieldLabels}
                        onChange={(e) => setFormData({ ...formData, fieldLabels: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        These labels will be used when auto-creating a channel for users. Up to 8 fields supported.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Cpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Switch to &quot;IoT Project&quot; type in Basic Info tab to configure IoT settings</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Publish Tab */}
              <TabsContent value="publish" className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Feature this project on homepage</Label>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Project Summary</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Title: {formData.title || 'Not set'}</li>
                    <li>• Type: {formData.type}</li>
                    <li>• Difficulty: {formData.difficulty}</li>
                    <li>• Components: {formData.components ? formData.components.split('\n').filter(Boolean).length : 0} items</li>
                    <li>• Steps: {formData.steps ? formData.steps.split('\n').filter(Boolean).length : 0} steps</li>
                    {formData.type === 'IOT' && (
                      <li>• Fields: {formData.fieldLabels ? formData.fieldLabels.split(',').filter(Boolean).length : 0} data fields</li>
                    )}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={createProject} 
                disabled={isCreating || !formData.title || !formData.description}
              >
                {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(null).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Add your first IoT project to the library
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="pb-3">
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base line-clamp-1">{project.title}</CardTitle>
                  <div className="flex gap-1">
                    {!project.isPublished && (
                      <Badge variant="destructive" className="text-xs shrink-0">Draft</Badge>
                    )}
                    {project.featured && (
                      <Badge variant="default" className="text-xs shrink-0 bg-yellow-500">Featured</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {project.category && (
                    <Badge variant="secondary" className="text-xs">
                      {project.category}
                    </Badge>
                  )}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${project.type === 'IOT' ? 'border-blue-500 text-blue-600' : 'border-green-500 text-green-600'}`}
                  >
                    {project.type === 'IOT' ? <Zap className="w-3 h-3 mr-1" /> : <Cpu className="w-3 h-3 mr-1" />}
                    {project.type}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      project.difficulty === 'BEGINNER' ? 'text-green-600' : 
                      project.difficulty === 'INTERMEDIATE' ? 'text-yellow-600' : 'text-red-600'
                    }`}
                  >
                    {project.difficulty}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 text-xs mt-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <a href={project.driveLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteProject(project.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <Card className="bg-muted">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{projects.length} projects</span>
            {' • '}
            Published: <span className="font-semibold text-foreground">{projects.filter(p => p.isPublished).length}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
