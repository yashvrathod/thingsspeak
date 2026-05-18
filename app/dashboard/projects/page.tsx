'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FolderOpen, ExternalLink, Tag, Search, Loader2, FileText, ImageIcon, Sparkles, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string | null
  driveLink: string
  tags: string[]
  category: string | null
  createdAt: string
  user: {
    name: string | null
  }
}

const gradients = [
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-orange-500 to-amber-500',
  'from-emerald-500 to-green-500',
  'from-sky-500 to-blue-500',
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
    fetchCategories()
  }, [])

  const fetchProjects = async (category?: string) => {
    try {
      setIsLoading(true)
      const url = new URL('/api/projects', window.location.origin)
      if (category) url.searchParams.set('category', category)
      
      const response = await fetch(url)
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/projects/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = !selectedCategory || project.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects Library</h1>
        <p className="text-muted-foreground mt-1">
          Explore ready-made IoT projects and templates
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={cn("rounded-full", selectedCategory === null && "bg-gradient-to-r from-violet-600 to-indigo-600")}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.name}
              variant={selectedCategory === cat.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.name)}
              className={cn("rounded-full", selectedCategory === cat.name && "bg-gradient-to-r from-violet-600 to-indigo-600")}
            >
              {cat.name}
              <Badge variant="secondary" className="ml-2 text-xs rounded-full">
                {cat.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(null).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="border-border/50 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-violet-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">No projects found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Try adjusting your search or filter to find what you&apos;re looking for
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <Card key={project.id} className="group flex flex-col border-border/50 hover:border-violet-500/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden">
              <div className={cn("h-2 bg-gradient-to-r", gradients[index % gradients.length])} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg font-bold line-clamp-2">{project.title}</CardTitle>
                  {project.category && (
                    <Badge variant="secondary" className="text-xs shrink-0 rounded-full">
                      {project.category}
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-3 text-sm">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs rounded-full bg-muted/30">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs rounded-full">
                      +{project.tags.length - 4}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2">
                  <Button asChild className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                    <Link href={project.driveLink} target="_blank" rel="noopener noreferrer">
                      <FileText className="w-4 h-4 mr-2" />
                      View Project
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Uploaded by {project.user?.name || 'Admin'} &middot; {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
