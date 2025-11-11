# Global Search Design Specification

**Version:** 1.0
**Date:** November 11, 2025
**Status:** Design Complete

---

## Table of Contents

1. [Overview](#overview)
2. [Indexable Entities](#indexable-entities)
3. [Search Backend Architecture](#search-backend-architecture)
4. [Security & Privacy Considerations](#security--privacy-considerations)
5. [Search UI States](#search-ui-states)
6. [Implementation Plan](#implementation-plan)
7. [Performance Considerations](#performance-considerations)

---

## Overview

### Purpose
Enable users to quickly find any content across the entire application through a unified search interface accessible from anywhere in the application.

### Goals
- **Speed**: Results appear within 200ms
- **Relevance**: Intelligent ranking based on entity type, recency, and match quality
- **Security**: Respect all privacy levels and organization boundaries
- **Scope**: Search across all major content types
- **UX**: Keyboard-first navigation with clear visual hierarchy

---

## Indexable Entities

### 1. Players & Staff (Person)

**Searchable Fields:**
- `firstName` (high weight)
- `lastName` (high weight)
- `email`
- `phone`
- `nationality`
- `position` (from PersonOrganization)
- `jerseyNumber` (from PersonOrganization)
- `tags` (from PersonOrganization)

**Metadata Returned:**
- Entity type: `player`
- ID, name, position, status, photo
- Organization context

**Security:**
- Filter by user's organization
- Check user has permission to view players
- Respect active/inactive status

**Search Weight:** HIGH (players are core entities)

---

### 2. Notes

**Searchable Fields:**
- `title` (high weight)
- `content` (full-text search on Tiptap JSON content)
- `tags`
- Linked person name
- Linked event name

**Metadata Returned:**
- Entity type: `note`
- ID, title, excerpt (first 100 chars), tags
- Privacy level, author, created date
- Linked entities (person/event)

**Security:**
- **CRITICAL**: Filter by `privacyLevel`
  - `public`: All organization users
  - `medical`: Only users with medical permissions
  - `coaching`: Only coaches/staff
  - `private`: Only note author
- Filter by organization
- Check user permissions based on role

**Search Weight:** HIGH

---

### 3. Events

**Searchable Fields:**
- `title` (high weight)
- `description`
- `location`
- `type` (training, match, medical, meeting, other)

**Metadata Returned:**
- Entity type: `event`
- ID, title, type, startTime, endTime, location
- Recurrence info
- Attendance count

**Security:**
- Filter by organization
- Check user has access to calendar
- Filter by date range (optional)

**Search Weight:** HIGH

---

### 4. Forms

**Searchable Fields:**
- `name` (high weight)
- `description`
- `category` (wellness, medical, performance, custom)

**Metadata Returned:**
- Entity type: `form`
- ID, name, category, description
- Active status, schedule type
- Response count

**Security:**
- Filter by organization
- Show only active forms (or include inactive based on user role)
- Check form distribution permissions

**Search Weight:** MEDIUM

---

### 5. Form Templates

**Searchable Fields:**
- `name` (high weight)
- `description`
- `category`

**Metadata Returned:**
- Entity type: `form_template`
- ID, name, category, description
- Public/private status

**Security:**
- Show public templates to all
- Show private templates only from user's org
- Check creation permissions

**Search Weight:** LOW (less frequently accessed)

---

### 6. Files

**Searchable Fields:**
- `name` (high weight)
- `tags`
- Uploader name
- Linked person name

**Metadata Returned:**
- Entity type: `file`
- ID, name, size, mimeType, uploadedAt
- Preview URL, tags
- Linked entities

**Security:**
- Filter by organization
- Check file access permissions
- Respect linked entity privacy

**Search Weight:** MEDIUM

---

### 7. Spreadsheets

**Searchable Fields:**
- `name` (high weight)
- `description`
- `category` (performance, wellness, injury, match, attendance, gps)
- Data content (optional, low weight)

**Metadata Returned:**
- Entity type: `spreadsheet`
- ID, name, category, description
- Last updated, row count

**Security:**
- Filter by organization
- Check spreadsheet access permissions

**Search Weight:** MEDIUM

---

### 8. Spreadsheet Templates

**Searchable Fields:**
- `name` (high weight)
- `description`
- `category`

**Metadata Returned:**
- Entity type: `spreadsheet_template`
- ID, name, category, description

**Security:**
- Filter by organization (show organization templates)
- Show system templates to all

**Search Weight:** LOW

---

### 9. Event Templates

**Searchable Fields:**
- `name` (high weight)
- `description`
- `type`

**Metadata Returned:**
- Entity type: `event_template`
- ID, name, type, description
- Default duration

**Security:**
- Filter by organization
- Check user has calendar permissions

**Search Weight:** LOW

---

### 10. Canvas Boards

**Searchable Fields:**
- `name` (high weight)

**Metadata Returned:**
- Entity type: `canvas`
- ID, name, created date
- Last updated

**Security:**
- Filter by organization
- Check canvas access permissions

**Search Weight:** LOW

---

### 11. Plans

**Searchable Fields:**
- `name` (high weight)
- `description`

**Metadata Returned:**
- Entity type: `plan`
- ID, name, description
- Date range (startDate, endDate)

**Security:**
- Filter by organization
- Check planner access permissions

**Search Weight:** MEDIUM

---

## Search Backend Architecture

### Decision: Supabase PostgreSQL Full-Text Search

**Selected Approach:** Native PostgreSQL full-text search with `ts_vector` and `ts_query`

#### Rationale

**Advantages:**
1. ✅ **No additional cost** - Already using Supabase PostgreSQL
2. ✅ **Native integration** - Works seamlessly with Prisma and existing schema
3. ✅ **Good performance** - PostgreSQL FTS is fast for datasets up to 100K+ records
4. ✅ **Simple deployment** - No external service to manage
5. ✅ **Flexible filtering** - Easy to combine with security/privacy filters
6. ✅ **Consistent transactions** - Search data always in sync with main data
7. ✅ **Multi-language support** - Built-in support for multiple languages

**Disadvantages:**
1. ⚠️ **Scaling limits** - May need external solution if dataset grows to millions
2. ⚠️ **Less advanced features** - No fuzzy matching, typo tolerance out of the box
3. ⚠️ **Index maintenance** - Need to keep `ts_vector` columns updated

**Alternative Considered: Algolia/Meilisearch**
- ❌ Additional cost ($1/1000 searches for Algolia)
- ❌ Data synchronization complexity
- ❌ Security challenges (exposing search API keys)
- ✅ Better fuzzy matching and typo tolerance
- ✅ Better performance at massive scale

**Conclusion:** Start with PostgreSQL FTS. Migration path exists if needed later.

---

### Implementation Architecture

#### Database Schema Changes

```sql
-- Add search vector columns to relevant tables
ALTER TABLE "Person" ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("firstName", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("lastName", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(email, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(phone, '')), 'C')
  ) STORED;

-- Create GIN index for fast search
CREATE INDEX person_search_idx ON "Person" USING GIN(search_vector);

-- Similar for other entities: Note, Event, Form, File, etc.
```

#### API Endpoint Structure

```typescript
// app/api/search/route.ts
POST /api/search
Body: {
  query: string;
  filters?: {
    entityTypes?: string[]; // ['player', 'note', 'event']
    dateRange?: { from: Date; to: Date };
    categories?: string[];
  };
  limit?: number; // default 50
  offset?: number; // for pagination
}

Response: {
  results: SearchResult[];
  totalCount: number;
  executionTime: number;
}

interface SearchResult {
  id: string;
  type: 'player' | 'note' | 'event' | 'form' | 'file' | 'spreadsheet' | 'canvas' | 'plan';
  title: string;
  description?: string;
  excerpt?: string;
  metadata: Record<string, any>;
  url: string; // Direct link to entity
  relevance: number; // 0-1 score
  createdAt: Date;
  updatedAt: Date;
}
```

#### Search Query Logic

```typescript
// Unified search across all entities
const searchResults = await Promise.all([
  searchPlayers(query, organizationId, userId),
  searchNotes(query, organizationId, userId),
  searchEvents(query, organizationId, userId),
  searchForms(query, organizationId, userId),
  searchFiles(query, organizationId, userId),
  // ... other entities
]);

// Merge, sort by relevance, apply limit
const mergedResults = mergeAndRank(searchResults);
```

---

## Security & Privacy Considerations

### Organization Isolation

**Rule:** Users can ONLY search within their organization context.

**Implementation:**
```typescript
// Every search query MUST include organizationId filter
WHERE organizationId = ${user.organizationId}
```

### Role-Based Access Control

**Permission Checks:**
- Players: Requires `view:players` permission
- Medical notes: Requires `view:medical` permission
- Forms: Requires `view:forms` permission
- Files: Requires `view:files` permission

**Implementation:**
```typescript
// Check user permissions before including entity type in search
const userPermissions = await getUserPermissions(userId, organizationId);
const searchableEntities = filterEntitiesByPermissions(userPermissions);
```

### Privacy Level Filtering (Notes)

**Privacy Levels:**
1. `public` - All organization users
2. `medical` - Medical staff only
3. `coaching` - Coaches and staff
4. `private` - Author only

**Implementation:**
```typescript
// Note search includes privacy filter
WHERE (
  privacyLevel = 'public'
  OR (privacyLevel = 'medical' AND user.role IN ('doctor', 'physio', 'admin'))
  OR (privacyLevel = 'coaching' AND user.role IN ('coach', 'admin'))
  OR (privacyLevel = 'private' AND authorId = ${userId})
)
```

### Sensitive Data Handling

**Form Responses:**
- NOT included in global search (too sensitive)
- May contain health data, personal information
- Search forms themselves, not responses

**User/Person Distinction:**
- User: System accounts (searchable by admins only)
- Person: Athletes/staff (searchable by all with permissions)

### Audit Logging

**Log all searches:**
```typescript
await db.activity.create({
  data: {
    type: 'search_performed',
    userId,
    organizationId,
    data: {
      query,
      resultCount,
      entityTypes: filters.entityTypes
    }
  }
});
```

---

## Search UI States

### State 1: Empty / Initial State

**Trigger:** Search input is empty or < 2 characters

**Visual Design:**
```
┌─────────────────────────────────────────┐
│  🔍 Search                              │ <- Input field (focused)
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│                                         │
│          Search across players,         │
│      events, notes, forms and more      │
│                                         │
│  Recent searches:                       │
│  • Training schedule                    │
│  • John Smith                           │
│  • Wellness forms                       │
│                                         │
│  Quick access:                          │
│  👥 Players    📅 Events    📝 Notes   │
│  📋 Forms      📊 Spreadsheets          │
│                                         │
└─────────────────────────────────────────┘
```

**Elements:**
- Placeholder text: "Search players, events, notes, forms..."
- Recent searches (last 5, stored in localStorage)
- Quick access buttons to filtered searches
- Keyboard hint: "Press / to search"

---

### State 2: Loading State

**Trigger:** Query submitted, waiting for results

**Visual Design:**
```
┌─────────────────────────────────────────┐
│  🔍 training schedule                   │ <- Input field (with query)
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│                                         │
│     ⏳ Searching...                     │
│                                         │
│     [Loading spinner]                   │
│                                         │
└─────────────────────────────────────────┘
```

**Elements:**
- Loading spinner
- Search query visible in input
- Debounced (300ms) to avoid excessive API calls

---

### State 3: Results State

**Trigger:** Search returns 1+ results

**Visual Design:**
```
┌─────────────────────────────────────────┐
│  🔍 john                               │ <- Input field
│  [Players] [Events] [Notes] [All]     │ <- Filter tabs
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  👥 PLAYERS (2)                         │
│  ┌─────────────────────────────────────┐
│  │ 👤 John Smith                    → │
│  │    Forward • #10 • Active          │
│  │    Updated 2 days ago              │
│  └─────────────────────────────────────┘
│  ┌─────────────────────────────────────┐
│  │ 👤 Johnny Martinez              → │
│  │    Midfielder • #8 • Active        │
│  │    Updated 1 week ago              │
│  └─────────────────────────────────────┘
│                                         │
│  📝 NOTES (1)                          │
│  ┌─────────────────────────────────────┐
│  │ 📄 John Smith - Recovery Notes  → │
│  │    Medical note by Dr. Adams       │
│  │    Created yesterday               │
│  └─────────────────────────────────────┘
│                                         │
│  Showing 3 of 3 results                │
└─────────────────────────────────────────┘
```

**Elements:**
- Results grouped by entity type
- Each result card shows:
  - Icon (entity type indicator)
  - Title (highlighted matching terms)
  - Metadata (status, dates, related info)
  - Hover state with arrow indicator
- Entity type badges with counts
- Filter tabs to narrow by type
- Keyboard navigation (↑↓ to navigate, Enter to open)
- Total result count

**Result Card Components by Type:**

**Player:**
```
👤 [Name]
   [Position] • [Jersey #] • [Status]
   Updated [relative time]
```

**Note:**
```
📄 [Title]
   [Privacy icon] [Excerpt...]
   By [Author] • [relative time]
```

**Event:**
```
📅 [Title]
   [Type icon] [Date/Time] • [Location]
   [Attendance count] attendees
```

**Form:**
```
📋 [Name]
   [Category] • [Status: Active/Inactive]
   [Response count] responses
```

**File:**
```
📎 [Filename]
   [File type icon] [Size] • Uploaded by [User]
   [Tags]
```

---

### State 4: No Results State

**Trigger:** Search returns 0 results

**Visual Design:**
```
┌─────────────────────────────────────────┐
│  🔍 xyz123notfound                     │ <- Input field
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│                                         │
│          🔍                             │
│                                         │
│    No results found for "xyz123..."    │
│                                         │
│  Try:                                  │
│  • Check your spelling                 │
│  • Use different keywords              │
│  • Try more general terms              │
│                                         │
│  Or browse:                            │
│  👥 Players    📅 Events    📝 Notes   │
│                                         │
└─────────────────────────────────────────┘
```

**Elements:**
- Empty state icon
- Helpful message
- Search tips
- Quick access buttons to browse entities

---

### State 5: Error State

**Trigger:** API error or network failure

**Visual Design:**
```
┌─────────────────────────────────────────┐
│  🔍 training                           │ <- Input field
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│                                         │
│          ⚠️                             │
│                                         │
│    Unable to perform search            │
│                                         │
│  Please check your connection and      │
│  try again.                            │
│                                         │
│  [Try Again]                           │
│                                         │
└─────────────────────────────────────────┘
```

**Elements:**
- Error icon
- Error message
- Retry button
- Fallback to cached/recent searches

---

### UI Component Hierarchy

```
<GlobalSearch>
  <SearchTrigger /> (Navbar button, keyboard shortcut)
  <SearchDialog>
    <SearchInput />
    <SearchFilters />
    <SearchResults>
      {/* Conditional rendering based on state */}
      <EmptyState />
      <LoadingState />
      <ResultsList>
        <ResultGroup type="player">
          <ResultCard />
        </ResultGroup>
      </ResultsList>
      <NoResultsState />
      <ErrorState />
    </SearchResults>
  </SearchDialog>
</GlobalSearch>
```

---

## Implementation Plan

### Phase 1: Database Setup ✅
1. Create migration to add `search_vector` columns
2. Add GIN indexes for full-text search
3. Create database functions for search relevance ranking

### Phase 2: Backend API ✅
1. Create `/api/search` endpoint
2. Implement security checks and filters
3. Add search functions for each entity type
4. Implement result merging and ranking logic
5. Add audit logging

### Phase 3: Frontend Components ✅
1. Create `<GlobalSearch>` component with dialog
2. Implement all UI states (empty, loading, results, no results, error)
3. Add keyboard navigation (↑↓, Enter, Esc, /)
4. Add result highlighting
5. Implement filter tabs

### Phase 4: Integration ✅
1. Add search button to main navigation
2. Add keyboard shortcut (/)
3. Integrate with routing (open entities on click)
4. Add recent searches (localStorage)

### Phase 5: Testing ✅
1. Unit tests for search API
2. Integration tests for security filters
3. E2E tests for search UI
4. Performance testing (search speed)
5. Manual testing across all entity types

### Phase 6: Documentation ✅
1. Update user documentation
2. Add developer documentation
3. Create search tips guide

---

## Performance Considerations

### Optimization Strategies

1. **Debouncing**: Wait 300ms after last keystroke before searching
2. **Caching**: Cache frequent searches (Redis/in-memory)
3. **Pagination**: Limit initial results to 50, load more on scroll
4. **Index Optimization**: Regular VACUUM and ANALYZE on search indexes
5. **Query Optimization**: Use EXPLAIN ANALYZE to optimize slow queries
6. **Partial Matching**: Use prefix matching for better UX (`john` matches `johnny`)

### Performance Targets

- **Search Response Time**: < 200ms for 95th percentile
- **Index Size**: < 10% of total database size
- **UI Responsiveness**: No blocking during search
- **Memory Usage**: < 50MB for frontend search component

### Monitoring

```typescript
// Track search performance
await db.searchMetrics.create({
  data: {
    query,
    resultCount,
    executionTimeMs,
    organizationId,
    timestamp: new Date()
  }
});
```

---

## Future Enhancements

### V2 Features (Post-MVP)

1. **Advanced Filters**
   - Date range filtering
   - Multi-select entity types
   - Status filters (active/inactive)
   - Custom field filters

2. **Search Analytics**
   - Popular searches dashboard
   - Search success rate
   - Zero-result queries tracking

3. **AI-Powered Search**
   - Natural language queries ("show me injured players")
   - Semantic search (understanding intent)
   - Search suggestions based on context

4. **Saved Searches**
   - Save frequent searches
   - Alert on new results for saved searches

5. **Search Shortcuts**
   - Command syntax: `@player:john` (search only players)
   - Tag search: `#injury`
   - Date shortcuts: `today`, `this week`

### Migration Path to External Search

If PostgreSQL FTS becomes insufficient:

1. **Trigger**: > 1M records, search latency > 500ms consistently
2. **Options**: Meilisearch (self-hosted), Algolia (managed)
3. **Migration Strategy**:
   - Keep PostgreSQL as source of truth
   - Add search indexing webhook/job
   - Gradual rollout with feature flag
   - Maintain backward compatibility

---

## Appendix: Technical Specifications

### Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.x", // Data fetching
    "cmdk": "^0.2.x", // Command palette UI
    "@radix-ui/react-dialog": "^1.x" // Modal dialog
  }
}
```

### Database Migration Example

```sql
-- Migration: add_search_vectors
-- Description: Add full-text search support to main entities

-- Person (Players/Staff)
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS person_search_idx ON "Person" USING GIN(search_vector);

-- Note
ALTER TABLE "Note" ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS note_search_idx ON "Note" USING GIN(search_vector);

-- Event
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS event_search_idx ON "Event" USING GIN(search_vector);

-- Form
ALTER TABLE "Form" ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS form_search_idx ON "Form" USING GIN(search_vector);

-- File
ALTER TABLE "File" ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS file_search_idx ON "File" USING GIN(search_vector);

-- Spreadsheet
ALTER TABLE "Spreadsheet" ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS spreadsheet_search_idx ON "Spreadsheet" USING GIN(search_vector);

-- Function to update search vectors
CREATE OR REPLACE FUNCTION update_person_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW."firstName", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW."lastName", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.email, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.phone, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update search vector on insert/update
CREATE TRIGGER person_search_vector_update
  BEFORE INSERT OR UPDATE ON "Person"
  FOR EACH ROW
  EXECUTE FUNCTION update_person_search_vector();
```

---

## Sign-Off

**Design Approved By:** [Pending]
**Technical Review:** [Pending]
**Security Review:** [Pending]
**Ready for Implementation:** ✅ YES

---

**Document End**
