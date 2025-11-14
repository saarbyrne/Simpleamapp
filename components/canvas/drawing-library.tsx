'use client'

import { useState, useEffect } from 'react'
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
  updatedAt: Date
}

export function DrawingLibrary() {
  const router = useRouter()
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [drawingToDelete, setDrawingToDelete] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const pageSize = 50

  useEffect(() => {
    loadDrawings()
  }, [typeFilter, page, searchQuery])

  const loadDrawings = async () => {
    setLoading(true)
    try {
      const filters: any = {
        page,
        pageSize,
      }

      if (typeFilter !== 'all') {
        filters.type = typeFilter
      }

      if (searchQuery) {
        filters.search = searchQuery
      }

      const result = await getDrawings(filters)
      if (result.success && result.drawings) {
        setDrawings(result.drawings as any)
        setTotal(result.total || 0)
        setHasMore(result.hasMore || false)
      } else {
        toast.error(result.error || 'Failed to load drawings')
      }
    } catch (error) {
      console.error('Error loading drawings:', error)
      toast.error('Failed to load drawings')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!drawingToDelete) return

    try {
      const result = await deleteDrawing(drawingToDelete)
      if (result.success) {
        toast.success('Drawing deleted successfully')
        loadDrawings()
      } else {
        toast.error(result.error || 'Failed to delete drawing')
      }
    } catch (error) {
      console.error('Error deleting drawing:', error)
      toast.error('Failed to delete drawing')
    } finally {
      setDeleteDialogOpen(false)
      setDrawingToDelete(null)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const result = await duplicateDrawing(id)
      if (result.success && result.drawing) {
        toast.success('Drawing duplicated successfully')
        loadDrawings()
      } else {
        toast.error(result.error || 'Failed to duplicate drawing')
      }
    } catch (error) {
      console.error('Error duplicating drawing:', error)
      toast.error('Failed to duplicate drawing')
    }
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drawings..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1) // Reset to first page on search
              }}
              className="pl-9"
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
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Drawing
        </Button>
      </div>

      {/* Drawing grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
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
            <Plus className="h-4 w-4 mr-2" />
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
              <div className="aspect-video bg-muted flex items-center justify-center">
                {drawing.thumbnailUrl ? (
                  <img
                    src={drawing.thumbnailUrl}
                    alt={drawing.name}
                    className="w-full h-full object-cover"
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
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicate(drawing.id)
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setDrawingToDelete(drawing.id)
                          setDeleteDialogOpen(true)
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
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

          {/* Pagination */}
          {total > pageSize && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min((page - 1) * pageSize + 1, total)} to{' '}
                {Math.min(page * pageSize, total)} of {total} drawings
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasMore || loading}
                >
                  Next
                </Button>
              </div>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the drawing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
