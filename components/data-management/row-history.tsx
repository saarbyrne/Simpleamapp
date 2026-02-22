'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Clock,
  RotateCcw,
  FileEdit,
  FilePlus,
  FileX,
  ChevronRight,
  User,
} from 'lucide-react'
import { getRowHistory, restoreRowToVersion } from '@/app/actions/data-management'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface RowHistoryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spreadsheetId: string
  rowId: string
  rowName?: string
}

interface HistoryEntry {
  id: string
  action: string
  timestamp: Date
  user: {
    id: string
    name: string | null
    email: string
  }
  previousData: any
  newData: any
  changedFields: string[]
}

export function RowHistory({
  open,
  onOpenChange,
  spreadsheetId,
  rowId,
  rowName = 'Row'
}: RowHistoryProps) {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      loadHistory()
    }
  }, [open, spreadsheetId, rowId])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const result = await getRowHistory(spreadsheetId, rowId)
      if (result.error) {
        toast.error(result.error)
      } else {
        setHistory(result.data || [])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async (changeLogId: string, timestamp: Date) => {
    if (!confirm(`Restore this row to its state at ${format(timestamp, 'PPp')}?`)) {
      return
    }

    setIsRestoring(true)
    try {
      const result = await restoreRowToVersion(spreadsheetId, rowId, changeLogId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Row restored successfully')
        onOpenChange(false)
        router.refresh()
      }
    } finally {
      setIsRestoring(false)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <FilePlus className="h-4 w-4" />
      case 'update':
        return <FileEdit className="h-4 w-4" />
      case 'delete':
        return <FileX className="h-4 w-4" />
      case 'restore':
        return <RotateCcw className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case 'update':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
      case 'delete':
        return 'bg-red-500/10 text-red-700 dark:text-red-400'
      case 'restore':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    }
  }

  const getActionLabel = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1)
  }

  const renderFieldDiff = (entry: HistoryEntry) => {
    if (entry.action === 'create') {
      return (
        <div className="mt-2 space-y-1">
          <div className="text-sm font-medium">Created with:</div>
          {Object.entries(entry.newData || {}).map(([key, value]) => (
            <div key={key} className="text-sm ps-4">
              <span className="font-medium">{key}:</span>{' '}
              <span className="text-green-600 dark:text-green-400">
                {JSON.stringify(value)}
              </span>
            </div>
          ))}
        </div>
      )
    }

    if (entry.action === 'delete') {
      return (
        <div className="mt-2 text-sm text-muted-foreground">
          Row was deleted
        </div>
      )
    }

    if (entry.changedFields.length === 0) {
      return null
    }

    return (
      <div className="mt-2 space-y-1">
        <div className="text-sm font-medium">Changed fields:</div>
        {entry.changedFields.map((field) => {
          const oldValue = entry.previousData?.[field]
          const newValue = entry.newData?.[field]
          return (
            <div key={field} className="text-sm ps-4">
              <span className="font-medium">{field}:</span>{' '}
              <span className="text-red-600 dark:text-red-400 line-through">
                {JSON.stringify(oldValue)}
              </span>
              {' → '}
              <span className="text-green-600 dark:text-green-400">
                {JSON.stringify(newValue)}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            History: {rowName}
          </DialogTitle>
          <DialogDescription>
            View all changes made to this row over time
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading history...</div>
          </div>
        ) : history.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <div className="text-muted-foreground">No history available</div>
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 pe-4">
            <div className="space-y-3">
              {history.map((entry, index) => {
                const isExpanded = expandedEntry === entry.id
                const isLatest = index === 0

                return (
                  <Card
                    key={entry.id}
                    className={`p-4 ${isLatest ? 'border-primary' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`mt-0.5 p-2 rounded-lg ${getActionColor(
                            entry.action
                          )}`}
                        >
                          {getActionIcon(entry.action)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge variant={isLatest ? 'default' : 'secondary'}>
                              {getActionLabel(entry.action)}
                            </Badge>
                            {isLatest && (
                              <Badge variant="outline" className="text-xs">
                                Current
                              </Badge>
                            )}
                            {entry.changedFields.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {entry.changedFields.length} field
                                {entry.changedFields.length !== 1 ? 's' : ''}{' '}
                                changed
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <User className="h-3 w-3" />
                            <span>{entry.user.name || entry.user.email}</span>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(entry.timestamp), 'PPp')}</span>
                          </div>

                          {isExpanded && renderFieldDiff(entry)}
                        </div>
                      </div>

                      <div className="flex gap-2 ms-2">
                        {entry.changedFields.length > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setExpandedEntry(isExpanded ? null : entry.id)
                            }
                          >
                            <ChevronRight
                              className={`h-4 w-4 transition-transform ${
                                isExpanded ? 'rotate-90' : ''
                              }`}
                            />
                          </Button>
                        )}
                        {!isLatest && entry.action !== 'delete' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleRestore(entry.id, entry.timestamp)
                            }
                            disabled={isRestoring}
                          >
                            <RotateCcw className="h-3 w-3 me-1" />
                            Restore
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
