'use client'

import { memo, useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
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
import { GlobalSearch, SearchTrigger, useSearchShortcut } from '@/components/global-search'

// Lazy-load dialog components — only loaded when their respective dialogs are opened
const AddPlayerDialog = dynamic(() => import('@/components/dashboard/add-player-dialog').then(m => ({ default: m.AddPlayerDialog })), { ssr: false })
const EventFormDialog = dynamic(() => import('@/components/calendar/event-form-dialog').then(m => ({ default: m.EventFormDialog })), { ssr: false })
const FormBuilderDialog = dynamic(() => import('@/components/dashboard/form-builder-dialog').then(m => ({ default: m.FormBuilderDialog })), { ssr: false })
const NoteEditorDialog = dynamic(() => import('@/components/notes/note-editor-dialog').then(m => ({ default: m.NoteEditorDialog })), { ssr: false })

type DashboardLayoutClientProps = {
  userName: string
  userEmail: string | null
  userAvatar?: string | null
  organizationName?: string | null
  organizationLogo?: string | null
  enabledFeatures?: string[]
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
  organizationName,
  organizationLogo,
  enabledFeatures,
  children,
  disablePageFrame = false,
}: DashboardLayoutClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Auto-disable page frame for canvas pages to allow full height usage
  const shouldDisablePageFrame = disablePageFrame || pathname?.includes('/canvas/')

  // Enable keyboard shortcut for search (/ or Cmd/Ctrl+K)
  useSearchShortcut(() => setIsSearchOpen(true))

  const quickActionHandlers = useMemo(() => ({
    'add-player': () => setIsAddPlayerOpen(true),
    'add-event': () => setIsAddEventOpen(true),
    'add-form': () => setIsAddFormOpen(true),
    'add-note': () => setIsAddNoteOpen(true),
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
        <AppSidebar
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
          organizationName={organizationName}
          organizationLogo={organizationLogo}
          enabledFeatures={enabledFeatures}
        />
        <SidebarInset className="flex flex-col">
          <div className="sticky top-0 z-50 shrink-0 w-full overflow-x-hidden bg-nav-background">
            <header className="flex h-16 items-center gap-2 border-b px-4 bg-nav-background">
              <SidebarTrigger className="-ms-1 shrink-0 text-foreground hover:bg-accent" />
              <Separator orientation="vertical" className="me-2 h-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <DashboardBreadcrumb />
              </div>
              <div className="hidden md:block shrink-0 mx-2">
                <SearchTrigger onClick={() => setIsSearchOpen(true)} />
              </div>
              <QuickActionsToolbar
                actionHandlers={quickActionHandlers}
                className="ms-auto shrink-0"
              />
            </header>
          </div>
          {shouldDisablePageFrame ? (
            <div className="flex flex-1 flex-col bg-page-background overflow-y-auto overflow-x-hidden">
              {children}
            </div>
          ) : (
            <PageFrame>{children}</PageFrame>
          )}
        </SidebarInset>

        {/* Quick Action Dialogs — lazy-loaded, only mounted when opened */}
        {isAddPlayerOpen && (
          <AddPlayerDialog
            open={isAddPlayerOpen}
            onOpenChange={setIsAddPlayerOpen}
          />
        )}
        {isAddEventOpen && (
          <EventFormDialog
            open={isAddEventOpen}
            onOpenChange={setIsAddEventOpen}
            onSuccess={handleEventFormSuccess}
          />
        )}
        {isAddFormOpen && (
          <FormBuilderDialog
            open={isAddFormOpen}
            onOpenChange={setIsAddFormOpen}
            onSuccess={handleFormBuilderSuccess}
          />
        )}
        {isAddNoteOpen && (
          <NoteEditorDialog
            open={isAddNoteOpen}
            onOpenChange={setIsAddNoteOpen}
            onSuccess={() => {
              setIsAddNoteOpen(false)
              router.refresh()
            }}
          />
        )}
        <GlobalSearch
          open={isSearchOpen}
          onOpenChange={setIsSearchOpen}
        />
      </SidebarProvider>
    </BreadcrumbProvider>
  )
})
