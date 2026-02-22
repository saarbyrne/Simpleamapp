'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  restoreSpreadsheet,
  permanentlyDelete,
} from '@/app/actions/data-management'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConfirmationDialog } from '@/components/data-management/confirmation-dialog'
import { Trash2, RotateCcw, FileSpreadsheet, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TrashItem {
  id: string
  entityType: string
  entityId: string
  entityName: string
  parentName?: string | null
  deletedAt: Date
  expiresAt: Date
  deletedByUser: {
    id: string
    name: string | null
    email: string
    avatar: string | null
  }
}

interface TrashClientProps {
  items: TrashItem[]
}

export function TrashClient({ items: initialItems }: TrashClientProps) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null)
  const [action, setAction] = useState<'restore' | 'delete' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRestore = async (item: TrashItem) => {
    setIsLoading(true)
    try {
      if (item.entityType === 'spreadsheet') {
        const result = await restoreSpreadsheet(item.entityId)
        if (result.error) {
          alert(result.error)
        } else {
          setItems(items.filter((i) => i.id !== item.id))
          router.refresh()
        }
      }
    } finally {
      setIsLoading(false)
      setSelectedItem(null)
      setAction(null)
    }
  }

  const handlePermanentDelete = async (item: TrashItem) => {
    setIsLoading(true)
    try {
      const result = await permanentlyDelete(item.id)
      if (result.error) {
        alert(result.error)
      } else {
        setItems(items.filter((i) => i.id !== item.id))
        router.refresh()
      }
    } finally {
      setIsLoading(false)
      setSelectedItem(null)
      setAction(null)
    }
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'spreadsheet':
        return <FileSpreadsheet className="h-4 w-4" />
      default:
        return null
    }
  }

  const getEntityTypeName = (type: string) => {
    switch (type) {
      case 'spreadsheet':
        return 'Spreadsheet'
      case 'spreadsheet_row':
        return 'Row'
      default:
        return type
    }
  }

  const getDaysUntilExpiry = (expiresAt: Date) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Trash2 className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Trash is empty</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Deleted items will appear here and be permanently removed after 30 days.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Trash</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {items.length} item{items.length !== 1 ? 's' : ''} in trash
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {items.map((item) => {
            const daysLeft = getDaysUntilExpiry(item.expiresAt)
            const isExpiringSoon = daysLeft <= 7

            return (
              <Card key={item.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getEntityIcon(item.entityType)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">
                          {item.entityName}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {getEntityTypeName(item.entityType)}
                        </Badge>
                        {isExpiringSoon && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 me-1" />
                            {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                          </Badge>
                        )}
                      </div>

                      {item.parentName && (
                        <p className="text-sm text-muted-foreground mt-1">
                          From: {item.parentName}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                        <span>
                          Deleted {format(new Date(item.deletedAt), 'PPp')}
                        </span>
                        <span>by {item.deletedByUser.name || item.deletedByUser.email}</span>
                        <span>
                          Expires {format(new Date(item.expiresAt), 'PP')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedItem(item)
                        setAction('restore')
                      }}
                    >
                      <RotateCcw className="h-4 w-4 me-1" />
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedItem(item)
                        setAction('delete')
                      }}
                    >
                      <Trash2 className="h-4 w-4 me-1" />
                      Delete Forever
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Restore Confirmation */}
      {selectedItem && action === 'restore' && (
        <ConfirmationDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedItem(null)
              setAction(null)
            }
          }}
          title="Restore item?"
          description={`Are you sure you want to restore "${selectedItem.entityName}"? It will be moved back to its original location.`}
          confirmLabel="Restore"
          onConfirm={() => handleRestore(selectedItem)}
          isLoading={isLoading}
        />
      )}

      {/* Permanent Delete Confirmation */}
      {selectedItem && action === 'delete' && (
        <ConfirmationDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedItem(null)
              setAction(null)
            }
          }}
          title="Permanently delete?"
          description={`This will permanently delete "${selectedItem.entityName}". This action cannot be undone.`}
          confirmLabel="Delete Forever"
          confirmVariant="destructive"
          requireTypedConfirmation="delete forever"
          onConfirm={() => handlePermanentDelete(selectedItem)}
          isLoading={isLoading}
        />
      )}
    </>
  )
}
