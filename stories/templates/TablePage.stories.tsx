import type { Meta, StoryObj } from '@storybook/react'
import { PageCard } from '@/components/ui/page-card'
import { Button } from '@/components/ui/button'
import {
  DataTable,
  DataTableFilters,
  DataTableColumnManager,
  DataTableExport,
  type FilterConfig,
} from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ColumnDef, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { UserPlus, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useState } from 'react'

const meta: Meta = {
  title: 'Templates/Table Page',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Table Page Template

A complete table page layout pattern using PageCard + DataTable + Filters.

## Pattern Structure
\`\`\`tsx
<PageCard
  variant="table"
  title="Page Title"
  description="Page description"
  headerActions={<Button>Add Item</Button>}
  toolbar={
    <>
      <DataTableFilters />
      <div className="flex gap-2">
        <DataTableColumnManager />
        <DataTableExport />
      </div>
    </>
  }
>
  <DataTable />
</PageCard>
\`\`\`

## Usage
This pattern is used across 15+ pages in the dashboard for managing lists of data (players, forms, staff, etc.)

## Key Components
- **PageCard variant="table"**: Provides title, description, and toolbar areas
- **DataTableFilters**: Search and filter controls
- **DataTable**: TanStack table with sorting, filtering, selection
- **DataTableColumnManager**: Show/hide columns
- **DataTableExport**: CSV export functionality
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Mock data
type Player = {
  id: string
  name: string
  position: string
  status: string
  age: number
  nationality: string
  photo?: string
}

const mockPlayers: Player[] = [
  { id: '1', name: 'Marcus Silva', position: 'Forward', status: 'active', age: 24, nationality: 'Brazil', photo: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'James Thompson', position: 'Midfielder', status: 'active', age: 27, nationality: 'England' },
  { id: '3', name: 'Carlos Rodriguez', position: 'Defender', status: 'injured', age: 29, nationality: 'Spain' },
  { id: '4', name: 'Pierre Dubois', position: 'Goalkeeper', status: 'active', age: 31, nationality: 'France' },
  { id: '5', name: 'Hans Mueller', position: 'Midfielder', status: 'suspended', age: 25, nationality: 'Germany' },
  { id: '6', name: 'Luca Rossi', position: 'Forward', status: 'active', age: 22, nationality: 'Italy' },
  { id: '7', name: 'Johan Svensson', position: 'Defender', status: 'inactive', age: 33, nationality: 'Sweden' },
  { id: '8', name: 'Diego Martinez', position: 'Midfielder', status: 'active', age: 26, nationality: 'Argentina' },
]

const statusColors: Record<string, string> = {
  active: 'bg-success text-success-foreground',
  injured: 'bg-destructive text-destructive-foreground',
  suspended: 'bg-warning text-warning-foreground',
  inactive: 'bg-muted text-muted-foreground',
}

// Table component for the story
function PlayersTable({ data }: { data: Player[] }) {
  const [sorting, setSorting] = useState<any>([])
  const [columnFilters, setColumnFilters] = useState<any>([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  const columns: ColumnDef<Player>[] = [
    {
      accessorKey: 'name',
      header: 'Player',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {row.original.photo && <AvatarImage src={row.original.photo} />}
            <AvatarFallback>{row.original.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'position',
      header: 'Position',
    },
    {
      accessorKey: 'age',
      header: 'Age',
    },
    {
      accessorKey: 'nationality',
      header: 'Nationality',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className={statusColors[row.original.status]}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const filterConfig: FilterConfig[] = [
    {
      id: 'search',
      type: 'search',
      placeholder: 'Search players...',
      column: 'name',
    },
    {
      id: 'position',
      type: 'select',
      placeholder: 'All Positions',
      column: 'position',
      options: [
        { label: 'Forward', value: 'Forward' },
        { label: 'Midfielder', value: 'Midfielder' },
        { label: 'Defender', value: 'Defender' },
        { label: 'Goalkeeper', value: 'Goalkeeper' },
      ],
    },
    {
      id: 'status',
      type: 'select',
      placeholder: 'All Statuses',
      column: 'status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Injured', value: 'injured' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <DataTableFilters
          table={table}
          filters={filterConfig}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <div className="flex gap-2">
          <DataTableColumnManager table={table} />
          <DataTableExport table={table} filename="players" />
        </div>
      </div>
      <DataTable table={table} columns={columns} />
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <PageCard
      variant="table"
      title="Players"
      description="Manage all players in your organization"
      headerActions={
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Player
        </Button>
      }
    >
      <PlayersTable data={mockPlayers} />
    </PageCard>
  ),
}

export const WithoutDescription: Story = {
  render: () => (
    <PageCard
      variant="table"
      title="Players"
      headerActions={
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Player
        </Button>
      }
    >
      <PlayersTable data={mockPlayers} />
    </PageCard>
  ),
}

export const EmptyState: Story = {
  render: () => (
    <PageCard
      variant="table"
      title="Players"
      description="Manage all players in your organization"
      headerActions={
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Player
        </Button>
      }
    >
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <UserPlus className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No players yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get started by adding your first player
        </p>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Player
        </Button>
      </div>
    </PageCard>
  ),
}

export const SmallDataset: Story = {
  render: () => (
    <PageCard
      variant="table"
      title="Team Captains"
      description="View and manage team captains"
      headerActions={<Button size="sm">Assign Captain</Button>}
    >
      <PlayersTable data={mockPlayers.slice(0, 3)} />
    </PageCard>
  ),
}
