'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Info } from 'lucide-react'
import type { ImpactSummary } from '@/lib/data-management'

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  impact?: ImpactSummary
  confirmLabel?: string
  confirmVariant?: 'default' | 'destructive'
  requireTypedConfirmation?: string // User must type this to confirm
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  impact,
  confirmLabel = 'Confirm',
  confirmVariant = 'default',
  requireTypedConfirmation,
  onConfirm,
  isLoading = false,
}: ConfirmationDialogProps) {
  const [typedConfirmation, setTypedConfirmation] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      await onConfirm()
      onOpenChange(false)
      setTypedConfirmation('')
    } finally {
      setIsConfirming(false)
    }
  }

  const confirmationMatches =
    !requireTypedConfirmation ||
    typedConfirmation.toLowerCase().trim() ===
      requireTypedConfirmation.toLowerCase().trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {confirmVariant === 'destructive' && (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {impact && (
          <div className="space-y-3">
            {/* Impact Summary */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-semibold">Impact</div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {impact.affectedRows !== undefined && (
                      <li>
                        {impact.affectedRows.toLocaleString()} row
                        {impact.affectedRows !== 1 ? 's' : ''} will be affected
                      </li>
                    )}
                    {impact.affectedSpreadsheets !== undefined && (
                      <li>
                        {impact.affectedSpreadsheets.toLocaleString()}{' '}
                        spreadsheet{impact.affectedSpreadsheets !== 1 ? 's' : ''}
                      </li>
                    )}
                    {impact.affectedPlayers !== undefined && (
                      <li>
                        {impact.affectedPlayers.toLocaleString()} player
                        {impact.affectedPlayers !== 1 ? 's' : ''}
                      </li>
                    )}
                    {impact.relatedEntities?.map((entity) => (
                      <li key={entity.type}>
                        {entity.count} {entity.type}
                        {entity.names && entity.names.length > 0 && (
                          <span className="text-muted-foreground">
                            {' '}
                            ({entity.names.slice(0, 3).join(', ')}
                            {entity.names.length > 3 &&
                              `, +${entity.names.length - 3} more`}
                            )
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            {/* Warnings */}
            {impact.warnings && impact.warnings.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-semibold">Warnings</div>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {impact.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Typed Confirmation */}
        {requireTypedConfirmation && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Type <span className="font-mono">{requireTypedConfirmation}</span>{' '}
              to confirm:
            </label>
            <Input
              value={typedConfirmation}
              onChange={(e) => setTypedConfirmation(e.target.value)}
              placeholder={requireTypedConfirmation}
              autoComplete="off"
              disabled={isConfirming}
            />
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setTypedConfirmation('')
            }}
            disabled={isConfirming || isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={!confirmationMatches || isConfirming || isLoading}
          >
            {isConfirming || isLoading ? 'Processing...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
