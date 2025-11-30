'use client'

import { SpreadsheetData } from '@/lib/types/spreadsheet'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FileSpreadsheet,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Clock,
  Star,
  FolderInput,
  Users,
  Eye,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

type SpreadsheetCardProps = {
  spreadsheet: SpreadsheetData
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate?: (id: string) => void
  onToggleStar?: (id: string, starred: boolean) => void
  onMove?: (id: string) => void
  viewMode?: 'grid' | 'list'
}

export function SpreadsheetCard({
  spreadsheet,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStar,
  onMove,
  viewMode = 'grid',
}: SpreadsheetCardProps) {
  if (viewMode === 'list') {
    return (
      <div
        className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md hover:border-primary transition-all cursor-pointer group"
        onClick={() => onEdit(spreadsheet.id)}
      >
        <FileSpreadsheet className="h-8 w-8 text-muted-foreground shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{spreadsheet.name}</h3>
            {spreadsheet.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />}
            {spreadsheet.version > 1 && (
              <Badge variant="outline" className="text-xs shrink-0">
                v{spreadsheet.version}
              </Badge>
            )}
          </div>

          {spreadsheet.description && (
            <p className="text-sm text-muted-foreground truncate">{spreadsheet.description}</p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>{spreadsheet.schema?.length || 0} columns</span>
            <span>{spreadsheet.data?.length || 0} rows</span>
            {spreadsheet.sharedWith?.length > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {spreadsheet.sharedWith.length}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(new Date(spreadsheet.updatedAt), 'MMM d, yyyy')}
            </span>
          </div>

          {spreadsheet.tags && spreadsheet.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {spreadsheet.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              onEdit(spreadsheet.id)
            }}>
              <Edit className="h-4 w-4 me-2" />
              Edit
            </DropdownMenuItem>
            {onToggleStar && (
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onToggleStar(spreadsheet.id, !spreadsheet.starred)
              }}>
                <Star className={cn("h-4 w-4 me-2", spreadsheet.starred && "fill-yellow-400 text-yellow-400")} />
                {spreadsheet.starred ? 'Unstar' : 'Star'}
              </DropdownMenuItem>
            )}
            {onMove && (
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onMove(spreadsheet.id)
              }}>
                <FolderInput className="h-4 w-4 me-2" />
                Move to folder
              </DropdownMenuItem>
            )}
            {onDuplicate && (
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onDuplicate(spreadsheet.id)
              }}>
                <Copy className="h-4 w-4 me-2" />
                Duplicate
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(spreadsheet.id)
              }}
            >
              <Trash2 className="h-4 w-4 me-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary group"
      onClick={() => onEdit(spreadsheet.id)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
          <div className="flex items-center gap-1">
            {onToggleStar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleStar(spreadsheet.id, !spreadsheet.starred)
                }}
                className="h-8 w-8 p-0"
              >
                <Star className={cn("h-4 w-4", spreadsheet.starred && "fill-yellow-400 text-yellow-400")} />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  onEdit(spreadsheet.id)
                }}>
                  <Edit className="h-4 w-4 me-2" />
                  Edit
                </DropdownMenuItem>
                {onMove && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    onMove(spreadsheet.id)
                  }}>
                    <FolderInput className="h-4 w-4 me-2" />
                    Move to folder
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(spreadsheet.id)
                  }}>
                    <Copy className="h-4 w-4 me-2" />
                    Duplicate
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(spreadsheet.id)
                  }}
                >
                  <Trash2 className="h-4 w-4 me-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardTitle className="text-lg mt-2 line-clamp-1">{spreadsheet.name}</CardTitle>
        {spreadsheet.description && (
          <CardDescription className="line-clamp-2">
            {spreadsheet.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {spreadsheet.tags && spreadsheet.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-3">
            {spreadsheet.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {spreadsheet.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{spreadsheet.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
          <span>{spreadsheet.schema?.length || 0} columns</span>
          <span>{spreadsheet.data?.length || 0} rows</span>
          {spreadsheet.version > 1 && (
            <Badge variant="outline" className="text-xs">
              v{spreadsheet.version}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3 w-3 me-1" />
            {format(new Date(spreadsheet.updatedAt), 'MMM d, yyyy')}
          </div>
          {spreadsheet.sharedWith && spreadsheet.sharedWith.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {spreadsheet.sharedWith.length} shared
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
