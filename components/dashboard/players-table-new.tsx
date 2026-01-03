'use client'

import { useMemo, useState, useEffect, useRef, useCallback, startTransition } from 'react'
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnOrderState,
  ColumnSizingState,
  GroupingState,
  ExpandedState,
  RowSelectionState,
} from '@tanstack/react-table'
import { createPlayer, bulkUpdatePlayers } from '@/app/actions/players'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  Badge,
} from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageCard } from '@/components/ui/page-card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreHorizontal, UserPlus } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DataTable,
  DataTableFilters,
  DataTableColumnManager,
  DataTableExport,
  type FilterConfig,
} from '@/components/data-table'
import { useReactTable, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { NATIONALITIES } from '@/lib/nationalities'
import { NationalitySelect } from '@/components/ui/nationality-select'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { NoteEditorDialog } from '@/components/notes/note-editor-dialog'
import { formatDate } from '@/lib/date'
import { toast } from 'sonner'

export type PlayerRow = {
  id: string
  name: string
  position: string | null
  age: number | null
  nationality: string | null
  status: string
  tags: string[]
  jerseyNumber: number | null
  email?: string | null
  phone?: string | null
  photo?: string | null
  joinedAt?: Date | null
}

type PlayersTableProps = {
  players: PlayerRow[]
  total?: number
}

const statusColors: Record<string, string> = {
  active: 'bg-green-600 text-white hover:bg-green-700',
  available: 'bg-green-600 text-white hover:bg-green-700',
  injured: 'bg-destructive text-white hover:bg-destructive/90',
  suspended: 'bg-muted text-muted-foreground hover:bg-muted/80',
  inactive: 'bg-muted text-muted-foreground hover:bg-muted/80',
}

const statusLabel = (value: string, t: ReturnType<typeof useTranslations>) => {
  const normalized = value?.toLowerCase()
  if (normalized === 'active' || normalized === 'available') {
    return t('players.statuses.available')
  }
  if (normalized === 'injured') {
    return t('players.statuses.injured')
  }
  if (normalized === 'suspended') {
    return t('players.statuses.suspended')
  }
  if (normalized === 'inactive') {
    return t('players.statuses.inactive')
  }
  return normalized ? normalized.replace(/(^|\s)\S/g, (c) => c.toUpperCase()) : t('players.statuses.unknown')
}

const titleCase = (value: string | null | undefined) => {
  if (!value) {
    return ''
  }
  return value
    .split(/[\s-_]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

const createColumns = (
  players: PlayerRow[],
  t: ReturnType<typeof useTranslations>,
  onNavigateToProfile: (playerId: string) => void,
  onAddNote: (playerId: string) => void,
  router: ReturnType<typeof useRouter>,
  preferences?: { timezone: string | null; dateFormat: string | null; timeFormat: string | null } | null
): ColumnDef<PlayerRow>[] => {
  // Check which columns have data
  const hasPosition = players.some(p => p.position)
  const hasAge = players.some(p => p.age !== null)
  const hasNationality = players.some(p => p.nationality)
  const hasEmail = players.some(p => p.email)
  const hasJoinedAt = players.some(p => p.joinedAt)
  const hasTags = players.some(p => p.tags && p.tags.length > 0)

  const columns: ColumnDef<PlayerRow>[] = [
    {
      accessorKey: 'name',
      header: t('players.name'),
      size: 280,
      cell: ({ row }) => {
        const player = row.original
        const rowIndex = row.index
        // Priority loading for first 10 rows (above fold)
        const shouldPriorityLoad = rowIndex < 10
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {player.photo ? (
                <AvatarImage 
                  src={player.photo} 
                  alt={player.name}
                  loading={shouldPriorityLoad ? 'eager' : 'lazy'}
                />
              ) : (
                <AvatarFallback>{player.name?.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <Link
                href={`/dashboard/players/${player.id}`}
                className="font-medium text-foreground hover:text-primary hover:underline text-start"
                prefetch={false}
                onMouseEnter={() => {
                  // Prefetch the player profile on hover
                  router.prefetch(`/dashboard/players/${player.id}`)
                }}
              >
                {player.name}
              </Link>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'jerseyNumber',
      header: t('players.number'),
      enableHiding: true,
      size: 100,
      cell: ({ getValue }) => {
        const value = getValue() as number | null | undefined
        return <span className="text-sm">{value ?? '—'}</span>
      },
    },
  ]

  if (hasPosition) {
    columns.push({
      accessorKey: 'position',
      header: t('players.position'),
      enableHiding: true,
      cell: ({ getValue }) => (
        <span>{titleCase(getValue() as string | null) || '—'}</span>
      ),
    })
  }

  if (hasAge) {
    columns.push({
      accessorKey: 'age',
      header: t('players.age'),
      enableHiding: true,
      cell: ({ getValue }) => {
        const value = getValue() as number | null | undefined
        return <span>{value ?? '—'}</span>
      },
    })
  }

  if (hasNationality) {
    columns.push({
      accessorKey: 'nationality',
      header: t('players.nationality'),
      enableHiding: true,
      cell: ({ getValue }) => (
        <span>{titleCase(getValue() as string | null) || '—'}</span>
      ),
    })
  }

  columns.push({
    accessorKey: 'status',
    header: t('players.status'),
    enableHiding: true,
    cell: ({ getValue }) => {
      const status = (getValue() as string) ?? ''
      const normalized = status.toLowerCase()
      const colorClass = statusColors[normalized] ?? 'bg-muted text-muted-foreground'
      return (
        <Badge className={colorClass}>
          {statusLabel(normalized, t)}
        </Badge>
      )
    },
  })

  if (hasEmail) {
    columns.push({
      accessorKey: 'email',
      header: t('players.email'),
      enableHiding: true,
      cell: ({ getValue }) => {
        const email = getValue() as string | null | undefined
        if (!email) return <span className="text-sm text-muted-foreground">—</span>
        return (
          <a
            href={`mailto:${email}`}
            className="text-sm text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {email}
          </a>
        )
      },
    })
  }

  columns.push({
    accessorKey: 'phone',
    header: t('players.phone'),
    enableHiding: true,
    cell: ({ getValue }) => {
      const phone = getValue() as string | null | undefined
      if (!phone) return <span className="text-sm text-muted-foreground">—</span>
      return (
        <a
          href={`tel:${phone}`}
          className="text-sm text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {phone}
        </a>
      )
    },
  })

  if (hasJoinedAt) {
    columns.push({
      accessorKey: 'joinedAt',
      header: t('players.joined'),
      enableHiding: true,
      cell: ({ getValue }) => {
        const joinedAt = getValue() as Date | null | undefined
        if (!joinedAt) return <span className="text-sm text-muted-foreground">—</span>
        return (
          <span className="text-sm" suppressHydrationWarning>
            {formatDate(joinedAt, preferences || undefined)}
          </span>
        )
      },
    })
  }

  if (hasTags) {
    columns.push({
      accessorKey: 'tags',
      header: t('players.tags'),
      enableHiding: true,
      enableSorting: false,
      cell: ({ getValue }) => {
        const tags = getValue() as string[]
        if (!tags?.length) {
          return <span className="text-sm text-muted-foreground">—</span>
        }
        return (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {titleCase(tag)}
              </Badge>
            ))}
          </div>
        )
      },
    })
  }

  columns.push({
    id: 'actions',
    header: () => <span className="sr-only">{t('players.actions')}</span>,
    cell: ({ row }) => {
      const player = row.original
      return (
        <div className="flex justify-end">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onNavigateToProfile(player.id)}
              >
                {t('players.viewProfile')}
              </DropdownMenuItem>
              <DropdownMenuItem>{t('players.sendForm')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddNote(player.id)}>
                {t('players.addNote')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  })

  return columns
}

function normalizeFilter(value: string | null | undefined) {
  return value?.toLowerCase().trim() ?? ''
}

export function PlayersTable({ players, total: serverTotal }: PlayersTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations()
  const { preferences } = useUserPreferences()
  
  // Initialize state with default values (same on server and client)
  const [search, setSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [nationalityFilter, setNationalityFilter] = useState('all')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({
    name: 280,
    jerseyNumber: 100,
  })
  const [grouping, setGrouping] = useState<GroupingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newPlayer, setNewPlayer] = useState({
    firstName: '',
    lastName: '',
    position: '',
    jerseyNumber: '',
    dateOfBirth: undefined as Date | undefined,
    nationality: '',
    email: '',
    phone: '',
  })
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)
  const [noteDialogOpen, setNoteDialogOpen] = useState(false)
  const [selectedPlayerForNote, setSelectedPlayerForNote] = useState<string | undefined>(undefined)

  // Track if component has mounted to prevent initial URL update
  const isMounted = useRef(false)
  // Track if we're in initial URL sync to prevent triggering URL updates
  const isInitialUrlSync = useRef(true)
  // Track the last URL search string we processed
  const lastUrlSearchRef = useRef<string>('')
  // Track the last pathname to detect route changes
  const lastPathnameRef = useRef<string>('')
  const STORAGE_KEY = 'players-table-filters'

  // Function to save filters to localStorage
  const saveFiltersToStorage = useCallback((filters: {
    search: string
    position: string
    status: string
    nationality: string
    sorting: SortingState
    visibility: VisibilityState
  }) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [])

  // Function to load filters from localStorage
  const loadFiltersFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    return null
  }, [])

  // Function to read URL params and update state
  const syncStateFromURL = useCallback(() => {
    if (typeof window === 'undefined') return
    if (!isMounted.current) return // Don't update state before mount

    const currentSearch = window.location.search
    const currentPathname = window.location.pathname

    // If pathname changed, reset the last search ref to force sync
    if (currentPathname !== lastPathnameRef.current) {
      lastPathnameRef.current = currentPathname
      lastUrlSearchRef.current = '' // Force sync on route change
    }

    const params = new URLSearchParams(currentSearch)

    // Read URL params and update state if they exist
    const urlSearch = params.get('search')
    const urlPosition = params.get('position')
    const urlStatus = params.get('status')
    const urlNationality = params.get('nationality')
    const urlSort = params.get('sort')
    const urlVisibility = params.get('visibility')

    // Check if URL has any filter params
    const hasUrlParams = urlSearch !== null || urlPosition !== null || urlStatus !== null ||
                         urlNationality !== null || urlSort !== null || urlVisibility !== null

    // Create a signature of current state to compare
    const currentStateSignature = `${currentSearch}-${hasUrlParams}`

    // Skip if URL and state signature haven't changed
    if (currentStateSignature === lastUrlSearchRef.current) {
      // Still mark initial sync as complete if this is the first call
      if (isInitialUrlSync.current) {
        setTimeout(() => {
          isInitialUrlSync.current = false
        }, 0)
      }
      return
    }

    lastUrlSearchRef.current = currentStateSignature

    // Use startTransition to batch state updates and avoid hydration issues
    // Double-check mounted state inside the transition to prevent updates after unmount
    startTransition(() => {
      // Ensure component is still mounted before updating state
      if (!isMounted.current) return

      // Batch all state updates together to avoid hydration issues
      if (hasUrlParams) {
        // Use URL params - batch updates
        setSearch(urlSearch || '')
        setPositionFilter(urlPosition || 'all')
        setStatusFilter(urlStatus || 'all')
        setNationalityFilter(urlNationality || 'all')

        if (urlSort) {
          try {
            setSorting(JSON.parse(urlSort))
          } catch {
            setSorting([])
          }
        } else {
          setSorting([])
        }

        if (urlVisibility) {
          try {
            setColumnVisibility(JSON.parse(urlVisibility))
          } catch {
            setColumnVisibility({})
          }
        } else {
          setColumnVisibility({})
        }
      } else {
        // No URL params, try localStorage
        const stored = loadFiltersFromStorage()
        if (stored) {
          // Batch updates from localStorage
          setSearch(stored.search || '')
          setPositionFilter(stored.position || 'all')
          setStatusFilter(stored.status || 'all')
          setNationalityFilter(stored.nationality || 'all')
          setSorting(stored.sorting || [])
          setColumnVisibility(stored.visibility || {})
        } else {
          // No URL params and no localStorage - reset to defaults (only if not already defaults)
          // Don't update if already at defaults to avoid unnecessary re-renders
          setSearch('')
          setPositionFilter('all')
          setStatusFilter('all')
          setNationalityFilter('all')
          setSorting([])
          setColumnVisibility({})
        }
      }
    })

    // Mark initial URL sync as complete after a delay to ensure state updates are processed
    setTimeout(() => {
      isInitialUrlSync.current = false
    }, 0)
  }, [loadFiltersFromStorage])

  // Read URL params on mount and when URL/pathname changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Mark as mounted first
    isMounted.current = true
    
    // Use requestAnimationFrame to ensure we're past hydration and render phase
    // This ensures the component is fully mounted before updating state
    let rafId: number | null = null
    const timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(() => {
        if (isMounted.current) {
          lastPathnameRef.current = pathname
          syncStateFromURL()
        }
      })
    }, 0)
    
    // Listen for popstate (browser back/forward)
    const handlePopState = () => {
      if (isMounted.current) {
        syncStateFromURL()
      }
    }
    
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      isMounted.current = false
      clearTimeout(timeoutId)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      window.removeEventListener('popstate', handlePopState)
    }
  }, [syncStateFromURL, pathname])

  // Also sync when pathname changes (Next.js route change)
  useEffect(() => {
    if (!isMounted.current || typeof window === 'undefined') return
    if (pathname !== lastPathnameRef.current) {
      lastPathnameRef.current = pathname
      // Use requestAnimationFrame to ensure URL is updated and component is mounted
      const rafId = requestAnimationFrame(() => {
        if (isMounted.current) {
          syncStateFromURL()
        }
      })
      return () => {
        cancelAnimationFrame(rafId)
      }
    }
  }, [pathname, syncStateFromURL])

  // Update URL params when filters change (skip initial mount and initial URL sync)
  useEffect(() => {
    if (!isMounted.current || isInitialUrlSync.current || typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    
    // Update or remove filter params
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    
    if (positionFilter !== 'all') {
      params.set('position', positionFilter)
    } else {
      params.delete('position')
    }
    
    if (statusFilter !== 'all') {
      params.set('status', statusFilter)
    } else {
      params.delete('status')
    }
    
    if (nationalityFilter !== 'all') {
      params.set('nationality', nationalityFilter)
    } else {
      params.delete('nationality')
    }

    if (sorting.length > 0) {
      params.set('sort', JSON.stringify(sorting))
    } else {
      params.delete('sort')
    }

    if (Object.keys(columnVisibility).length > 0) {
      params.set('visibility', JSON.stringify(columnVisibility))
    } else {
      params.delete('visibility')
    }

    const newURL = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

    // Only update if URL actually changed to avoid unnecessary navigation
    const currentURL = window.location.pathname + window.location.search
    if (newURL !== currentURL) {
      router.replace(newURL, { scroll: false })
    }

    // Also save to localStorage as backup
    saveFiltersToStorage({
      search,
      position: positionFilter,
      status: statusFilter,
      nationality: nationalityFilter,
      sorting,
      visibility: columnVisibility,
    })
  }, [search, positionFilter, statusFilter, nationalityFilter, sorting, columnVisibility, router, saveFiltersToStorage])

  const handleAddPlayer = async () => {
    if (!newPlayer.firstName || !newPlayer.lastName) {
      alert('First name and last name are required')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createPlayer({
        firstName: newPlayer.firstName,
        lastName: newPlayer.lastName,
        email: newPlayer.email || undefined,
        phone: newPlayer.phone || undefined,
        position: newPlayer.position || undefined,
        jerseyNumber: newPlayer.jerseyNumber ? parseInt(newPlayer.jerseyNumber) : undefined,
        dateOfBirth: newPlayer.dateOfBirth?.toISOString().split('T')[0] || undefined,
        nationality: newPlayer.nationality || undefined,
      })

      if (result.error) {
        alert(result.error)
      } else {
        setNewPlayer({
          firstName: '',
          lastName: '',
          position: '',
          jerseyNumber: '',
          dateOfBirth: undefined,
          nationality: '',
          email: '',
          phone: '',
        })
        setIsAddPlayerOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating player:', error)
      alert('Failed to create player')
    } finally {
      setIsSubmitting(false)
    }
  }

  const uniquePositions = useMemo(
    () =>
      Array.from(
        new Set(
          players
            .map((player) => player.position)
            .filter((pos): pos is string => Boolean(pos))
        )
      ).sort(),
    [players]
  )

  const uniqueStatuses = useMemo(
    () =>
      Array.from(
        new Set(players.map((player) => normalizeFilter(player.status)).filter(Boolean))
      ).sort(),
    [players]
  )

  const uniqueNationalities = useMemo(
    () =>
      Array.from(
        new Set(
          players
            .map((player) => normalizeFilter(player.nationality))
            .filter(Boolean)
        )
      ).sort(),
    [players]
  )

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const normalizedTags = player.tags?.join(' ') ?? ''
      const matchesSearch = !search
        ? true
        : [player.name, player.email, normalizedTags]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(search.toLowerCase()))

      const matchesPosition =
        positionFilter === 'all' ||
        normalizeFilter(player.position) === positionFilter

      const matchesStatus =
        statusFilter === 'all' || normalizeFilter(player.status) === statusFilter

      const matchesNationality =
        nationalityFilter === 'all' ||
        normalizeFilter(player.nationality) === nationalityFilter

      return matchesSearch && matchesPosition && matchesStatus && matchesNationality
    })
  }, [players, search, positionFilter, statusFilter, nationalityFilter])

  const handleAddNote = useCallback((playerId: string) => {
    setSelectedPlayerForNote(playerId)
    setNoteDialogOpen(true)
  }, [])

  const columns = useMemo(
    () => createColumns(
      players,
      t,
      (playerId) => router.push(`/dashboard/players/${playerId}`),
      handleAddNote,
      router,
      preferences || null
    ),
    [players, t, router, handleAddNote, preferences]
  )

  // Prepare filter config for DataTableFilters
  const filterConfig: FilterConfig[] = useMemo(() => [
    {
      key: 'search',
      label: t('common.search'),
      type: 'search',
      placeholder: t('players.search'),
    },
    {
      key: 'position',
      label: t('players.position'),
      type: 'select',
      options: uniquePositions.map((pos) => ({
        value: pos,
        label: titleCase(pos),
      })),
      placeholder: t('players.allPositions'),
    },
    {
      key: 'status',
      label: t('players.status'),
      type: 'select',
      options: uniqueStatuses.map((status) => ({
        value: status,
        label: statusLabel(status, t),
      })),
      placeholder: t('players.allStatuses'),
    },
    {
      key: 'nationality',
      label: t('players.nationality'),
      type: 'select',
      options: uniqueNationalities.map((country) => ({
        value: country,
        label: titleCase(country),
      })),
      placeholder: t('players.allNationalities'),
    },
  ], [uniquePositions, uniqueStatuses, uniqueNationalities, t])

  const filterValues = useMemo(() => ({
    search,
    position: positionFilter,
    status: statusFilter,
    nationality: nationalityFilter,
  }), [search, positionFilter, statusFilter, nationalityFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    if (key === 'search') setSearch(value)
    else if (key === 'position') setPositionFilter(value)
    else if (key === 'status') setStatusFilter(value)
    else if (key === 'nationality') setNationalityFilter(value)
  }, [])

  // Create a table instance for export/column manager utilities
  // This needs full row model for export to work correctly
  const tableInstance = useReactTable({
    data: filteredPlayers,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnOrder: columnOrder.length > 0 ? columnOrder : undefined,
      columnSizing: Object.keys(columnSizing).length > 0 ? columnSizing : undefined,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  })

  // Handle bulk update
  const handleBulkUpdate = useCallback(async (updates: {
    position?: string | null
    status?: 'active' | 'injured' | 'inactive' | null
    nationality?: string | null
  }) => {
    setIsBulkUpdating(true)
    try {
      // Get selected player IDs from the table instance
      const selectedRows = tableInstance.getFilteredSelectedRowModel().rows
      const selectedIds = selectedRows.map((row) => row.original.id)

      if (selectedIds.length === 0) {
        toast.error(t('players.noPlayersSelected'))
        setIsBulkUpdating(false)
        return
      }

      const result = await bulkUpdatePlayers(selectedIds, updates)

      if (result.error) {
        toast.error(result.error)
      } else {
        // Clear selection and refresh
        setRowSelection({})
        router.refresh()
      }
    } catch (error) {
      console.error('Error bulk updating players:', error)
      toast.error(t('players.failedToUpdatePlayers'))
    } finally {
      setIsBulkUpdating(false)
    }
  }, [tableInstance, router, setRowSelection, t])

  return (
    <div className="w-full min-w-0 max-w-full">
      <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('players.addNewPlayer')}</DialogTitle>
            <DialogDescription>
              {t('players.enterPlayerDetails')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('players.firstName')}</Label>
                <Input
                  id="firstName"
                  value={newPlayer.firstName}
                  onChange={(e) => setNewPlayer({ ...newPlayer, firstName: e.target.value })}
                  placeholder={t('players.enterFirstName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('players.lastName')}</Label>
                <Input
                  id="lastName"
                  value={newPlayer.lastName}
                  onChange={(e) => setNewPlayer({ ...newPlayer, lastName: e.target.value })}
                  placeholder={t('players.enterLastName')}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('players.email')}</Label>
              <Input
                id="email"
                type="email"
                value={newPlayer.email}
                onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                placeholder="player@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('players.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={newPlayer.phone}
                onChange={(e) => setNewPlayer({ ...newPlayer, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">{t('players.position')}</Label>
              <Input
                id="position"
                value={newPlayer.position}
                onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                placeholder="e.g. Forward"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jerseyNumber">{t('players.jerseyNumber')}</Label>
                <Input
                  id="jerseyNumber"
                  type="number"
                  value={newPlayer.jerseyNumber}
                  onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })}
                  placeholder="e.g. 10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">{t('players.dateOfBirth')}</Label>
                <DatePicker
                  date={newPlayer.dateOfBirth}
                  onSelect={(date) => setNewPlayer({ ...newPlayer, dateOfBirth: date })}
                  placeholder="Pick a date"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">{t('players.nationality')}</Label>
              <NationalitySelect
                value={newPlayer.nationality || undefined}
                onValueChange={(value) => setNewPlayer({ ...newPlayer, nationality: value })}
                placeholder={t('players.selectNationality')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPlayerOpen(false)} disabled={isSubmitting}>
              {t('common.cancel')}
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddPlayer}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('players.adding') : t('players.addPlayer')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PageCard
        title={t('players.title')}
        description={t('players.manageDescription')}
        headerActions={
          <Button 
            onClick={() => setIsAddPlayerOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            type="button"
          >
            <UserPlus className="me-2 h-4 w-4" />
            {t('players.addPlayer')}
          </Button>
        }
        toolbar={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <DataTableFilters
              filters={filterConfig}
              values={filterValues}
              onFilterChange={handleFilterChange}
            />
            <DataTableColumnManager
              table={tableInstance}
              onColumnOrderChange={setColumnOrder}
            />
            <DataTableExport
              table={tableInstance}
              columns={columns}
              filename="players"
            />
          </div>
        }
      >
          <DataTable
            data={filteredPlayers}
            columns={columns}
            sorting={sorting}
            onSortingChange={setSorting}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            columnOrder={columnOrder}
            onColumnOrderChange={setColumnOrder}
            columnSizing={columnSizing}
            onColumnSizingChange={setColumnSizing}
            grouping={grouping}
            onGroupingChange={setGrouping}
            expanded={expanded}
            onExpandedChange={setExpanded}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            enableRowSelection={true}
            enableGrouping={true}
            enableColumnResizing={true}
            enableColumnReordering={true}
            enableColumnVisibility={true}
            enableBulkActions={true}
            enableExport={false}
            onBulkUpdate={handleBulkUpdate}
            bulkUpdatePositionOptions={uniquePositions}
            bulkUpdateNationalityOptions={NATIONALITIES}
            isBulkUpdating={isBulkUpdating}
            emptyMessage={t('players.noPlayersMatchFilters')}
          />
      </PageCard>

      {/* Note Editor Dialog */}
      <NoteEditorDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        linkedPersonId={selectedPlayerForNote}
        onSuccess={() => {
          setNoteDialogOpen(false)
          toast.success('Note added successfully')
        }}
      />
    </div>
  )
}
