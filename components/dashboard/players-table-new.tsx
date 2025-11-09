'use client'

import { useMemo, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  type PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import { createPlayer } from '@/app/actions/players'
import { useRouter } from 'next/navigation'
import {
  Badge,
  type BadgeProps,
} from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronDown, MoreHorizontal, UserPlus, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

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
  injured: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
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
  const [search, setSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [nationalityFilter, setNationalityFilter] = useState('all')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
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
            .map((player) => normalizeFilter(player.position))
            .filter(Boolean)
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

  const table = useReactTable({
    data: filteredPlayers,
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const { pageIndex, pageSize } = table.getState().pagination

  return (
    <>
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

      <Card className="rounded-2xl border">
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl">Players</CardTitle>
            <CardDescription>Manage your team roster and player information.</CardDescription>
          </div>
          
          <Button 
            onClick={() => setIsAddPlayerOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            type="button"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Player
          </Button>
        </div>
        
        <CardHeader className="space-y-4 pt-0">
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              placeholder="Filter players..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 w-[200px] shrink-0"
            />

            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="h-10 w-[130px] shrink-0">
                <SelectValue placeholder="All Positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {uniquePositions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {titleCase(position)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-[130px] shrink-0">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
              <SelectTrigger className="h-10 w-[130px] shrink-0">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {uniqueNationalities.map((country) => (
                  <SelectItem key={country} value={country}>
                    {titleCase(country)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" className="h-10 shrink-0">
                  Columns
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide() && column.id !== 'name' && column.id !== 'actions')
                  .map((column) => {
                    return (
                      <DropdownMenuItem
                        key={column.id}
                        className="flex items-center gap-2 cursor-pointer"
                        onSelect={(e) => {
                          e.preventDefault()
                          column.toggleVisibility(!column.getIsVisible())
                        }}
                      >
                        <div className="flex h-4 w-4 items-center justify-center">
                          {column.getIsVisible() && <Check className="h-4 w-4" />}
                        </div>
                        <span>{typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}</span>
                      </DropdownMenuItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">

        <div className="overflow-auto rounded-lg border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers
                    .filter((header) => header.column.getIsVisible() !== false)
                    .map((header) => (
                      <TableHead
                        key={header.id}
                        className={header.column.id === 'actions' ? 'text-right' : 'text-left'}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'flex cursor-pointer items-center gap-2 select-none'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: ' ▲',
                              desc: ' ▼',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </TableHead>
                    ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === 'actions' ? 'text-right align-middle' : 'align-middle'
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                      No players match the filters.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
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
              <strong>{table.getPageCount()}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  )
}
