'use client'

import { cn } from '@/components/ui/utils'

type PageFrameProps = {
  children: React.ReactNode
  className?: string
  /**
   * Padding size. Defaults to 'default' (p-4).
   * Use 'none' to remove padding, 'sm' for p-2, 'lg' for p-6, 'xl' for p-8
   */
  padding?: 'none' | 'sm' | 'default' | 'lg' | 'xl'
  /**
   * Gap between children. Defaults to 'default' (gap-4).
   * Use 'none' to remove gap, 'sm' for gap-2, 'lg' for gap-6, 'xl' for gap-8
   */
  gap?: 'none' | 'sm' | 'default' | 'lg' | 'xl'
}

const paddingMap = {
  none: '',
  sm: 'p-2',
  default: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
}

const gapMap = {
  none: '',
  sm: 'gap-2',
  default: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

/**
 * PageFrame - A reusable component that wraps page content with consistent spacing.
 * 
 * This component provides a standard content wrapper with padding and gap spacing.
 * It's designed to be used within the DashboardLayoutClient which already provides
 * the sidebar navigation and breadcrumb header.
 * 
 * @example
 * ```tsx
 * // Default usage with standard padding and gap
 * <PageFrame>
 *   <YourPageContent />
 * </PageFrame>
 * 
 * // Custom padding and gap
 * <PageFrame padding="lg" gap="lg">
 *   <YourPageContent />
 * </PageFrame>
 * 
 * // No padding (useful for full-width content)
 * <PageFrame padding="none">
 *   <YourPageContent />
 * </PageFrame>
 * ```
 */
export function PageFrame({
  children,
  className,
  padding = 'default',
  gap = 'default',
}: PageFrameProps) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col bg-background overflow-y-auto overflow-x-hidden',
        paddingMap[padding],
        gapMap[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

