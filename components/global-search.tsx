'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Users,
  Calendar,
  FileText,
  ClipboardList,
  File,
  Table2,
  Layout,
  ListTree,
  Loader2,
  X,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { cn } from '@/components/ui/utils'
import { globalSearch, SearchResult, SearchEntityType } from '@/app/actions/search'

// Icons for different entity types
const entityIcons: Record<SearchEntityType, React.ComponentType<{ className?: string }>> = {
  player: Users,
  note: FileText,
  event: Calendar,
  form: ClipboardList,
  form_template: ClipboardList,
  file: File,
  spreadsheet: Table2,
  spreadsheet_template: Table2,
  event_template: Calendar,
  canvas: Layout,
  plan: ListTree,
}

// Display names for entity types
const entityLabels: Record<SearchEntityType, string> = {
  player: 'Players',
  note: 'Notes',
  event: 'Events',
  form: 'Forms',
  form_template: 'Form Templates',
  file: 'Files',
  spreadsheet: 'Spreadsheets',
  spreadsheet_template: 'Spreadsheet Templates',
  event_template: 'Event Templates',
  canvas: 'Canvas Boards',
  plan: 'Plans',
}

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = React.useState<SearchEntityType | 'all'>('all')

  // Debounced search
  React.useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const timer = setTimeout(async () => {
      try {
        const filterTypes = selectedFilter === 'all' ? undefined : [selectedFilter]
        const response = await globalSearch(query, { entityTypes: filterTypes })

        if ('error' in response) {
          setError(response.error)
          setResults([])
        } else {
          setResults(response.data.results)
        }
      } catch (err) {
        setError('Failed to perform search')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, selectedFilter])

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
      setError(null)
      setSelectedFilter('all')
    }
  }, [open])

  // Group results by entity type
  const groupedResults = React.useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}

    results.forEach((result) => {
      const type = result.type
      if (!groups[type]) {
        groups[type] = []
      }
      groups[type].push(result)
    })

    return groups
  }, [results])

  // Handle result selection
  const handleSelect = (result: SearchResult) => {
    router.push(result.url)
    onOpenChange(false)
  }

  // Get recent searches from localStorage
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const recent = localStorage.getItem('recentSearches')
      if (recent) {
        setRecentSearches(JSON.parse(recent).slice(0, 5))
      }
    }
  }, [open])

  // Save search to recent searches
  const saveRecentSearch = (searchQuery: string) => {
    if (typeof window !== 'undefined' && searchQuery.length >= 2) {
      const recent = localStorage.getItem('recentSearches')
      const searches = recent ? JSON.parse(recent) : []
      const updated = [searchQuery, ...searches.filter((s: string) => s !== searchQuery)].slice(0, 5)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    }
  }

  // Trigger search when user presses Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.length >= 2) {
      saveRecentSearch(query)
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} className="max-w-2xl" shouldFilter={false}>
      <CommandInput
        placeholder="Search players, events, notes, forms..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={handleKeyDown}
      />

      <CommandList className="max-h-[400px]">
        {/* Empty State */}
        {!query && (
          <div className="py-6 px-4 text-center">
            <Search className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Search across players, events, notes, forms and more
            </p>

            {recentSearches.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2 text-start">
                  Recent searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery(search)}
                      className="text-xs h-7"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && query.length >= 2 && (
          <div className="py-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12 px-4 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-3" />
            <p className="text-sm font-medium mb-2">Unable to perform search</p>
            <p className="text-xs text-muted-foreground mb-4">
              Please check your connection and try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setError(null)
                const currentQuery = query
                setQuery('')
                setTimeout(() => setQuery(currentQuery), 100)
              }}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && query.length >= 2 && results.length === 0 && (
          <div className="py-12 px-4 text-center">
            <Search className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-2">No results found for &quot;{query}&quot;</p>
            <p className="text-xs text-muted-foreground mb-4">Try:</p>
            <ul className="text-xs text-muted-foreground text-start mb-4 space-y-1">
              <li>• Check your spelling</li>
              <li>• Use different keywords</li>
              <li>• Try more general terms</li>
            </ul>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Or browse:</p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard/players')}
                >
                  <Users className="h-3 w-3 me-1" />
                  Players
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard/calendar')}
                >
                  <Calendar className="h-3 w-3 me-1" />
                  Events
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard/notes')}
                >
                  <FileText className="h-3 w-3 me-1" />
                  Notes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results State */}
        {!loading && !error && results.length > 0 && (
          <>
            <div className="px-2 py-2 text-xs text-muted-foreground border-b">
              {results.length} result{results.length === 1 ? '' : 's'} found
            </div>
            {Object.entries(groupedResults).map(([type, groupResults], index) => {
              const Icon = entityIcons[type as SearchEntityType]
              const label = entityLabels[type as SearchEntityType]

              return (
                <React.Fragment key={type}>
                  {index > 0 && <CommandSeparator />}
                  <CommandGroup heading={label}>
                    {groupResults.map((result) => (
                      <CommandItem
                        key={result.id}
                        value={`${result.type}-${result.id}-${result.title}`}
                        onSelect={() => handleSelect(result)}
                        className="cursor-pointer"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{result.title}</span>
                            {result.metadata.status && (
                              <Badge
                                variant={
                                  result.metadata.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className="text-xs"
                              >
                                {result.metadata.status}
                              </Badge>
                            )}
                          </div>
                          {(result.description || result.excerpt) && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {result.description || result.excerpt}
                            </p>
                          )}
                          {/* Entity-specific metadata */}
                          {result.type === 'player' && result.metadata.position && (
                            <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                              {result.metadata.position && <span>{result.metadata.position}</span>}
                              {result.metadata.jerseyNumber && (
                                <span>#{result.metadata.jerseyNumber}</span>
                              )}
                            </div>
                          )}
                          {result.type === 'event' && result.metadata.location && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {result.metadata.location}
                            </p>
                          )}
                          {result.type === 'note' && result.metadata.author && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              by {result.metadata.author}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 ml-2 flex-shrink-0" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </React.Fragment>
              )
            })}
          </>
        )}

        <CommandEmpty />
      </CommandList>

      {/* Footer hint */}
      {query.length >= 2 && results.length > 0 && (
        <div className="border-t p-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span>to navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <Kbd>Enter</Kbd>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-2">
            <Kbd>Esc</Kbd>
            <span>to close</span>
          </div>
        </div>
      )}
    </CommandDialog>
  )
}

/**
 * Search trigger button for navigation
 */
export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      className="relative h-9 w-56 md:w-64 lg:w-72 justify-start text-sm text-muted-foreground"
      onClick={onClick}
    >
      <Search className="me-2 h-4 w-4" />
      <span className="inline-flex">Search...</span>
    </Button>
  )
}

/**
 * Hook to handle keyboard shortcut for opening search
 */
export function useSearchShortcut(onOpen: () => void) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault()
        onOpen()
      }

      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpen()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [onOpen])
}
