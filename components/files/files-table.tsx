'use client'

import { useMemo, useState, useEffect, useRef, useCallback, useTransition } from 'react'
import Image from 'next/image'
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
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageCard } from '@/components/ui/page-card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreHorizontal, Upload, Download, Eye, Edit, Trash2 } from 'lucide-react'
import {
  DataTable,
  DataTableFilters,
  DataTableColumnManager,
  DataTableExport,
  type FilterConfig,
} from '@/components/data-table'
import { useReactTable, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { formatDate } from '@/lib/date'
import { formatBytes, getFileIcon, getFileCategory } from '@/lib/files'
import { toast } from 'sonner'
import { FileUploadDialog } from './file-upload-dialog'
import { FilePreviewDialog } from './file-preview-dialog'
import { TablePageSkeleton } from '@/components/ui/skeleton-wrappers'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { deleteFile, bulkDeleteFiles, getFileDownloadUrl } from '@/app/actions/files'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export type FileRow = {
  id: string
  name: string
  originalName: string
  mimeType: string
  size: number
  url: string | null
  description: string | null
  tags: string[]
  visibility: string
  createdAt: Date
  uploadedBy: {
    id: string
    name: string
    email: string | null
    avatar: string | null
  }
  links?: Array<{
    targetType: string
    targetId: string
  }>
}

type FilesTableProps = {
  files: FileRow[]
  total?: number
}

const createColumns = (
  t: ReturnType<typeof useTranslations>,
  onPreview: (file: FileRow) => void,
  onDownload: (file: FileRow) => void,
  onDelete: (file: FileRow) => void,
  preferences?: { timezone: string | null; dateFormat: string | null; timeFormat: string | null } | null
): ColumnDef<FileRow>[] => {
  return [
    {
      accessorKey: 'name',
      header: t('files.name'),
      size: 300,
      cell: ({ row }) => {
        const file = row.original
        const category = getFileCategory(file.mimeType)

        return (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {file.mimeType.startsWith('image/') && file.url ? (
                <Image
                  src={file.url}
                  alt={file.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded object-cover"
                  unoptimized={!file.url?.includes('supabase.co')}
                />
              ) : (
                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium uppercase">
                    {file.mimeType.split('/')[1]?.substring(0, 3) || 'file'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPreview(file)
                }}
                className="font-medium text-foreground hover:text-primary hover:underline text-start truncate"
              >
                {file.name}
              </button>
              {file.description && (
                <span className="text-xs text-muted-foreground truncate">
                  {file.description}
                </span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'mimeType',
      header: t('files.type'),
      enableHiding: true,
      size: 120,
      cell: ({ getValue }) => {
        const mimeType = getValue() as string
        const category = getFileCategory(mimeType)
        return (
          <Badge variant="outline" className="capitalize">
            {category}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'size',
      header: t('files.size'),
      enableHiding: true,
      size: 100,
      cell: ({ getValue }) => {
        const size = getValue() as number
        return <span className="text-sm">{formatBytes(size)}</span>
      },
    },
    {
      accessorKey: 'uploadedBy',
      header: t('files.uploadedBy'),
      enableHiding: true,
      size: 180,
      cell: ({ getValue }) => {
        const user = getValue() as FileRow['uploadedBy']
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="text-xs">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm truncate">{user.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('files.uploaded'),
      enableHiding: true,
      size: 130,
      cell: ({ getValue }) => {
        const date = getValue() as Date
        return (
          <span className="text-sm" suppressHydrationWarning>
            {formatDate(date, preferences || undefined)}
          </span>
        )
      },
    },
    {
      accessorKey: 'tags',
      header: t('files.tags'),
      enableHiding: true,
      enableSorting: false,
      size: 200,
      cell: ({ getValue }) => {
        const tags = getValue() as string[]
        if (!tags?.length) {
          return <span className="text-sm text-muted-foreground">—</span>
        }
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'visibility',
      header: t('files.visibility'),
      enableHiding: true,
      size: 120,
      cell: ({ getValue }) => {
        const visibility = getValue() as string
        return (
          <Badge variant="outline" className="capitalize">
            {visibility}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">{t('common.actions')}</span>,
      size: 80,
      cell: ({ row }) => {
        const file = row.original
        return (
          <div className="flex justify-end">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onPreview(file)}>
                  <Eye className="h-4 w-4 me-2" />
                  {t('files.preview')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(file)}>
                  <Download className="h-4 w-4 me-2" />
                  {t('files.download')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(file)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 me-2" />
                  {t('files.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}

export function FilesTable({ files, total: serverTotal }: FilesTableProps) {
  const router = useRouter()
  const t = useTranslations()
  const [isRefreshing, startRefreshTransition] = useTransition()

  // State
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
  const [grouping, setGrouping] = useState<GroupingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  // Dialogs
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileRow | null>(null)
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const refreshData = useCallback(() => {
    startRefreshTransition(() => router.refresh())
  }, [router, startRefreshTransition])

  // Filter files
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch = !search
        ? true
        : [file.name, file.description, ...file.tags]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(search.toLowerCase()))

      const matchesType =
        typeFilter === 'all' ||
        getFileCategory(file.mimeType) === typeFilter

      const matchesVisibility =
        visibilityFilter === 'all' || file.visibility === visibilityFilter

      return matchesSearch && matchesType && matchesVisibility
    })
  }, [files, search, typeFilter, visibilityFilter])

  const handlePreview = useCallback((file: FileRow) => {
    setPreviewFile(file)
  }, [])

  const handleDownload = useCallback(async (file: FileRow) => {
    try {
      const result = await getFileDownloadUrl(file.id)
      if (result.error) {
        toast.error(result.error)
      } else if (result.url) {
        // Trigger download
        const a = document.createElement('a')
        a.href = result.url
        a.download = result.filename || file.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        toast.success(t('files.downloadStarted'))
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error(t('files.downloadFailed'))
    }
  }, [t])

  const handleDelete = useCallback((file: FileRow) => {
    setDeleteFileId(file.id)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!deleteFileId) return

    setIsDeleting(true)
    try {
      const result = await deleteFile(deleteFileId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(t('files.deleteSuccess'))
        refreshData()
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(t('files.deleteFailed'))
    } finally {
      setIsDeleting(false)
      setDeleteFileId(null)
    }
  }, [deleteFileId, router, t])

  const columns = useMemo(
    () => createColumns(t, handlePreview, handleDownload, handleDelete),
    [t, handlePreview, handleDownload, handleDelete]
  )

  // Get unique values for filters
  const uniqueTypes = useMemo(() => {
    const types = new Set(files.map((f) => getFileCategory(f.mimeType)))
    return Array.from(types).sort()
  }, [files])

  const uniqueVisibilities = useMemo(() => {
    const visibilities = new Set(files.map((f) => f.visibility))
    return Array.from(visibilities).sort()
  }, [files])

  const filterConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: 'search',
        label: t('common.search'),
        type: 'search',
        placeholder: t('files.searchFiles'),
      },
      {
        key: 'type',
        label: t('files.type'),
        type: 'select',
        options: uniqueTypes.map((type) => ({
          value: type,
          label: type.charAt(0).toUpperCase() + type.slice(1),
        })),
        placeholder: t('files.allTypes'),
      },
      {
        key: 'visibility',
        label: t('files.visibility'),
        type: 'select',
        options: uniqueVisibilities.map((vis) => ({
          value: vis,
          label: vis.charAt(0).toUpperCase() + vis.slice(1),
        })),
        placeholder: t('files.allVisibilities'),
      },
    ],
    [uniqueTypes, uniqueVisibilities, t]
  )

  const filterValues = useMemo(
    () => ({
      search,
      type: typeFilter,
      visibility: visibilityFilter,
    }),
    [search, typeFilter, visibilityFilter]
  )

  const handleFilterChange = useCallback((key: string, value: string) => {
    if (key === 'search') setSearch(value)
    else if (key === 'type') setTypeFilter(value)
    else if (key === 'visibility') setVisibilityFilter(value)
  }, [])

  const tableInstance = useReactTable({
    data: filteredFiles,
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
    autoResetPageIndex: false,
  })

  const { pageIndex, pageSize } = pagination
  const totalFiles = serverTotal ?? filteredFiles.length
  const totalPages = Math.ceil(totalFiles / pageSize)

  if (isRefreshing) {
    return <TablePageSkeleton rows={pageSize} />
  }

  return (
    <div className="w-full min-w-0 max-w-full">
      <PageCard
        variant="table"
        title={t('files.title')}
        description={t('files.description')}
        headerActions={
          <Button
            onClick={() => setIsUploadOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            type="button"
          >
            <Upload className="me-2 h-4 w-4" />
            {t('files.uploadFiles')}
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
              filename="files"
            />
          </div>
        }
      >
        <DataTable
          data={filteredFiles}
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
          emptyMessage={t('files.noFilesFound')}
        />

        <div className="flex items-center justify-between min-w-0 mt-4">
          <div className="flex items-center gap-3 min-w-0">
            <Select
              value={String(pageSize)}
              onValueChange={(value) =>
                setPagination({ pageIndex: 0, pageSize: Number(value) })
              }
            >
              <SelectTrigger className="h-9 w-[120px]">
                <SelectValue placeholder={t('common.rowsPerPage')} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} {t('common.rows')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {t('common.showing')} {filteredFiles.length} {t('common.of')} {totalFiles} {t('files.files')} · {t('common.page')} {pageIndex + 1} {t('common.of')}{' '}
              <strong>{totalPages}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPagination({ ...pagination, pageIndex: pageIndex - 1 })}
              disabled={pageIndex === 0}
            >
              {t('common.previous')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPagination({ ...pagination, pageIndex: pageIndex + 1 })}
              disabled={pageIndex >= totalPages - 1}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      </PageCard>

      {/* Upload Dialog */}
      <FileUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onSuccess={refreshData}
      />

      {/* Preview Dialog */}
      <FilePreviewDialog
        open={previewFile !== null}
        onOpenChange={(open) => !open && setPreviewFile(null)}
        file={previewFile}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteFileId !== null} onOpenChange={(open) => !open && setDeleteFileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('files.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('files.deleteConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? t('files.deleting') : t('files.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
