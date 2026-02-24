'use client'

import { useState, useCallback, useRef } from 'react'
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
import { buttonVariants } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === 'destructive' ? buttonVariants({ variant: 'destructive' }) : undefined}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * Hook for imperative confirm dialogs.
 * Returns [ConfirmDialogElement, confirm(opts)] where confirm() returns a Promise<boolean>.
 *
 * Usage:
 * ```tsx
 * const [ConfirmDialogEl, confirm] = useConfirmDialog()
 *
 * async function handleDelete() {
 *   const ok = await confirm({
 *     title: 'Delete item?',
 *     description: 'This action cannot be undone.',
 *   })
 *   if (!ok) return
 *   // proceed with delete
 * }
 *
 * return <>{ConfirmDialogEl}<button onClick={handleDelete}>Delete</button></>
 * ```
 */
export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'default' | 'destructive'
  }>({
    open: false,
    title: '',
    description: '',
  })

  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback(
    (opts: {
      title: string
      description: string
      confirmLabel?: string
      cancelLabel?: string
      variant?: 'default' | 'destructive'
    }): Promise<boolean> => {
      return new Promise((resolve) => {
        resolveRef.current = resolve
        setState({ ...opts, open: true })
      })
    },
    []
  )

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      resolveRef.current?.(false)
      resolveRef.current = null
      setState((prev) => ({ ...prev, open: false }))
    }
  }, [])

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true)
    resolveRef.current = null
    setState((prev) => ({ ...prev, open: false }))
  }, [])

  const element = (
    <ConfirmDialog
      open={state.open}
      onOpenChange={handleOpenChange}
      title={state.title}
      description={state.description}
      confirmLabel={state.confirmLabel}
      cancelLabel={state.cancelLabel}
      variant={state.variant}
      onConfirm={handleConfirm}
    />
  )

  return [element, confirm] as const
}
