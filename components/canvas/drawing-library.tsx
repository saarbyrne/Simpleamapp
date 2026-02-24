'use client'

import { useState, useEffect, useCallback, useMemo, useRef, forwardRef, useImperativeHandle } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Copy,
  Download,
  Trash2,
  Loader2,
} from 'lucide-react'
import { TacticalIcon } from './tactical-icon'
import { getDrawings, deleteDrawing, duplicateDrawing } from '@/app/actions/drawings'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { TemplateSelectorDialog } from './template-selector-dialog'

interface Drawing {
  id: string
  name: string
  description: string | null
  type: string | null
  tags: string[]
  thumbnailUrl: string | null
  createdAt: Date
  updatedAt:   Date
}

// Lazy loading image component using Next.js Image
function LazyImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!isInView) {
    return <div ref={imgRef} className={className} />
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`${className} object-cover`}
      onLoad={() => setIsLoaded(true)}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    />
  )
}

export interface DrawingLibraryHandle {
  openCreateDialog: () => void
}

export const DrawingLibrary = forwardRef<DrawingLibraryHandle>((props, ref) => {
  const router = useRouter()
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [drawingToDelete, setDrawingToDelete] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const pageSize = 20 // Match server default

  // Expose method to open create dialog
  useImperativeHandle(ref, () => ({
    openCreateDialog: () => setShowCreateDialog(true),
  }))

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadDrawings = useCallback(async (append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true)
    } else {
      setLoading(true)
      setPage(1) // Reset to first page when doing fresh load
    }

    try {
      const filters: any = {
        page: append ? page : 1,
        pageSize,
      }

      if (typeFilter !== 'all') {
        filters.type = typeFilter
      }

      if (debouncedSearchQuery) {
        filters.search = debouncedSearchQuery
      }

      const result = await getDrawings(filters)
      if ('error' in result) {
        toast.error(result.error || 'Failed to load drawings')
      } else if (result.drawings) {
        if (append) {
          setDrawings(prev => [...prev, ...(result.drawings as any)])
        } else {
          setDrawings(result.drawings as any)
        }
        setTotal(result.total || 0)
        setHasMore(result.hasMore || false)
      }
    } catch (error) {
      console.error('Error loading drawings:', error)
      toast.error('Failed to load drawings')
    } finally {
      setLoading(false)
      setIsLoadingMore(false)
    }
  }, [page, pageSize, typeFilter, debouncedSearchQuery])

  const handleDelete = async () => {
    if (!drawingToDelete) return

    // Optimistically remove the drawing from local state
    const drawingToRemove = drawings.find(d => d.id === drawingToDelete)
    if (drawingToRemove) {
      setDrawings(prev => prev.filter(d => d.id !== drawingToDelete))
      setTotal(prev => prev - 1)
    }

    try {
      const result = await deleteDrawing(drawingToDelete)
      if (result.success) {
        toast.success('Drawing deleted successfully')
        // Drawing already removed from state, no need to reload
      } else {
        // Revert optimistic update on failure
        if (drawingToRemove) {
          setDrawings(prev => {
            const newDrawings = [...prev, drawingToRemove]
            // Sort by updatedAt desc to maintain order
            return newDrawings.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          })
          setTotal(prev => prev + 1)
        }
        toast.error(result.error || 'Failed to delete drawing')
      }
    } catch (error) {
      console.error('Error deleting drawing:', error)
      // Revert optimistic update on failure
      if (drawingToRemove) {
        setDrawings(prev => {
          const newDrawings = [...prev, drawingToRemove]
          // Sort by updatedAt desc to maintain order
          return newDrawings.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        })
        setTotal(prev => prev + 1)
      }
      toast.error('Failed to delete drawing')
    } finally {
      setDeleteDialogOpen(false)
      setDrawingToDelete(null)
    }
  }

  const handleDuplicate = async (id: string) => {
    const originalDrawing = drawings.find(d => d.id === id)
    if (!originalDrawing) return

    // Create optimistic duplicate with temporary ID
    const optimisticDuplicate: Drawing = {
      ...originalDrawing,
      id: `temp-${Date.now()}`, // Temporary ID
      name: `${originalDrawing.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Optimistically add to local state at the top
    setDrawings(prev => [optimisticDuplicate, ...prev])
    setTotal(prev => prev + 1)

    try {
      const result = await duplicateDrawing(id)
      if (result.success && result.drawing) {
        toast.success('Drawing duplicated successfully')
        // Replace optimistic drawing with real one
        setDrawings(prev => prev.map(d =>
          d.id === optimisticDuplicate.id ? {
            ...result.drawing,
            createdAt: new Date(result.drawing.createdAt),
            updatedAt: new Date(result.drawing.updatedAt),
          } : d
        ))
      } else {
        // Revert optimistic update on failure
        setDrawings(prev => prev.filter(d => d.id !== optimisticDuplicate.id))
        setTotal(prev => prev - 1)
        toast.error(result.error || 'Failed to duplicate drawing')
      }
    } catch (error) {
      console.error('Error duplicating drawing:', error)
      // Revert optimistic update on failure
      setDrawings(prev => prev.filter(d => d.id !== optimisticDuplicate.id))
      setTotal(prev => prev - 1)
      toast.error('Failed to duplicate drawing')
    }
  }

  // Load drawings when filters change
  useEffect(() => {
    loadDrawings(false)
  }, [typeFilter, debouncedSearchQuery, loadDrawings])

  // Infinite scroll handler
  const loadMoreDrawings = useCallback(() => {
    if (hasMore && !isLoadingMore && !loading) {
      setPage(prev => prev + 1)
      loadDrawings(true)
    }
  }, [hasMore, isLoadingMore, loading, loadDrawings])

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || isLoadingMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreDrawings()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    const sentinel = document.getElementById('infinite-scroll-sentinel')
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, loading, loadMoreDrawings])

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm flex items-center border border-input rounded-md px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50 h-10 bg-background">
            <Search className="h-4 w-4 text-muted-foreground me-2 flex-shrink-0" />
            <Input
              placeholder="Search drawings..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                // Page will be reset by the debounced effect
              }}
              className="border-0 shadow-none focus-visible:ring-0 px-0 py-0 h-full"
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value)
              setPage(1) // Reset to first page on filter change
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="formation">Formations</SelectItem>
              <SelectItem value="drill">Drills</SelectItem>
              <SelectItem value="tactics">Tactics</SelectItem>
              <SelectItem value="set_piece">Set Pieces</SelectItem>
              <SelectItem value="session_plan">Session Plans</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Drawing grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Card key={`skeleton-${i}`} className="overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-3 bg-muted animate-pulse rounded w-full mb-2" />
                <div className="flex gap-2">
                  <div className="h-5 bg-muted animate-pulse rounded w-16" />
                  <div className="h-5 bg-muted animate-pulse rounded w-12" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="h-3 bg-muted animate-pulse rounded w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : drawings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <TacticalIcon className="h-12 w-12 text-muted-foreground mb-4" size={48} />
          <h3 className="text-lg font-semibold mb-2">No drawings found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? 'Try adjusting your search'
              : 'Create your first tactical drawing'}
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 me-2" />
            Create Drawing
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {drawings.map((drawing) => (
            <Card
              key={drawing.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/canvas/${drawing.id}`)}
            >
              <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
                {drawing.thumbnailUrl ? (
                  <LazyImage
                    src={drawing.thumbnailUrl}
                    alt={drawing.name}
                    className="transition-opacity duration-300"
                  />
                ) : (
                  <TacticalIcon className="h-12 w-12 text-muted-foreground" size={48} />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {drawing.name}
                  </h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/dashboard/canvas/${drawing.id}`)
                        }}
                      >
                        <Edit className="h-4 w-4 me-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicate(drawing.id)
                        }}
                      >
                        <Copy className="h-4 w-4 me-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setDrawingToDelete(drawing.id)
                          setDeleteDialogOpen(true)
                        }}
                        className="bg-destructive text-white focus:bg-destructive focus:text-white hover:bg-destructive hover:text-white"
                        aria-label={`Delete drawing "${drawing.name}"`}
                        role="menuitem"
                      >
                        <Trash2 className="h-4 w-4 me-2" aria-hidden="true" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {drawing.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {drawing.description}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {drawing.type && (
                    <Badge variant="secondary" className="text-xs">
                      {drawing.type}
                    </Badge>
                  )}
                  {drawing.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                Updated {formatDistanceToNow(new Date(drawing.updatedAt))} ago
              </CardFooter>
            </Card>
            ))}
          </div>

          {/* Infinite scroll sentinel and loading indicator */}
          {hasMore && (
            <div id="infinite-scroll-sentinel" className="flex justify-center py-8">
              {isLoadingMore ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading more drawings...
                </div>
              ) : (
                <div className="h-4" /> // Invisible sentinel element
              )}
            </div>
          )}

          {/* Footer stats */}
          {!loading && drawings.length > 0 && (
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              Showing {drawings.length} of {total} drawings
              {!hasMore && total > pageSize && (
                <span className="block text-xs mt-1">All drawings loaded</span>
              )}
            </div>
          )}
        </>
      )}

      {/* Create drawing dialog */}
      {showCreateDialog && (
        <TemplateSelectorDialog
          open={showCreateDialog}
          onClose={() => {
            setShowCreateDialog(false)
            loadDrawings()
          }}
        />
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent role="alertdialog" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
          <AlertDialogHeader>
            <AlertDialogTitle id="delete-dialog-title">Delete Drawing</AlertDialogTitle>
            <AlertDialogDescription id="delete-dialog-description">
              This action cannot be undone. This will permanently delete the drawing "{drawings.find(d => d.id === drawingToDelete)?.name}" and all its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel aria-label="Cancel deletion">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white focus:ring-destructive"
              aria-label={`Confirm deletion of drawing "${drawings.find(d => d.id === drawingToDelete)?.name}"`}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
})

DrawingLibrary.displayName = 'DrawingLibrary'
