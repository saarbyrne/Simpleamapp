'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Lazy-loaded TipTap rich text editor
 * Reduces initial bundle size by ~200KB
 * Editor only loads when notes feature is accessed
 */
const RichTextEditor = dynamic(() => import('./rich-text-editor').then(mod => ({ default: mod.RichTextEditor })), {
  loading: () => (
    <div className="border rounded-md p-4 space-y-2">
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  ),
  ssr: false // TipTap requires client-side rendering
})

export { RichTextEditor }
