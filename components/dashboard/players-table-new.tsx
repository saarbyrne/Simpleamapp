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
  type PaginationState,
} from '@tanstack/react-table'
import { createPlayer, bulkUpdatePlayers } from '@/app/actions/players'
import { useRouter, usePathname } from 'next/navigation'
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
  photo?: string | null
}

type PlayersTableProps = {
  players: PlayerRow[]
}

const statusColors: Record<string, string> = {
  active: 'bg-green-600 text-white hover:bg-green-700',
  available: 'bg-green-600 text-white hover:bg-green-700',
  injured: 'bg-destructive text-white hover:bg-destructive/90',
  suspended: 'bg-muted text-muted-foreground hover:bg-muted/80',
  inactive: 'bg-muted text-muted-foreground hover:bg-muted/80',
}

const statusLabel = (value: string) => {
  const normalized = value?.toLowerCase()
  if (normalized === 'active' || normalized === 'available') {
    return 'Available'
  }
  if (normalized === 'injured') {
    return 'Injured'
  }
  if (normalized === 'suspended') {
    return 'Suspended'
  }
  if (normalized === 'inactive') {
    return 'Inactive'
  }
  return normalized ? normalized.replace(/(^|\s)\S/g, (c) => c.toUpperCase()) : 'Unknown'
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

const createColumns = (players: PlayerRow[]): ColumnDef<PlayerRow>[] => {
  // Check which columns have data
  const hasPosition = players.some(p => p.position)
  const hasAge = players.some(p => p.age !== null)
  const hasNationality = players.some(p => p.nationality)
  const hasTags = players.some(p => p.tags && p.tags.length > 0)

  const columns: ColumnDef<PlayerRow>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const player = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {player.photo ? (
                <AvatarImage src={player.photo} alt={player.name} />
              ) : (
                <AvatarFallback>{player.name?.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{player.name}</span>
              <span className="text-sm text-muted-foreground">
                #{player.jerseyNumber ?? '—'}
              </span>
            </div>
          </div>
        )
      },
    },
  ]

  if (hasPosition) {
    columns.push({
      accessorKey: 'position',
      header: 'Position',
      enableHiding: true,
      cell: ({ getValue }) => (
        <span>{titleCase(getValue() as string | null) || '—'}</span>
      ),
    })
  }

  if (hasAge) {
    columns.push({
      accessorKey: 'age',
      header: 'Age',
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
      header: 'Nationality',
      enableHiding: true,
      cell: ({ getValue }) => (
        <span>{titleCase(getValue() as string | null) || '—'}</span>
      ),
    })
  }

  columns.push({
    accessorKey: 'status',
    header: 'Status',
    enableHiding: true,
    cell: ({ getValue }) => {
      const status = (getValue() as string) ?? ''
      const normalized = status.toLowerCase()
      const colorClass = statusColors[normalized] ?? 'bg-muted text-muted-foreground'
      return (
        <Badge className={colorClass}>
          {statusLabel(normalized)}
        </Badge>
      )
    },
  })

  if (hasTags) {
    columns.push({
      accessorKey: 'tags',
      header: 'Tags',
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
    header: () => <span className="sr-only">Actions</span>,
    cell: () => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Send form</DropdownMenuItem>
            <DropdownMenuItem>Add note</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  })

  return columns
}

function normalizeFilter(value: string | null | undefined) {
  return value?.toLowerCase().trim() ?? ''
}

export function PlayersTable({ players }: PlayersTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // Initialize state with default values (same on server and client)
  const [search, setSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [nationalityFilter, setNationalityFilter] = useState('all')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
  const [grouping, setGrouping] = useState<GroupingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newPlayer, setNewPlayer] = useState({
    firstName: '',
    lastName: '',
    position: '',
    jerseyNumber: '',
    dateOfBirth: '',
    nationality: '',
    email: '',
  })
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)

  // Track if component has mounted to prevent initial URL update
  const isMounted = useRef(false)
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
    pageIndex: number
    pageSize: number
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
    const urlPage = params.get('page')
    const urlPageSize = params.get('pageSize')
    const urlSort = params.get('sort')
    const urlVisibility = params.get('visibility')
    
    // Check if URL has any filter params
    const hasUrlParams = urlSearch !== null || urlPosition !== null || urlStatus !== null || 
                         urlNationality !== null || urlPage !== null || urlPageSize !== null ||
                         urlSort !== null || urlVisibility !== null
    
    // Create a signature of current state to compare
    const currentStateSignature = `${currentSearch}-${hasUrlParams}`
    
    // Skip if URL and state signature haven't changed
    if (currentStateSignature === lastUrlSearchRef.current) return
    
    lastUrlSearchRef.current = currentStateSignature
    
    // Use startTransition to batch state updates and avoid hydration issues
    startTransition(() => {
      // Batch all state updates together to avoid hydration issues
      if (hasUrlParams) {
        // Use URL params - batch updates
        setSearch(urlSearch || '')
        setPositionFilter(urlPosition || 'all')
        setStatusFilter(urlStatus || 'all')
        setNationalityFilter(urlNationality || 'all')
        
        const pageNum = urlPage ? parseInt(urlPage, 10) : 0
        const pageSizeNum = urlPageSize ? parseInt(urlPageSize, 10) : 8
        setPagination({
          pageIndex: !isNaN(pageNum) ? pageNum : 0,
          pageSize: !isNaN(pageSizeNum) ? pageSizeNum : 8,
        })
        
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
          setPagination({
            pageIndex: stored.pageIndex || 0,
            pageSize: stored.pageSize || 8,
          })
          setSorting(stored.sorting || [])
          setColumnVisibility(stored.visibility || {})
        } else {
          // No URL params and no localStorage - reset to defaults (only if not already defaults)
          // Don't update if already at defaults to avoid unnecessary re-renders
          setSearch('')
          setPositionFilter('all')
          setStatusFilter('all')
          setNationalityFilter('all')
          setPagination({ pageIndex: 0, pageSize: 8 })
          setSorting([])
          setColumnVisibility({})
        }
      }
    })
  }, [loadFiltersFromStorage])

  // Read URL params on mount and when URL/pathname changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Mark as mounted first
    isMounted.current = true
    
    // Use requestAnimationFrame to ensure we're past hydration
    const rafId = requestAnimationFrame(() => {
      lastPathnameRef.current = pathname
      syncStateFromURL()
    })
    
    // Listen for popstate (browser back/forward)
    const handlePopState = () => {
      syncStateFromURL()
    }
    
    // Check URL when page becomes visible (handles navigation back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncStateFromURL()
      }
    }
    
    // Check URL when window gains focus (handles tab switching back)
    const handleFocus = () => {
      syncStateFromURL()
    }
    
    // Use a small interval to check for URL changes (handles Next.js navigation)
    // This is a fallback for cases where events don't fire
    const intervalId = setInterval(() => {
      if (typeof window !== 'undefined' && isMounted.current) {
        const currentSearch = window.location.search
        const currentPathname = window.location.pathname
        const params = new URLSearchParams(currentSearch)
        const hasUrlParams = params.get('search') !== null || params.get('position') !== null || 
                             params.get('status') !== null || params.get('nationality') !== null ||
                             params.get('page') !== null || params.get('pageSize') !== null ||
                             params.get('sort') !== null || params.get('visibility') !== null
        const currentStateSignature = `${currentSearch}-${hasUrlParams}`
        
        if (currentStateSignature !== lastUrlSearchRef.current || currentPathname !== lastPathnameRef.current) {
          syncStateFromURL()
        }
      }
    }, 100) // Check every 100ms
    
    window.addEventListener('popstate', handlePopState)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(intervalId)
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [syncStateFromURL, pathname])

  // Also sync when pathname changes (Next.js route change)
  useEffect(() => {
    if (!isMounted.current || typeof window === 'undefined') return
    if (pathname !== lastPathnameRef.current) {
      lastPathnameRef.current = pathname
      // Small delay to ensure URL is updated
      setTimeout(() => {
        syncStateFromURL()
      }, 0)
    }
  }, [pathname, syncStateFromURL])

  // Update URL params when filters change (skip initial mount)
  useEffect(() => {
    if (!isMounted.current || typeof window === 'undefined') return
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
    
    if (pagination.pageIndex > 0) {
      params.set('page', String(pagination.pageIndex))
    } else {
      params.delete('page')
    }
    
    if (pagination.pageSize !== 8) {
      params.set('pageSize', String(pagination.pageSize))
    } else {
      params.delete('pageSize')
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
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      visibility: columnVisibility,
    })
  }, [search, positionFilter, statusFilter, nationalityFilter, pagination.pageIndex, pagination.pageSize, sorting, columnVisibility, router, saveFiltersToStorage])

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
        position: newPlayer.position || undefined,
        jerseyNumber: newPlayer.jerseyNumber ? parseInt(newPlayer.jerseyNumber) : undefined,
        dateOfBirth: newPlayer.dateOfBirth || undefined,
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
          dateOfBirth: '',
          nationality: '',
          email: '',
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

  const columns = useMemo(() => createColumns(players), [players])

  // Prepare filter config for DataTableFilters
  const filterConfig: FilterConfig[] = useMemo(() => [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Filter players...',
    },
    {
      key: 'position',
      label: 'Position',
      type: 'select',
      options: uniquePositions.map((pos) => ({
        value: pos,
        label: titleCase(pos),
      })),
      placeholder: 'All Positions',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: uniqueStatuses.map((status) => ({
        value: status,
        label: statusLabel(status),
      })),
      placeholder: 'All Statuses',
    },
    {
      key: 'nationality',
      label: 'Nationality',
      type: 'select',
      options: uniqueNationalities.map((country) => ({
        value: country,
        label: titleCase(country),
      })),
      placeholder: 'All Countries',
    },
  ], [uniquePositions, uniqueStatuses, uniqueNationalities])

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
      pagination,
      columnVisibility,
      rowSelection,
      columnOrder: columnOrder.length > 0 ? columnOrder : undefined,
      columnSizing: Object.keys(columnSizing).length > 0 ? columnSizing : undefined,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
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
        alert('No players selected')
        setIsBulkUpdating(false)
        return
      }

      const result = await bulkUpdatePlayers(selectedIds, updates)

      if (result.error) {
        alert(result.error)
      } else {
        // Clear selection and refresh
        setRowSelection({})
        router.refresh()
      }
    } catch (error) {
      console.error('Error bulk updating players:', error)
      alert('Failed to update players')
    } finally {
      setIsBulkUpdating(false)
    }
  }, [tableInstance, router, setRowSelection])

  const { pageIndex, pageSize } = pagination

  return (
    <div className="w-full min-w-0 max-w-full">
      <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Player</DialogTitle>
            <DialogDescription>
              Enter the player details below to add them to your roster.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newPlayer.firstName}
                  onChange={(e) => setNewPlayer({ ...newPlayer, firstName: e.target.value })}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newPlayer.lastName}
                  onChange={(e) => setNewPlayer({ ...newPlayer, lastName: e.target.value })}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newPlayer.email}
                onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                placeholder="player@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={newPlayer.position}
                onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                placeholder="e.g. Forward"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jerseyNumber">Jersey Number</Label>
                <Input
                  id="jerseyNumber"
                  type="number"
                  value={newPlayer.jerseyNumber}
                  onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })}
                  placeholder="e.g. 10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={newPlayer.dateOfBirth}
                  onChange={(e) => setNewPlayer({ ...newPlayer, dateOfBirth: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={newPlayer.nationality}
                onChange={(e) => setNewPlayer({ ...newPlayer, nationality: e.target.value })}
                placeholder="e.g. England"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPlayerOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddPlayer}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Player'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PageCard
        title="Players"
        description="Manage your team roster and player information."
        headerActions={
          <Button 
            onClick={() => setIsAddPlayerOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            type="button"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Player
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
            pagination={pagination}
            onPaginationChange={setPagination}
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
            emptyMessage="No players match the filters."
          />

          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <Select
                value={String(pageSize)}
                onValueChange={(value) => setPagination({ ...pagination, pageSize: Number(value), pageIndex: 0 })}
              >
                <SelectTrigger className="h-9 w-[120px]">
                  <SelectValue placeholder="Rows per page" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 8, 12, 20].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} rows
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Showing {filteredPlayers.length} players · Page {pageIndex + 1} of{' '}
                <strong>{Math.ceil(filteredPlayers.length / pageSize)}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPagination({ ...pagination, pageIndex: pageIndex - 1 })}
                disabled={pageIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPagination({ ...pagination, pageIndex: pageIndex + 1 })}
                disabled={pageIndex >= Math.ceil(filteredPlayers.length / pageSize) - 1}
              >
                Next
              </Button>
            </div>
          </div>
      </PageCard>
    </div>
  )
}
