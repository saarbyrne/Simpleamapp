'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface BulkFeatureActionsProps {
  onEnableAll: () => void
  onDisableAll: () => void
  onReset: () => void
  isLoading?: boolean
}

export function BulkFeatureActions({
  onEnableAll,
  onDisableAll,
  onReset,
  isLoading = false,
}: BulkFeatureActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEnableAll}
        disabled={isLoading}
      >
        <CheckCircle2 className="me-2 h-4 w-4" />
        Enable All
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <XCircle className="me-2 h-4 w-4" />
            Disable All
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable All Features?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disable all features for this organization. Users will not be able to
              access any sections of the platform. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDisableAll}>
              Disable All Features
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        disabled={isLoading}
      >
        <RotateCcw className="me-2 h-4 w-4" />
        Reset to Defaults
      </Button>
    </div>
  )
}

