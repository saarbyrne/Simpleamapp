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
import { useRouter, usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageCard } from '@/components/ui/page-card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus, Eye, Copy, Send, FileText, Edit } from 'lucide-react'
import { FormBuilderDialog } from '@/components/dashboard/form-builder-dialog'
import { FormDistributionDialog } from '@/components/dashboard/form-distribution-dialog'
import { FormPreviewDialog } from '@/components/dashboard/form-preview-dialog'
import { duplicateForm } from '@/app/actions/forms'
import { toast } from 'sonner'
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
import { BulkActionsBar, type BulkField } from '@/components/ui/bulk-actions-bar'
import { useReactTable, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { formatDate } from '@/lib/date-utils'

export type FormRow = {
  id: string
  title: string
  category: string
  status: string
  responses: number
  updated: Date | string
  owner: string
}

type FormsTableProps = {
  forms: FormRow[]
  total?: number
}

const statusVariants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Active: 'default',
  Draft: 'secondary',
  Archived: 'outline',
}

const statusLabel = (value: string) => {
  const normalized = value?.toLowerCase()
  if (normalized === 'active') return 'Active'
  if (normalized === 'draft') return 'Draft'
  if (normalized === 'archived') return 'Archived'
  return value ? value.replace(/(^|\s)\S/g, (c) => c.toUpperCase()) : 'Unknown'
}

