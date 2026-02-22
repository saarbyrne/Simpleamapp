'use client'

import { memo, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  BarChart3,
  Calendar,
  CalendarCheck,
  Database,
  FileText,
  Folder,
  MessageSquare,
  PencilRuler,
  Settings,
  Sparkles,
  StickyNote,
  Table,
  Users,
  UserCircle,
  LogOut,
  ChevronsUpDown,
  Layout,
  Wand2,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/app/actions/profile'
import { toast } from 'sonner'
import { FeatureKey, isFeatureReleased } from '@/lib/permissions/feature-metadata'

type AppSidebarProps = {
  userName: string
  userEmail?: string | null
  userAvatar?: string | null
  organizationName?: string | null
  organizationLogo?: string | null
  enabledFeatures?: string[]
}

/**
 * Generate initials from organization name
 * Examples: "Manchester United" -> "MU", "FC Barcelona" -> "FC", "Arsenal" -> "AR"
 */
function getInitials(name: string): string {
  if (!name) return 'CL'
  
  // Split by spaces and filter out common words
  const words = name
    .split(/\s+/)
    .filter(word => {
      const lower = word.toLowerCase()
      // Filter out common prefixes/suffixes
      return !['fc', 'cf', 'ac', 'sc', 'united', 'city', 'town', 'athletic', 'athletics'].includes(lower)
    })
  
  if (words.length === 0) {
    // If all words were filtered, use first 2 characters
    return name.substring(0, 2).toUpperCase()
  }
  
  if (words.length === 1) {
    // Single word: take first 2 letters
    return words[0].substring(0, 2).toUpperCase()
  }
  
  // Multiple words: take first letter of first 2 words
  return (words[0][0] + words[1][0]).toUpperCase()
}

function LogoBadge({ organizationName, organizationLogo }: { organizationName?: string | null, organizationLogo?: string | null }) {
  const displayName = organizationName || 'Club'
  const initials = getInitials(displayName)

  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center"
    >
      {organizationLogo ? (
        <div className="flex h-10 w-10 items-center justify-center">
          <img
            src={organizationLogo}
            alt={displayName}
            className="h-10 w-10 object-contain"
          />
        </div>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold uppercase text-sidebar-primary-foreground">
          {initials}
        </div>
      )}
      <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
        <span className="text-sm font-semibold">{displayName}</span>
        <span className="text-xs text-sidebar-foreground/70">Club</span>
      </div>
    </Link>
  )
}

function AppSidebarComponent({ userName, userEmail, userAvatar, organizationName, organizationLogo, enabledFeatures: enabledFeaturesProp }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations()

  // Features are fetched server-side and passed as props — no client-side fetch needed.
  // Fall back to core features if prop is missing or empty (e.g. DB fetch failed).
  const defaultFeatures = ['players', 'calendar', 'notes', 'forms', 'spreadsheets', 'files', 'reports']
  const enabledFeatures = useMemo(
    () => new Set(enabledFeaturesProp?.length ? enabledFeaturesProp : defaultFeatures),
    [enabledFeaturesProp]
  )

  type NavItem = { labelKey: string; href: string; icon: any; featureKey: FeatureKey }

  // Grouped navigation items
  const navGroups: { label: string; items: NavItem[] }[] = [
    {
      label: 'Team',
      items: [
        { labelKey: 'nav.players', href: '/dashboard/players', icon: Users, featureKey: 'players' as FeatureKey },
      ],
    },
    {
      label: 'Workflow',
      items: [
        { labelKey: 'nav.calendar', href: '/dashboard/calendar', icon: Calendar, featureKey: 'calendar' as FeatureKey },
        { labelKey: 'nav.forms', href: '/dashboard/forms', icon: FileText, featureKey: 'forms' as FeatureKey },
        { labelKey: 'nav.notes', href: '/dashboard/notes', icon: StickyNote, featureKey: 'notes' as FeatureKey },
        { labelKey: 'nav.messages', href: '/dashboard/chat', icon: MessageSquare, featureKey: 'messages' as FeatureKey },
      ],
    },
    {
      label: 'Analysis',
      items: [
        { labelKey: 'nav.reports', href: '/dashboard/reports', icon: BarChart3, featureKey: 'reports' as FeatureKey },
        { labelKey: 'nav.spreadsheets', href: '/dashboard/spreadsheets', icon: Table, featureKey: 'spreadsheets' as FeatureKey },
        { labelKey: 'settings.dataManagement', href: '/dashboard/data-management', icon: Database, featureKey: 'dataManagement' as FeatureKey },
      ],
    },
    {
      label: 'Tools',
      items: [
        { labelKey: 'nav.canvas', href: '/dashboard/canvas', icon: PencilRuler, featureKey: 'canvas' as FeatureKey },
        { labelKey: 'nav.files', href: '/dashboard/files', icon: Folder, featureKey: 'files' as FeatureKey },
        { labelKey: 'nav.planner', href: '/dashboard/planner', icon: CalendarCheck, featureKey: 'planner' as FeatureKey },
        { labelKey: 'nav.templates', href: '/dashboard/templates', icon: Layout, featureKey: 'templates' as FeatureKey },
      ],
    },
    {
      label: 'AI',
      items: [
        { labelKey: 'nav.ai', href: '/dashboard/ai', icon: Sparkles, featureKey: 'ai' as FeatureKey },
        { labelKey: 'nav.aiWorkspace', href: '/dashboard/ai-workspace', icon: Wand2, featureKey: 'aiWorkspace' as FeatureKey },
      ],
    },
  ]

  // Filter each group to only show enabled & released features, drop empty groups
  const filteredGroups = navGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item =>
        enabledFeatures.has(item.featureKey) && isFeatureReleased(item.featureKey)
      ),
    }))
    .filter(group => group.items.length > 0)

  const settingsItems = [
    { labelKey: 'settings.profile', href: '/dashboard/profile', icon: UserCircle },
    { labelKey: 'settings.systemSettings', href: '/dashboard/system-settings', icon: Settings },
  ]

  async function handleSignOut() {
    const result = await signOut()
    if (result.success) {
      toast.success(t('common.success'))
      router.push('/login')
    } else {
      toast.error(result.error || t('common.error'))
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <LogoBadge organizationName={organizationName} organizationLogo={organizationLogo} />
      </SidebarHeader>

      <SidebarContent>
        {filteredGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname?.startsWith(item.href)
                  const label = t(item.labelKey)
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
                        <Link href={item.href} className="relative flex items-center gap-2 min-w-0">
                          <item.icon />
                          <span className="truncate flex-1">{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => {
                const isActive = pathname?.startsWith(item.href)
                const label = t(item.labelKey)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={userName}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userAvatar || undefined} alt={userName} />
                    <AvatarFallback className="rounded-lg">
                      {userName?.[0]?.toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{userName}</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {userEmail ?? 'Team member'}
                    </span>
                  </div>
                  <ChevronsUpDown className="ms-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                side="top"
                sideOffset={8}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <UserCircle className="me-2 h-4 w-4" />
                    {t('settings.profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="me-2 h-4 w-4" />
                  {t('common.signOut', { default: 'Sign Out' })}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

AppSidebarComponent.displayName = 'AppSidebar'

export const AppSidebar = memo(AppSidebarComponent)
