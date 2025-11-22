'use client'

import { useMemo, useState, useEffect, useRef, useCallback, startTransition } from 'react'
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  RowSelectionState,
  type PaginationState,
} from '@tanstack/react-table'
import { useRouter, usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageCard } from '@/components/ui/page-card'
import { Star, Download, Eye, Upload } from 'lucide-react'
import {
  DataTable,
  DataTableFilters,
  DataTableColumnManager,
  DataTableExport,
  type FilterConfig,
} from '@/components/data-table'
import { useReactTable, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { formatDate } from '@/lib/date'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export type TemplateRow = {
  id: string
  name: string
  description: string
  type: string
  category: string
  sport: string
  tags: string[]
  downloads: number
  rating: number | null
  reviewCount: number
  isOfficial: boolean
  isFeatured: boolean
  author?: {
    id: string
    name: string
    avatar: string | null
  } | null
  authorName?: string | null
  orgName?: string | null
  createdAt: Date
  publishedAt: Date | null
}

type TemplatesTableProps = {
  templates: TemplateRow[]
  total?: number
  onOpenSubmitDialog?: () => void
}

const typeIcons: Record<string, string> = {
  form: '📋',
  report: '📊',
  drawing: '✏️',
  plan: '🎯',
  spreadsheet: '📈',
}

const typeColors: Record<string, string> = {
  form: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  report: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  drawing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  plan: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  spreadsheet: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
}

const createColumns = (
  onNavigateToDetail: (templateId: string) => void
): ColumnDef<TemplateRow>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'Template',
      size: 350,
      cell: ({ row }) => {
        const template = row.original
        const icon = typeIcons[template.type] || '📄'
        return (
          <div className="flex items-start gap-3">
            <div className="text-2xl">{icon}</div>
            <div className="flex flex-col gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigateToDetail(template.id)
                }}
                className="font-medium text-foreground hover:text-primary hover:underline text-start"
              >
                {template.name}
              </button>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {template.isFeatured && (
                  <Badge variant="default" className="text-xs">
                    ⭐ Featured
                  </Badge>
                )}
                {template.isOfficial && (
                  <Badge variant="default" className="text-xs bg-primary">
                    ✓ Official
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      enableHiding: true,
      cell: ({ getValue }) => {
        const type = getValue() as string
        const colorClass = typeColors[type] || 'bg-gray-100 text-gray-800'
        return (
          <Badge className={colorClass}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      enableHiding: true,
      cell: ({ getValue }) => {
        const category = getValue() as string
        return (
          <Badge variant="outline">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'sport',
      header: 'Sport',
      enableHiding: true,
      cell: ({ getValue }) => {
        const sport = getValue() as string
        return <span className="text-sm">{sport.charAt(0).toUpperCase() + sport.slice(1)}</span>
      },
    },
    {
      accessorKey: 'author',
      header: 'Author',
      enableHiding: true,
      cell: ({ row }) => {
        const template = row.original
        if (template.isOfficial) {
          return (
            <div className="flex items-center gap-2">
              <div className="font-semibold text-primary">SimpleAM</div>
            </div>
          )
        }
        return (
          <div className="flex items-center gap-2">
            {template.author && (
              <>
                <Avatar className="h-6 w-6">
                  {template.author.avatar ? (
                    <AvatarImage src={template.author.avatar} alt={template.author.name} />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {template.author.name?.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{template.author.name}</span>
                  {template.orgName && (
                    <span className="text-xs text-muted-foreground">{template.orgName}</span>
                  )}
                </div>
              </>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      enableHiding: true,
      cell: ({ row }) => {
        const template = row.original
        if (!template.rating) {
          return <span className="text-sm text-muted-foreground">No reviews</span>
        }
        return (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{template.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({template.reviewCount})</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'downloads',
      header: 'Downloads',
      enableHiding: true,
      cell: ({ getValue }) => {
        const downloads = getValue() as number
        return (
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{downloads.toLocaleString()}</span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const template = row.original
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onNavigateToDetail(template.id)
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        )
      },
    },
  ]
}

export function TemplatesTable({ templates, total: serverTotal, onOpenSubmitDialog }: TemplatesTableProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sportFilter, setSportFilter] = useState('all')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const isMounted = useRef(false)
  const isInitialUrlSync = useRef(true)
  const lastUrlSearchRef = useRef<string>('')
  const lastPathnameRef = useRef<string>('')

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = !search
        ? true
        : [template.name, template.description, ...template.tags]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(search.toLowerCase()))

      const matchesType = typeFilter === 'all' || template.type === typeFilter
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
      const matchesSport = sportFilter === 'all' || template.sport === sportFilter

      return matchesSearch && matchesType && matchesCategory && matchesSport
    })
  }, [templates, search, typeFilter, categoryFilter, sportFilter])

  const columns = useMemo(
    () => createColumns((templateId) => router.push(`/dashboard/templates/${templateId}`)),
    [router]
  )

  const uniqueTypes = useMemo(
    () => Array.from(new Set(templates.map((t) => t.type))).sort(),
    [templates]
  )

  const uniqueCategories = useMemo(
    () => Array.from(new Set(templates.map((t) => t.category))).sort(),
    [templates]
  )

  const uniqueSports = useMemo(
    () => Array.from(new Set(templates.map((t) => t.sport))).sort(),
    [templates]
  )

  const filterConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: 'search',
        label: 'Search',
        type: 'search',
        placeholder: 'Search templates...',
      },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: uniqueTypes.map((type) => ({
          value: type,
          label: type.charAt(0).toUpperCase() + type.slice(1),
        })),
        placeholder: 'All Types',
      },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: uniqueCategories.map((cat) => ({
          value: cat,
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
        })),
        placeholder: 'All Categories',
      },
      {
        key: 'sport',
        label: 'Sport',
        type: 'select',
        options: uniqueSports.map((sport) => ({
          value: sport,
          label: sport.charAt(0).toUpperCase() + sport.slice(1),
        })),
        placeholder: 'All Sports',
      },
    ],
    [uniqueTypes, uniqueCategories, uniqueSports]
  )

  const filterValues = useMemo(
    () => ({
      search,
      type: typeFilter,
      category: categoryFilter,
      sport: sportFilter,
    }),
    [search, typeFilter, categoryFilter, sportFilter]
  )

  const handleFilterChange = useCallback((key: string, value: string) => {
    if (key === 'search') setSearch(value)
    else if (key === 'type') setTypeFilter(value)
    else if (key === 'category') setCategoryFilter(value)
    else if (key === 'sport') setSportFilter(value)
  }, [])

  const tableInstance = useReactTable({
    data: filteredTemplates,
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    autoResetPageIndex: false,
  })

  const { pageIndex, pageSize } = pagination
  const totalTemplates = serverTotal ?? filteredTemplates.length
  const totalPages = Math.ceil(totalTemplates / pageSize)

  return (
    <div className="w-full min-w-0 max-w-full">
      <PageCard
        title="Templates Hub"
        description="Discover and share templates for forms, reports, drawings, plans, and spreadsheets"
        headerActions={
          onOpenSubmitDialog && (
            <Button onClick={onOpenSubmitDialog} className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
              <Upload className="me-2 h-4 w-4" />
              Share Template
            </Button>
          )
        }
        toolbar={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <DataTableFilters
              filters={filterConfig}
              values={filterValues}
              onFilterChange={handleFilterChange}
            />
            <DataTableColumnManager table={tableInstance} />
            <DataTableExport table={tableInstance} columns={columns} filename="templates" />
          </div>
        }
      >
        <DataTable
          data={filteredTemplates}
          columns={columns}
          sorting={sorting}
          onSortingChange={setSorting}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          pagination={pagination}
          onPaginationChange={setPagination}
          enableRowSelection={true}
          enableGrouping={false}
          enableColumnResizing={true}
          enableColumnReordering={false}
          enableColumnVisibility={true}
          enableBulkActions={true}
          enableExport={false}
          emptyMessage="No templates found matching your filters"
        />

        <div className="flex items-center justify-between min-w-0 pt-4">
          <div className="flex items-center gap-3 min-w-0">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTemplates.length} of {totalTemplates} templates
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
            <span className="text-sm">
              Page {pageIndex + 1} of {totalPages || 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPagination({ ...pagination, pageIndex: pageIndex + 1 })}
              disabled={pageIndex >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </PageCard>
    </div>
  )
}
