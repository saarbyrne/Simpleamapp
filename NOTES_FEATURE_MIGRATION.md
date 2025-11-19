# Rich-Text Notes Feature - Migration & Deployment Guide

## Overview

This document describes the rich-text notes feature implementation with Tiptap editor, privacy controls, entity linking, search/filtering, and AI workflows.

## Database Changes

### Schema Updates

The `Note` model has been updated in `prisma/schema.prisma`:

```prisma
model Note {
  id             String   @id @default(cuid())
  title          String?
  content        Json // Tiptap JSON document format

  // Privacy/Visibility
  visibility     String   @default("public") // public, medical, mental_health, coaches, private

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  // Linked entities
  linkedPersonId String?
  linkedPerson   Person? @relation(fields: [linkedPersonId], references: [id], onDelete: SetNull)

  linkedEventId  String?
  linkedEvent    Event? @relation(fields: [linkedEventId], references: [id], onDelete: SetNull)

  // Tags for organization
  tags      String[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([organizationId])
  @@index([authorId])
  @@index([linkedPersonId])
  @@index([linkedEventId])
  @@index([visibility])
  @@map("notes")
}
```

**Key changes:**
1. Changed `privacyLevel` to `visibility` with new values
2. Added `linkedEvent` relation (previously only had `linkedEventId`)
3. Added indexes for better query performance
4. Added proper cascade/set null delete behaviors

### Event Model Update

Added notes relation to Event model:

```prisma
model Event {
  // ... existing fields
  notes      Note[]
  // ... rest of model
}
```

### Migration Steps

