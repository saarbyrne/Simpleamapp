'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Grid3x3, List } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'grid' | 'list'
export type SortOption = 'recent' | 'name' | 'created' | 'updated'

type SpreadsheetFiltersProps = {
  searchQuery: string
  onSearchChange: (query: string) => void

  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void

  sortBy: SortOption
  onSortChange: (sort: SortOption) => void

  selectedTags: string[]
  availableTags: string[]
  onTagsChange: (tags: string[]) => void

  showStarred: boolean
  onShowStarredChange: (show: boolean) => void
}

export function SpreadsheetFilters({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  selectedTags,
  availableTags,
  onTagsChange,
  showStarred,
  onShowStarredChange,
}: SpreadsheetFiltersProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  // Determine current filter value for the select
  const getFilterValue = () => {
    if (showStarred) return 'starred'
    if (selectedTags.length > 0) return selectedTags[0]
    return 'all'
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Search */}
      <div className="relative w-[240px] flex items-center border border-input rounded-md px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50 h-10 bg-background">
        <Search className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
        <Input
          placeholder="Search spreadsheets..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 px-0 py-0 h-full flex-1"
        />
      </div>

      {/* Filter Select */}
      <Select 
        value={getFilterValue()} 
        onValueChange={(value) => {
          if (value === 'all') {
            onShowStarredChange(false)
            onTagsChange([])
          } else if (value === 'starred') {
            onShowStarredChange(true)
            onTagsChange([])
          } else {
            onShowStarredChange(false)
            onTagsChange([value])
          }
        }}
      >
        <SelectTrigger className="w-[140px] h-10">
          <SelectValue placeholder="Filter by tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="starred">Starred</SelectItem>
          {availableTags.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Recent</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="created">Created</SelectItem>
          <SelectItem value="updated">Updated</SelectItem>
        </SelectContent>
      </Select>

      {/* View Mode Toggle */}
      <div className="flex border border-input rounded-md overflow-hidden bg-background">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className={cn(
            'rounded-none border-0 h-10',
            viewMode === 'grid' ? 'bg-background' : 'bg-transparent hover:bg-accent'
          )}
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewModeChange('list')}
          className={cn(
            'rounded-none border-0 border-l border-input h-10',
            viewMode === 'list' ? 'bg-background' : 'bg-transparent hover:bg-accent'
          )}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
