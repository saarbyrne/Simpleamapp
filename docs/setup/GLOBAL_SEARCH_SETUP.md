# Global Search Setup Instructions

This document provides step-by-step instructions for setting up the global search feature.

## Prerequisites

- Supabase database connection configured
- Prisma client generated (`npm run db:generate`)

## Database Migration

The global search feature requires adding full-text search capabilities to your database. This involves:
1. Adding `search_vector` columns to tables
2. Creating GIN indexes for fast searching
3. Setting up triggers to auto-update search vectors

### Running the Migration

**Option 1: Using Supabase SQL Editor (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New query**
4. Copy the contents of `/prisma/add-search-vectors.sql`
5. Paste into the editor
6. Click **Run** to execute the migration

**Option 2: Using psql (if you have direct database access)**

```bash
psql $DATABASE_URL -f prisma/add-search-vectors.sql
```

**Option 3: Using Supabase CLI**

```bash
supabase db push --file prisma/add-search-vectors.sql
```

### Verification

After running the migration, verify it was successful:

```sql
-- Check that search_vector columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Person' AND column_name = 'search_vector';

-- Check that indexes were created
SELECT indexname
FROM pg_indexes
WHERE tablename = 'Person' AND indexname = 'person_search_idx';

-- Test a simple search
SELECT "firstName", "lastName"
FROM "Person"
WHERE search_vector @@ to_tsquery('english', 'john:*')
LIMIT 5;
```

## Feature Overview

The global search feature provides:

### 1. Searchable Entities

- **Players** - Search by name, email, phone, position, jersey number
- **Notes** - Search by title, content, tags (with privacy filtering)
- **Events** - Search by title, description, location, type
- **Forms** - Search by name, description, category
- **Form Templates** - Search by name, description, category
- **Files** - Search by filename, tags
- **Spreadsheets** - Search by name, description, category
- **Spreadsheet Templates** - Search by name, description
- **Event Templates** - Search by name, description, type
- **Canvas Boards** - Search by name
- **Plans** - Search by name, description

### 2. Security Features

- **Organization Isolation**: Users can only search within their organization
- **Privacy Filtering**: Notes respect privacy levels (public, medical, coaching, private)
- **Role-Based Access**: Search results filtered based on user permissions
- **Audit Logging**: All searches are logged for security and analytics

### 3. UI Features

- **Keyboard Shortcuts**:
  - Press `/` to open search
  - Press `Cmd/Ctrl + K` to open search
  - Use `↑↓` to navigate results
  - Press `Enter` to select
  - Press `Esc` to close
- **Search Trigger**: Button in header with keyboard shortcut hint
- **Multiple States**:
  - Empty state with recent searches and quick access
  - Loading state with spinner
  - Results state with grouped results by entity type
  - No results state with helpful tips
  - Error state with retry option
- **Recent Searches**: Stores last 5 searches in localStorage
- **Debounced Search**: 300ms debounce to avoid excessive API calls

### 4. Performance

- **PostgreSQL Full-Text Search**: Fast native search using GIN indexes
- **Search Vectors**: Pre-computed search vectors for instant results
- **Weighted Ranking**: Different fields have different weights (titles > descriptions > other fields)
- **Parallel Queries**: All entity types searched in parallel
- **Result Limiting**: Returns top 20 results per entity type

## Usage

### For Users

1. Click the search button in the header (or press `/` or `Cmd/Ctrl + K`)
2. Type your search query (minimum 2 characters)
3. Results appear grouped by entity type
4. Click any result to navigate to that entity
5. Use keyboard shortcuts for faster navigation

### For Developers

#### Using the Search Action

```typescript
import { globalSearch } from '@/app/actions/search'

// Basic search
const response = await globalSearch('john')

// Search with filters
const response = await globalSearch('training', {
  entityTypes: ['event', 'plan'],
  dateRange: {
    from: new Date('2025-01-01'),
    to: new Date('2025-12-31')
  }
})

// Check response
if ('error' in response) {
  console.error(response.error)
} else {
  console.log('Results:', response.data.results)
  console.log('Total:', response.data.totalCount)
  console.log('Time:', response.data.executionTime, 'ms')
}
```

#### Customizing the Search Component

The `GlobalSearch` component can be customized:

```typescript
import { GlobalSearch } from '@/components/global-search'

function MyComponent() {
  const [open, setOpen] = useState(false)

  return (
    <GlobalSearch
      open={open}
      onOpenChange={setOpen}
    />
  )
}
```

## Monitoring & Maintenance

### Performance Monitoring

Search performance is logged with each query:

```sql
-- View search performance
SELECT
  data->>'query' as query,
  data->>'resultCount' as results,
  data->>'executionTime' as time_ms,
  "createdAt"
FROM "Activity"
WHERE type = 'search_performed'
ORDER BY "createdAt" DESC
LIMIT 100;
```

### Index Maintenance

Periodically maintain search indexes for optimal performance:

```sql
-- Analyze tables (updates statistics)
ANALYZE "Person";
ANALYZE "Note";
ANALYZE "Event";
-- ... other tables

-- Vacuum (reclaim storage)
VACUUM ANALYZE "Person";
```

### Search Vector Updates

Search vectors are automatically updated via triggers when data changes. If you notice stale search results:

```sql
-- Manually refresh all search vectors
UPDATE "Person" SET "updatedAt" = "updatedAt";
UPDATE "Note" SET "updatedAt" = "updatedAt";
-- ... other tables
```

## Troubleshooting

### No search results appearing

1. **Check migration**: Verify search_vector columns and indexes exist
2. **Check triggers**: Ensure triggers are active
3. **Refresh vectors**: Run manual update (see above)
4. **Check console**: Look for errors in browser console or server logs

### Slow search performance

1. **Check indexes**: Verify GIN indexes are created
2. **Analyze tables**: Run ANALYZE to update statistics
3. **Vacuum database**: Run VACUUM to reclaim space
4. **Monitor query time**: Check `executionTime` in search responses

### Privacy not working correctly

1. **Check user roles**: Verify user has correct roles assigned
2. **Check note privacy levels**: Ensure notes have correct privacy level set
3. **Test with different users**: Verify filtering works across different roles

### Migration fails

If the migration fails:

1. **Check for existing columns**: The migration uses `IF NOT EXISTS` so it's safe to re-run
2. **Run in parts**: Execute different sections separately
3. **Check permissions**: Ensure database user has CREATE and ALTER permissions
4. **Check logs**: Review Supabase logs for detailed error messages

## Future Enhancements

See `GLOBAL_SEARCH_DESIGN.md` for planned V2 features:

- Advanced filters (date range, categories, status)
- Search analytics dashboard
- AI-powered natural language search
- Saved searches and alerts
- Search command syntax (e.g., `@player:john`)

## Support

For issues or questions about the global search feature:

1. Check this documentation
2. Review the design document: `documents/GLOBAL_SEARCH_DESIGN.md`
3. Check the source code:
   - Backend: `app/actions/search.ts`
   - Frontend: `components/global-search.tsx`
   - Migration: `prisma/add-search-vectors.sql`
4. Create an issue on GitHub

---

**Last Updated**: November 11, 2025
**Version**: 1.0.0