1. **Generate migration:**
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev --name add_notes_feature
   ```

2. **Verify migration:**
   ```bash
   npx prisma db pull
   npx prisma generate
   ```

## New Files Created

### Server Actions

- **`app/actions/notes.ts`** - Core CRUD operations with permission checks
  - `getNotes()` - Fetch notes with filters
  - `getNote()` - Fetch single note
  - `createNote()` - Create new note
  - `updateNote()` - Update existing note
  - `deleteNote()` - Delete note
  - `getNoteTags()` - Get all tags

- **`app/actions/notes-ai.ts`** - AI-powered workflows
  - `summarizeNotes()` - Summarize notes for entity/date range
  - `createNoteFromNaturalLanguage()` - Create note from prompt
  - `analyzeNotesSentiment()` - Sentiment analysis

### Components

- **`components/notes/rich-text-editor.tsx`** - Tiptap editor with toolbar
- **`components/notes/note-card.tsx`** - Display individual notes
- **`components/notes/note-editor-dialog.tsx`** - Create/edit dialog
- **`components/notes/notes-list.tsx`** - List with filtering
- **`components/notes/index.ts`** - Barrel export

### Pages

- **`app/dashboard/notes/page.tsx`** - Global notes page (updated)
- **`app/dashboard/players/[id]/page.tsx`** - Player profile integration (updated)
- **`app/dashboard/calendar/events/[eventId]/page.tsx`** - Event detail integration (updated)

## Features Implemented

### ✅ Rich-Text Editor (Tiptap)

- Bold, italic, code formatting
- Headings (H2, H3)
- Bullet and numbered lists
- Blockquotes
- Undo/redo
- Extensible for future features (mentions, tables, images)

### ✅ Privacy/Visibility Modes

- **Public** - Visible to everyone in organization
- **Medical** - Only medical staff can view
- **Mental Health** - Only mental health staff can view
- **Coaches** - Only coaches can view
- **Private** - Only author can view

Permission checks implemented at:
- Database query level
- API action level
- UI component level

### ✅ Entity Linking

- Link notes to **Players** (Person)
- Link notes to **Events**
- Notes appear in entity detail pages
- Notes can be standalone (not linked)

### ✅ Search & Filtering

- **Search** by content, title, author, tags
- **Filter by visibility** level
- **Filter by tags**
- **Filter by entity** (person/event)
- Real-time client-side filtering

### ✅ Tag System

- User-defined tags
- Tag autocomplete from existing tags
- Tag-based filtering
- Tag cloud in notes list

### ✅ AI Workflows

**Note:** AI features use placeholder logic. To enable real AI:
- Integrate OpenAI API or Anthropic Claude
- Update functions in `app/actions/notes-ai.ts`

Available AI workflows:
1. **Summarize notes** - Get summary of notes for entity/time period
2. **Create from natural language** - Generate note from prompt
3. **Sentiment analysis** - Analyze tone across notes

## Testing Checklist

### ✅ Core Functionality

- [x] Create note with all fields
- [x] Edit note (author only)
- [x] Delete note (author only)
- [x] View notes in global list
- [x] View notes in player profile
- [x] View notes in event detail

### ✅ Privacy/Visibility

- [x] Public notes visible to all
- [x] Role-specific notes filtered correctly
- [x] Private notes only visible to author
- [x] Permission checks prevent unauthorized access
- [x] Cannot edit/delete others' notes

### ✅ Search & Filtering

- [x] Search by content works
- [x] Filter by visibility works
- [x] Filter by tags works
- [x] Clear filters resets view
- [x] Filter counts update correctly

### ✅ Entity Linking

- [x] Notes linked to players appear in player profile
- [x] Notes linked to events appear in event detail
- [x] Linked entities shown in note cards
- [x] Can create standalone notes
- [x] Entity links are clickable

### ✅ UI/UX

- [x] Rich-text editor toolbar functional
- [x] Note cards display properly
- [x] Dialogs open/close correctly
- [x] Loading states shown
- [x] Error messages displayed
- [x] Success toasts shown

## Environment Variables

No new environment variables required. Uses existing:
- `DATABASE_URL` - Postgres connection
- Supabase environment variables for auth

## Dependencies

Already installed (verified in package.json):
- `@tiptap/react` - Rich text editor
- `@tiptap/starter-kit` - Tiptap extensions
- All UI components (shadcn/ui)

## Known Limitations

1. **AI Features** - Currently use placeholder logic. Need API integration for production.
2. **Real-time Collaboration** - Not implemented (Tiptap supports it with Y.js)
3. **File Attachments** - Not in notes (use Files feature separately)
4. **@Mentions** - Not implemented (can add as Tiptap extension)
5. **Note Templates** - Not implemented (future enhancement)

## Rollback Plan

If issues arise:

1. **Revert database:**
   ```bash
   # If using migrations
   npx prisma migrate resolve --rolled-back <migration_name>

   # If using db push
   # Manually revert schema changes and run:
   npx prisma db push --force-reset
   ```

2. **Revert code:**
   ```bash
   git revert <commit_hash>
   ```

## Performance Considerations

1. **Indexes Added** - On frequently queried columns (visibility, authorId, linkedPersonId, linkedEventId)
2. **Pagination** - Not implemented yet. Recommended for organizations with >100 notes
3. **Search** - Currently client-side. For large datasets, implement server-side search

## Security

1. **Row-Level Security** - Implemented in server actions
2. **Author-Only Edits** - Enforced at API level
3. **Visibility Checks** - Applied to all queries
4. **XSS Protection** - Tiptap sanitizes content
5. **SQL Injection** - Protected by Prisma ORM

## Future Enhancements

1. Add AI API integration (OpenAI/Claude)
2. Implement note templates
3. Add @mentions with Tiptap extension
4. Add file attachments inline
5. Implement collaborative editing (Y.js)
6. Add note versioning/history
7. Export notes to PDF/Word
8. Add note categories/folders
9. Implement server-side search
10. Add pagination for large datasets

## Support

For issues or questions:
1. Check console logs for errors
2. Verify database schema matches expected
3. Confirm Prisma client is generated
4. Check user permissions/roles setup
5. Review server action responses

## Testing in Development

1. **Create test organization and users:**
   ```typescript
   // Use your existing seed script or create manually
   ```

2. **Test permission scenarios:**
   - Create users with different roles
   - Test visibility filters
   - Verify permission denied scenarios

3. **Test entity linking:**
   - Create notes for players
   - Create notes for events
   - Verify they appear in correct places

4. **Test search/filtering:**
   - Create notes with various tags
   - Test search with different queries
   - Verify filter combinations work

## Production Checklist

- [ ] Run database migration
- [ ] Verify Prisma client generated
- [ ] Test all CRUD operations
- [ ] Test permission scenarios
- [ ] Test with real user data
- [ ] Monitor performance
- [ ] Set up error tracking (Sentry already configured)
- [ ] Document AI integration steps for future
- [ ] Train users on new features
- [ ] Create user documentation

## Success Metrics

Track these metrics post-launch:
- Number of notes created per day
- Most used visibility levels
- Most common tags
- Notes per player/event
- User adoption rate
- Search usage frequency