const titleCase = (value: string | null | undefined) => {
  if (!value) return ''
  return value
    .split(/[\s-_]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

const createColumns = (
  forms: FormRow[],
  preferences?: { timezone: string | null; dateFormat: string | null; timeFormat: string | null } | null,
  onDistribute?: (formId: string, formName: string) => void,
  onViewResponses?: (formId: string) => void,
  onPreview?: (formId: string) => void,
  onEdit?: (formId: string) => void,
  onDuplicate?: (formId: string) => void
): ColumnDef<FormRow>[] => {
  const columns: ColumnDef<FormRow>[] = [
    {
      accessorKey: 'title',
      header: 'Form',
      size: 280,
      cell: ({ row }) => {
        const form = row.original
        return (
          <div className="flex flex-col">
            <div className="font-medium">{form.title}</div>
            <p className="text-xs text-muted-foreground">{form.id}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      enableHiding: true,
      cell: ({ getValue }) => (
        <span>{titleCase(getValue() as string | null) || '—'}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableHiding: true,
      cell: ({ getValue }) => {
        const status = (getValue() as string) ?? ''
        const variant = statusVariants[status] ?? 'default'
        return (
          <Badge variant={variant}>
            {statusLabel(status)}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'responses',
      header: 'Responses',
      enableHiding: true,
      cell: ({ getValue }) => {
        const value = getValue() as number | null | undefined
        return <span className="text-sm font-medium">{value ?? 0}</span>
      },
    },
    {
      accessorKey: 'updated',
      header: 'Last updated',
      enableHiding: true,
      cell: ({ getValue }) => {
        const updated = getValue() as Date | string | null | undefined
        if (!updated) return <span className="text-sm text-muted-foreground">—</span>
        const date = typeof updated === 'string' ? new Date(updated) : updated
        return (
          <span className="text-sm">
            {formatDate(date, preferences || undefined)}
          </span>
        )
      },
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      enableHiding: true,
      cell: ({ getValue }) => (
        <span>{getValue() as string || '—'}</span>
      ),
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const form = row.original
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onDistribute?.(form.id, form.title)}
                >
                  <Send className="me-2 h-4 w-4" />
                  Distribute
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPreview?.(form.id)}>
                  <Eye className="me-2 h-4 w-4" />
                  Preview form
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(form.id)}>
                  <Copy className="me-2 h-4 w-4" />
                  Duplicate form
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewResponses?.(form.id)}>
                  <FileText className="me-2 h-4 w-4" />
                  View responses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(form.id)}>
                  <Edit className="me-2 h-4 w-4" />
                  Edit form
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  return columns
}

function normalizeFilter(value: string | null | undefined) {
  return value?.toLowerCase().trim() ?? ''
}

export function FormsTable({ forms, total: serverTotal }: FormsTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { preferences } = useUserPreferences()
  
  // Initialize state with default values
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({
    title: 280,
  })
  const [grouping, setGrouping] = useState<GroupingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false)
  const [editingFormId, setEditingFormId] = useState<string | null>(null)
  const [previewFormId, setPreviewFormId] = useState<string | null>(null)
  const [distributionFormId, setDistributionFormId] = useState<string | null>(null)
  const [distributionFormName, setDistributionFormName] = useState<string>('')

  // Track if component has mounted to prevent initial URL update
  const isMounted = useRef(false)
  const lastUrlSearchRef = useRef<string>('')
  const lastPathnameRef = useRef<string>('')
  const STORAGE_KEY = 'forms-table-filters'

  // Function to save filters to localStorage
  const saveFiltersToStorage = useCallback((filters: {
    search: string
    category: string
    status: string
    owner: string
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
    if (!isMounted.current) return
    
    const currentSearch = window.location.search
    const currentPathname = window.location.pathname
    
    if (currentPathname !== lastPathnameRef.current) {
      lastPathnameRef.current = currentPathname
      lastUrlSearchRef.current = ''
    }
    
    const params = new URLSearchParams(currentSearch)
    
    const urlSearch = params.get('search')
    const urlCategory = params.get('category')
    const urlStatus = params.get('status')
    const urlOwner = params.get('owner')
    const urlPage = params.get('page')
    const urlPageSize = params.get('pageSize')
    const urlSort = params.get('sort')
    const urlVisibility = params.get('visibility')
    
    const hasUrlParams = urlSearch !== null || urlCategory !== null || urlStatus !== null || 
                         urlOwner !== null || urlPage !== null || urlPageSize !== null ||
                         urlSort !== null || urlVisibility !== null
    
    const currentStateSignature = `${currentSearch}-${hasUrlParams}`
    
    if (currentStateSignature === lastUrlSearchRef.current) return
    
    lastUrlSearchRef.current = currentStateSignature
    
    startTransition(() => {
      if (hasUrlParams) {
        setSearch(urlSearch || '')
        setCategoryFilter(urlCategory || 'all')
        setStatusFilter(urlStatus || 'all')
        setOwnerFilter(urlOwner || 'all')
        
        const pageNum = urlPage ? parseInt(urlPage, 10) : 0
        const pageSizeNum = urlPageSize ? parseInt(urlPageSize, 10) : 20
        setPagination({
          pageIndex: !isNaN(pageNum) ? pageNum : 0,
          pageSize: !isNaN(pageSizeNum) ? pageSizeNum : 20,
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
        const stored = loadFiltersFromStorage()
        if (stored) {
          setSearch(stored.search || '')
          setCategoryFilter(stored.category || 'all')
          setStatusFilter(stored.status || 'all')
          setOwnerFilter(stored.owner || 'all')
          setPagination({
            pageIndex: stored.pageIndex || 0,
            pageSize: stored.pageSize || 20,
          })
          setSorting(stored.sorting || [])
          setColumnVisibility(stored.visibility || {})
        } else {
          setSearch('')
          setCategoryFilter('all')
          setStatusFilter('all')
          setOwnerFilter('all')
          setPagination({ pageIndex: 0, pageSize: 20 })
          setSorting([])
          setColumnVisibility({})
        }
      }
    })
  }, [loadFiltersFromStorage])

  // Read URL params on mount and when URL/pathname changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    isMounted.current = true
    
    const timeoutId = setTimeout(() => {
      lastPathnameRef.current = pathname
      syncStateFromURL()
    }, 0)
    
    const handlePopState = () => {
      syncStateFromURL()
    }
    
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [syncStateFromURL, pathname])

  useEffect(() => {
    if (!isMounted.current || typeof window === 'undefined') return
    if (pathname !== lastPathnameRef.current) {
      lastPathnameRef.current = pathname
      setTimeout(() => {
        syncStateFromURL()
      }, 0)
    }
  }, [pathname, syncStateFromURL])

  // Update URL params when filters change
  useEffect(() => {
    if (!isMounted.current || typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    
    if (categoryFilter !== 'all') {
      params.set('category', categoryFilter)
    } else {
      params.delete('category')
    }
    
    if (statusFilter !== 'all') {
      params.set('status', statusFilter)
    } else {
      params.delete('status')
    }
    
    if (ownerFilter !== 'all') {
      params.set('owner', ownerFilter)
    } else {
      params.delete('owner')
    }
    
    if (pagination.pageIndex > 0) {
      params.set('page', String(pagination.pageIndex))
    } else {
      params.delete('page')
    }
    
    if (pagination.pageSize !== 20) {
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
    
    const currentURL = window.location.pathname + window.location.search
    if (newURL !== currentURL) {
      router.replace(newURL, { scroll: false })
    }
    
    saveFiltersToStorage({
      search,
      category: categoryFilter,
      status: statusFilter,
      owner: ownerFilter,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      visibility: columnVisibility,
    })
  }, [search, categoryFilter, statusFilter, ownerFilter, pagination.pageIndex, pagination.pageSize, sorting, columnVisibility, router, saveFiltersToStorage])

  const uniqueCategories = useMemo(
    () =>
      Array.from(
        new Set(
          forms
            .map((form) => form.category)
            .filter((cat): cat is string => Boolean(cat))
        )
      ).sort(),
    [forms]
  )

  const uniqueStatuses = useMemo(
    () =>
      Array.from(
        new Set(forms.map((form) => normalizeFilter(form.status)).filter(Boolean))
      ).sort(),
    [forms]
  )

  const uniqueOwners = useMemo(
    () =>
      Array.from(
        new Set(
          forms
            .map((form) => form.owner)
            .filter((owner): owner is string => Boolean(owner))
        )
      ).sort(),
    [forms]
  )

  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      const matchesSearch = !search
        ? true
        : [form.title, form.id, form.owner]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(search.toLowerCase()))

      const matchesCategory =
        categoryFilter === 'all' ||
        normalizeFilter(form.category) === categoryFilter

      const matchesStatus =
        statusFilter === 'all' || normalizeFilter(form.status) === statusFilter

      const matchesOwner =
        ownerFilter === 'all' ||
        normalizeFilter(form.owner) === ownerFilter

      return matchesSearch && matchesCategory && matchesStatus && matchesOwner
    })
  }, [forms, search, categoryFilter, statusFilter, ownerFilter])

  const columns = useMemo(
    () => createColumns(
      forms,
      preferences || null,
      (formId, formName) => {
        setDistributionFormId(formId)
        setDistributionFormName(formName)
      },
      (formId) => {
        router.push(`/dashboard/forms/${formId}/responses`)
      },
      (formId) => {
        setPreviewFormId(formId)
      },
      (formId) => {
        setEditingFormId(formId)
      },
      async (formId) => {
        try {
          const result = await duplicateForm(formId)
          if (result.error) {
            toast.error(result.error)
          } else {
            toast.success('Form duplicated successfully')
            router.refresh()
          }
        } catch (error) {
          console.error('Error duplicating form:', error)
          toast.error('Failed to duplicate form')
        }
      }
    ),
    [forms, preferences, router]
  )

  // Prepare filter config for DataTableFilters
  const filterConfig: FilterConfig[] = useMemo(() => [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search forms...',
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: uniqueCategories.map((cat) => ({
        value: cat,
        label: titleCase(cat),
      })),
      placeholder: 'All Categories',
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
      key: 'owner',
      label: 'Owner',
      type: 'select',
      options: uniqueOwners.map((owner) => ({
        value: owner,
        label: owner,
      })),
      placeholder: 'All Owners',
    },
  ], [uniqueCategories, uniqueStatuses, uniqueOwners])

  const filterValues = useMemo(() => ({
    search,
    category: categoryFilter,
    status: statusFilter,
    owner: ownerFilter,
  }), [search, categoryFilter, statusFilter, ownerFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    if (key === 'search') setSearch(value)
    else if (key === 'category') setCategoryFilter(value)
    else if (key === 'status') setStatusFilter(value)
    else if (key === 'owner') setOwnerFilter(value)
  }, [])

  // Create a table instance for export/column manager utilities
  const tableInstance = useReactTable({
    data: filteredForms,
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
    autoResetPageIndex: false, // Prevent auto-reset pagination during render
  })

  // Handle bulk update (using InlineBulkActions component)
  const handleBulkUpdate = useCallback(async (updates: {
    status?: 'Active' | 'Draft' | 'Archived' | null
    category?: string | null
  }) => {
    setIsBulkUpdating(true)
    try {
      // Get selected form IDs from the table instance
      const selectedRows = tableInstance.getFilteredSelectedRowModel().rows
      const selectedIds = selectedRows.map((row) => row.original.id)

      if (selectedIds.length === 0) {
        alert('No forms selected')
        setIsBulkUpdating(false)
        return
      }

      // TODO: Implement bulk update when forms actions are available
      console.log('Bulk update forms:', selectedIds, updates)
      // await bulkUpdateForms(selectedIds, updates)
      
      // Clear selection and refresh
      setRowSelection({})
      router.refresh()
    } catch (error) {
      console.error('Error updating forms:', error)
      alert('Failed to update forms')
    } finally {
      setIsBulkUpdating(false)
    }
  }, [tableInstance, router, setRowSelection])

  const { pageIndex, pageSize } = pagination
  const totalForms = serverTotal ?? filteredForms.length
  const totalPages = Math.ceil(totalForms / pageSize)

  // Handle pagination change
  const handlePaginationChange = useCallback((newPagination: PaginationState) => {
    const params = new URLSearchParams(window.location.search)
    
    if (newPagination.pageIndex > 0) {
      params.set('page', String(newPagination.pageIndex))
    } else {
      params.delete('page')
    }
    
    if (newPagination.pageSize !== 20) {
      params.set('pageSize', String(newPagination.pageSize))
    } else {
      params.delete('pageSize')
    }
    
    const newURL = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname
    
    router.push(newURL)
  }, [router])

  return (
    <div className="w-full min-w-0 max-w-full">
      <FormBuilderDialog
        open={isFormBuilderOpen && !editingFormId}
        onOpenChange={(open) => {
          if (!open) setIsFormBuilderOpen(false)
        }}
        onSuccess={() => {
          router.refresh()
        }}
      />
      <FormBuilderDialog
        open={!!editingFormId}
        formId={editingFormId}
        onOpenChange={(open) => {
          if (!open) setEditingFormId(null)
        }}
        onSuccess={() => {
          setEditingFormId(null)
          router.refresh()
        }}
      />
      <FormPreviewDialog
        open={!!previewFormId}
        formId={previewFormId}
        onOpenChange={(open) => {
          if (!open) setPreviewFormId(null)
        }}
      />
      {distributionFormId && (
        <FormDistributionDialog
          open={!!distributionFormId}
          onOpenChange={(open) => {
            if (!open) {
              setDistributionFormId(null)
              setDistributionFormName('')
            }
          }}
          formId={distributionFormId}
          formName={distributionFormName}
          onSuccess={() => {
            router.refresh()
          }}
        />
      )}
      <PageCard
        title="Forms"
        description="Manage your forms and review submissions."
        headerActions={
          <Button 
            onClick={() => setIsFormBuilderOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            type="button"
          >
            <Plus className="me-2 h-4 w-4" />
            Create form
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
              filename="forms"
            />
          </div>
        }
      >
          {/* Inline bulk actions using BulkActionsBar directly */}
          {Object.keys(rowSelection).length > 0 && (
            <BulkActionsBar
              selectedCount={Object.keys(rowSelection).length}
              fields={[
                ...(uniqueCategories.length > 0 ? [{
                  id: 'category',
                  type: 'select' as const,
                  placeholder: 'Category',
                  width: 'w-[160px]',
                  options: uniqueCategories.map((cat) => ({
                    value: cat,
                    label: cat,
                  })),
                }] : []),
                {
                  id: 'status',
                  type: 'select' as const,
                  placeholder: 'Status',
                  width: 'w-[130px]',
                  allowClear: false,
                  options: [
                    { value: 'Active', label: 'Active' },
                    { value: 'Draft', label: 'Draft' },
                    { value: 'Archived', label: 'Archived' },
                  ],
                },
              ]}
              onSave={async (values) => {
                const updates: {
                  status?: 'Active' | 'Draft' | 'Archived' | null
                  category?: string | null
                } = {}
                
                if (values.status && ['Active', 'Draft', 'Archived'].includes(values.status)) {
                  updates.status = values.status as 'Active' | 'Draft' | 'Archived'
                }
                
                if (values.category !== undefined) {
                  updates.category = values.category || null
                }
                
                await handleBulkUpdate(updates)
              }}
              onClear={() => setRowSelection({})}
              isLoading={isBulkUpdating}
              itemLabel="form"
            />
          )}

          <DataTable
            data={filteredForms}
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
            enableBulkActions={false}
            enableExport={false}
            emptyMessage="No forms match the filters."
          />

          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <Select
                value={String(pageSize)}
                onValueChange={(value) => handlePaginationChange({ pageIndex: 0, pageSize: Number(value) })}
              >
                <SelectTrigger className="h-9 w-[120px]">
                  <SelectValue placeholder="Rows per page" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} rows
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Showing {filteredForms.length} of {totalForms} forms · Page {pageIndex + 1} of{' '}
                <strong>{totalPages}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePaginationChange({ ...pagination, pageIndex: pageIndex - 1 })}
                disabled={pageIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePaginationChange({ ...pagination, pageIndex: pageIndex + 1 })}
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

