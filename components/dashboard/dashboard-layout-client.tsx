'use client'

import { memo, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { BreadcrumbProvider, useBreadcrumb } from '@/lib/breadcrumb-context'
import { PageFrame } from '@/components/dashboard/page-frame'
import { QuickActionsToolbar } from '@/components/dashboard/quick-actions-toolbar'
import { AddPlayerDialog } from '@/components/dashboard/add-player-dialog'
import { EventFormDialog } from '@/components/calendar/event-form-dialog'
import { FormBuilderDialog } from '@/components/dashboard/form-builder-dialog'

type DashboardLayoutClientProps = {
  userName: string
  userEmail: string | null
  userAvatar?: string | null
  children: React.ReactNode
  /**
   * Set to true to disable the PageFrame wrapper (no padding/spacing).
   * Useful for pages that need full-width or custom layouts.
   */
  disablePageFrame?: boolean
}

// Map route segments to readable names - now uses translations
const getRouteLabel = (segment: string, t: ReturnType<typeof useTranslations>): string => {
  const translationMap: Record<string, string> = {
    players: t('nav.players'),
    forms: t('nav.forms'),
    reports: t('nav.reports'),
    calendar: t('nav.calendar'),
    notes: t('nav.notes'),
    spreadsheets: t('nav.spreadsheets'),
    canvas: t('nav.canvas'),
    files: t('nav.files'),
    planner: t('nav.planner'),
    'data-management': t('settings.dataManagement'),
    'system-settings': t('settings.systemSettings'),
    profile: t('settings.profile'),
    setup: t('common.setup'),
  }
  return translationMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
}

const DashboardBreadcrumb = memo(function DashboardBreadcrumb() {
  const pathname = usePathname()
  const { customLabels } = useBreadcrumb()
  const t = useTranslations()
  
  // Split pathname into segments and filter out empty strings
  const segments = pathname?.split('/').filter(Boolean) || []
  
  // Filter out 'dashboard' segment and don't show breadcrumb if nothing left
  const filteredSegments = segments.filter(segment => segment !== 'dashboard')
  
  // Don't show breadcrumb if no segments after filtering
  if (filteredSegments.length === 0) {
    return null
  }
  
  // Check if a segment looks like an ID (UUID or long alphanumeric)
  const isIdSegment = (segment: string) => {
    // UUID pattern or long alphanumeric string (likely an ID)
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment) ||
           (segment.length > 20 && /^[a-z0-9-]+$/i.test(segment))
  }
  
    // Get label for a segment, handling IDs
    const getSegmentLabel = (segment: string, index: number, allSegments: string[]) => {
      // Check if there's a custom label for this segment (e.g., event ID)
      if (customLabels[segment]) {
        return customLabels[segment]
      }
      
      // If it's an ID segment, try to infer label from parent
      if (isIdSegment(segment)) {
        const parentSegment = index > 0 ? allSegments[index - 1] : ''
        if (parentSegment === 'events') return 'Event'
        if (parentSegment === 'players') return 'Player'
        return 'Details'
      }
      return getRouteLabel(segment, t)
    }
  
  // Generate breadcrumb items from filtered segments
  // Build hrefs by reconstructing the path with 'dashboard' prefix
  const breadcrumbItems = filteredSegments.map((segment, index) => {
    // Reconstruct path with 'dashboard' prefix for hrefs
    const pathSegments = ['dashboard', ...filteredSegments.slice(0, index + 1)]
    const href = '/' + pathSegments.join('/')
    const label = getSegmentLabel(segment, index, filteredSegments)
    const isLast = index === filteredSegments.length - 1
    
    return {
      href,
      label,
      isLast,
    }
  })
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.flatMap((item, index) => {
          const elements = [
            <BreadcrumbItem key={item.href}>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>,
          ]
          
          if (!item.isLast) {
            elements.push(
              <BreadcrumbSeparator key={`separator-${item.href}`} />
            )
          }
          
          return elements
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
})

export const DashboardLayoutClient = memo(function DashboardLayoutClient({
  userName,
  userEmail,
  userAvatar,
  children,
  disablePageFrame = false,
}: DashboardLayoutClientProps) {
  const router = useRouter()
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  const quickActionHandlers = useMemo(() => ({
    'add-player': () => setIsAddPlayerOpen(true),
    'add-event': () => setIsAddEventOpen(true),
    'add-form': () => setIsAddFormOpen(true),
  }), [])
  
  const handleEventFormSuccess = useCallback(() => {
    // Event created successfully - the EventFormDialog handles the success toast
  }, [])
  
  const handleFormBuilderSuccess = useCallback(() => {
    router.refresh()
  }, [router])

  return (
    <BreadcrumbProvider>
      <SidebarProvider>
        <AppSidebar userName={userName} userEmail={userEmail} userAvatar={userAvatar} />
        <SidebarInset className="flex flex-col">
          <div className="sticky top-0 z-10 shrink-0 w-full overflow-x-hidden bg-background">
            <header className="flex h-16 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ms-1 shrink-0" />
              <Separator orientation="vertical" className="me-2 h-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <DashboardBreadcrumb />
              </div>
              <QuickActionsToolbar
                actionHandlers={quickActionHandlers}
                className="ms-auto shrink-0"
              />
            </header>
          </div>
          {disablePageFrame ? (
            <div className="flex flex-1 flex-col bg-background overflow-y-auto overflow-x-hidden">
              {children}
            </div>
          ) : (
            <PageFrame>{children}</PageFrame>
          )}
        </SidebarInset>

        {/* Quick Action Dialogs */}
        <AddPlayerDialog
          open={isAddPlayerOpen}
          onOpenChange={setIsAddPlayerOpen}
        />
        <EventFormDialog
          open={isAddEventOpen}
          onOpenChange={setIsAddEventOpen}
          onSuccess={handleEventFormSuccess}
        />
        <FormBuilderDialog
          open={isAddFormOpen}
          onOpenChange={setIsAddFormOpen}
          onSuccess={handleFormBuilderSuccess}
        />
      </SidebarProvider>
    </BreadcrumbProvider>
  )
})
