'use client'

import { memo, useState, useEffect } from 'react'
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
import { getUserEnabledFeatures } from '@/app/actions/user-features'
import { FeatureKey } from '@/lib/permissions/feature-metadata'

type AppSidebarProps = {
  userName: string
  userEmail?: string | null
  userAvatar?: string | null
}

function LogoBadge() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold uppercase text-sidebar-primary-foreground">
        L
      </div>
      <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
        <span className="text-sm font-semibold">Logo</span>
        <span className="text-xs text-sidebar-foreground/70">Enterprise</span>
      </div>
    </Link>
  )
}

export const AppSidebar = memo(function AppSidebar({ userName, userEmail, userAvatar }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations()
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(new Set())
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true)

  // Load enabled features on mount
  useEffect(() => {
    async function loadFeatures() {
      const result = await getUserEnabledFeatures()
      if (result.success && result.features) {
        setEnabledFeatures(new Set(result.features))
      } else {
        // On error, enable all features (fail open)
        setEnabledFeatures(new Set(['aiWorkspace', 'ai', 'players', 'forms', 'reports', 'calendar', 'messages', 'notes', 'spreadsheets', 'canvas', 'files', 'planner', 'templates']))
      }
      setIsLoadingFeatures(false)
    }
    loadFeatures()
  }, [])

  const allNavItems = [
    { labelKey: 'nav.aiWorkspace', href: '/dashboard/ai-workspace', icon: Wand2, featureKey: 'aiWorkspace' as FeatureKey },
    { labelKey: 'nav.ai', href: '/dashboard/ai', icon: Sparkles, featureKey: 'ai' as FeatureKey },
    { labelKey: 'nav.players', href: '/dashboard/players', icon: Users, featureKey: 'players' as FeatureKey },
    { labelKey: 'nav.forms', href: '/dashboard/forms', icon: FileText, featureKey: 'forms' as FeatureKey },
    { labelKey: 'nav.reports', href: '/dashboard/reports', icon: BarChart3, featureKey: 'reports' as FeatureKey },
    { labelKey: 'nav.calendar', href: '/dashboard/calendar', icon: Calendar, featureKey: 'calendar' as FeatureKey },
    { labelKey: 'nav.messages', href: '/dashboard/chat', icon: MessageSquare, featureKey: 'messages' as FeatureKey },
    { labelKey: 'nav.notes', href: '/dashboard/notes', icon: StickyNote, featureKey: 'notes' as FeatureKey },
    { labelKey: 'nav.spreadsheets', href: '/dashboard/spreadsheets', icon: Table, featureKey: 'spreadsheets' as FeatureKey },
    { labelKey: 'nav.canvas', href: '/dashboard/canvas', icon: PencilRuler, featureKey: 'canvas' as FeatureKey },
    { labelKey: 'nav.files', href: '/dashboard/files', icon: Folder, featureKey: 'files' as FeatureKey },
    { labelKey: 'nav.planner', href: '/dashboard/planner', icon: CalendarCheck, featureKey: 'planner' as FeatureKey },
    { labelKey: 'nav.templates', href: '/dashboard/templates', icon: Layout, featureKey: 'templates' as FeatureKey },
  ]

  // Filter navigation items based on enabled features
  const navItems = isLoadingFeatures 
    ? allNavItems // Show all while loading
    : allNavItems.filter(item => enabledFeatures.has(item.featureKey))

  const settingsItems = [
    { labelKey: 'settings.profile', href: '/dashboard/profile', icon: UserCircle },
    { labelKey: 'settings.dataManagement', href: '/dashboard/data-management', icon: Database },
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
        <LogoBadge />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
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
})
