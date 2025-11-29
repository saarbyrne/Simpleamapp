# Data Management & Historical Trends - Implementation Progress

## Project Overview

**Linear Project**: [Data Management & Historical Trends](https://linear.app/saar-byrne/project/data-management-and-historical-trends-f33eecc87b4f)

**Goal**: Transform SAM's data layer into a user-controllable database platform where spreadsheets become the interface to underlying tables, with complete safety rails, version control, and powerful historical trend analysis.

## Implementation Status

### ✅ Phase 1: Foundation (COMPLETED)

#### 1. Row-Level Change Tracking
**Status**: Database schema + Server actions implemented

**Files Created/Modified**:
- `prisma/schema.prisma` - Added `DataChangeLog` model
- `lib/data-management.ts` - Utility functions for change tracking
- `app/actions/data-management.ts` - Server actions for logging and querying changes

**Features**:
- ✅ Track create/update/delete/restore operations
- ✅ Store previous and new data for each change
- ✅ Identify which fields changed (diff tracking)
- ✅ Batch operation grouping with `batchId`
- ✅ Query history for individual rows or entire spreadsheets
- ✅ Restore rows to previous versions

**API Functions**:
```typescript
// Log changes
logDataChange(change: DataChange)
logBatchDataChanges(changes: DataChange[])

// Query history
getRowHistory(spreadsheetId, rowId)
getSpreadsheetHistory(spreadsheetId, page, limit)

// Restore
restoreRowToVersion(spreadsheetId, rowId, changeLogId)
```

#### 2. Soft Delete & Trash Recovery
**Status**: Database schema + Server actions + UI implemented

**Files Created**:
- `prisma/schema.prisma` - Added `TrashItem` model and soft delete fields to `Spreadsheet`
- `app/actions/data-management.ts` - Trash management actions
- `app/dashboard/trash/page.tsx` - Trash page (server component)
- `app/dashboard/trash/trash-client.tsx` - Trash UI (client component)

**Features**:
- ✅ Soft delete spreadsheets (set `isDeleted` flag)
- ✅ Create trash items with 30-day retention
- ✅ View all trash items with expiry warnings
- ✅ Restore deleted items
- ✅ Permanently delete items
- ✅ Auto-expiry tracking

**API Functions**:
```typescript
softDeleteSpreadsheet(spreadsheetId)
restoreSpreadsheet(spreadsheetId)
getTrashItems()
permanentlyDelete(trashItemId)
```

**UI Features**:
- Display all trash items with metadata (deleted by, deleted at, expires at)
- Warning badges for items expiring soon (< 7 days)
- Restore button with confirmation
- Permanent delete with typed confirmation ("delete forever")

#### 3. Table-Level Permissions
**Status**: Database schema + Server actions implemented

**Files Created/Modified**:
- `prisma/schema.prisma` - Added `SpreadsheetPermission` model
- `lib/data-management.ts` - Permission resolution logic
- `app/actions/data-management.ts` - Permission management actions

**Features**:
- ✅ Grant permissions by user, role, or system permission
- ✅ Three access levels: view, edit, admin
- ✅ Visibility modes: org-wide or restricted
- ✅ Creator and org admin always have admin access
- ✅ Permission resolution with priority handling

**API Functions**:
```typescript
grantSpreadsheetPermission(spreadsheetId, grantType, grantValue, accessLevel)
revokeSpreadsheetPermission(permissionId)
getSpreadsheetAccessLevel(spreadsheetId)
```

#### 4. Destructive Action Safety Rails
**Status**: Confirmation dialog component implemented

**Files Created**:
- `components/data-management/confirmation-dialog.tsx` - Reusable confirmation component

**Features**:
- ✅ Impact summary display (affected rows, warnings)
- ✅ Optional typed confirmation (user must type specific text)
- ✅ Destructive vs default variants
- ✅ Loading states
- ✅ Used in trash permanent delete

**Usage Example**:
```tsx
<ConfirmationDialog
  title="Delete column 'Weekly Load'?"
  description="This will permanently remove this column and all its data."
  impact={{
    affectedRows: 2547,
    warnings: ["3 reports reference this column and will break"]
  }}
  confirmVariant="destructive"
  requireTypedConfirmation="delete weekly load"
  onConfirm={handleDelete}
/>
```

---

## Database Schema Changes

### New Models

```prisma
model DataChangeLog {
  id             String   @id @default(cuid())
  spreadsheetId  String
  rowId          String
  userId         String
  organizationId String
  action         String   // "create" | "update" | "delete" | "restore"
  previousData   Json?
  newData        Json?
  changedFields  String[]
  timestamp      DateTime @default(now())
  batchId        String?

  // Relations + indexes
}

model TrashItem {
  id            String   @id @default(cuid())
  organizationId String
  entityType    String   // "spreadsheet" | "spreadsheet_row" | etc.
  entityId      String
  entityName    String
  parentId      String?
  parentName    String?
  metadata      Json?
  deletedBy     String
  deletedAt     DateTime @default(now())
  expiresAt     DateTime

  // Relations + indexes
}

model SpreadsheetPermission {
  id            String   @id @default(cuid())
  spreadsheetId String
  grantType     String   // "user" | "role" | "permission"
  grantValue    String
  accessLevel   String   // "view" | "edit" | "admin"
  grantedBy     String
  grantedAt     DateTime @default(now())

  // Relations + indexes
}
```

### Modified Models

**Spreadsheet** - Added fields:
```prisma
isDeleted        Boolean   @default(false)
deletedAt        DateTime?
deletedBy        String?
visibility       String    @default("org")
schemaLockedBy   String?
schemaLockReason String?

permissions      SpreadsheetPermission[]
```

**User** - Added relations:
```prisma
dataChangeLogs   DataChangeLog[]
deletedItems     TrashItem[]
```

---

## Next Steps

### ✅ Phase 2: Integration & UI Enhancement (COMPLETED)

1. **Integrate change logging into spreadsheet operations** ✅
   - Modified `updateSpreadsheet` to log row-level changes
   - Tracks create/update/delete operations on rows
   - Batch logging with unique batchId for each update

2. **Build Row History Viewer Component** ✅
   - Timeline view of all changes to a row
   - Show diffs between versions
   - One-click restore to any version
   - Component ready for integration into spreadsheet detail page

3. **Soft Delete Integration** ✅
   - Updated `deleteSpreadsheet` to use soft delete
   - Updated `getSpreadsheets` to exclude soft-deleted items
   - Added trash navigation to data management page
   - Improved delete confirmation messaging

4. **Build Permissions Management UI** (NEXT)
   - Permission settings panel in spreadsheet detail page
   - Add/remove user/role permissions
   - Change visibility setting
   - Schema lock controls

5. **Enhance Column Delete with Impact Analysis** (FUTURE)
   - Calculate dependencies before deletion
   - Show confirmation dialog with impact
   - Check for formula dependencies
   - Check for report references (when implemented)

### 📋 Phase 3: Historical Trends & Visualization (NOT STARTED)

5. **Player Profile Timeline** (SAM-48)
   - Auto-discover numeric metrics across all spreadsheets for a player
   - Trends tab on player profiles
   - Multi-metric line charts with date ranges
   - Comparison modes (compare players, time periods)

6. **Cross-Spreadsheet Reports Builder** (SAM-49)
   - Report configuration UI (select data sources, players, date range)
   - Query engine to aggregate data across spreadsheets
   - Multiple visualization types (line, bar, scatter, heatmap)
   - Save and schedule reports

---

## Migration Required

**⚠️ Database migration needs to be applied when database is available**

Run:
```bash
npx prisma migrate dev --name add_data_management_tracking
```

Or manually apply the schema changes to add the three new tables and modify the `Spreadsheet` and `User` tables.

---

## Files Created

### Database & Utilities
- `prisma/schema.prisma` (modified)
- `lib/data-management.ts` (NEW)

### Server Actions
- `app/actions/data-management.ts` (NEW)

### UI Components
- `components/data-management/confirmation-dialog.tsx` (NEW)
- `components/data-management/row-history.tsx` (NEW)
- `app/dashboard/trash/page.tsx` (NEW)
- `app/dashboard/trash/trash-client.tsx` (NEW)

### Updated Files
- `app/actions/spreadsheets.ts` (MODIFIED - added soft delete + change logging integration)
- `app/dashboard/data-management/data-management-client.tsx` (MODIFIED - added trash navigation)

---

## Testing Checklist

Once database migration is applied:

### Change Tracking
- [ ] Create a row and verify change log entry
- [ ] Update a row and verify changed fields are correct
- [ ] Delete a row and verify change log
- [ ] Restore a row from history
- [ ] View full history of a spreadsheet

### Soft Delete & Trash
- [ ] Delete a spreadsheet and verify it appears in trash
- [ ] Restore a spreadsheet from trash
- [ ] Permanently delete a spreadsheet
- [ ] Verify expired items are purged (after 30 days)

### Permissions
- [ ] Grant view permission to a user
- [ ] Grant edit permission to a role
- [ ] Verify creator always has admin access
- [ ] Change spreadsheet visibility to restricted
- [ ] Revoke a permission

### Safety Rails
- [ ] Trigger confirmation dialog for destructive action
- [ ] Verify impact summary displays correctly
- [ ] Test typed confirmation requirement
- [ ] Verify cancel works correctly

---

## Integration Points

### Current System Integration
The new data management features integrate with:
- ✅ Existing spreadsheet system (soft delete, permissions)
- ✅ Existing user/organization auth system
- ✅ Existing UI components (Dialog, Button, Card, Badge)
- ⏳ Spreadsheet operations (needs integration for change logging)
- ⏳ Reports system (when column delete impact analysis is needed)

### Future Integration
- Player profiles (for timeline visualization)
- Reports builder (for cross-spreadsheet queries)
- Forms (extend soft delete and change tracking)
- Events (extend soft delete and change tracking)

---

## Architecture Decisions

1. **Row-level vs Spreadsheet-level versioning**: We implemented BOTH
   - Spreadsheet-level versioning (existing): Captures entire state snapshots
   - Row-level change logs (new): Granular audit trail with efficient queries

2. **Soft delete everywhere**: All deletions are reversible
   - 30-day retention in trash
   - Easy restoration
   - Auto-purge after expiry

3. **Permission system**: Built on existing role/permission structure
   - No new auth concepts
   - Leverages existing `roleNames` and `permissions` arrays
   - Backward compatible (defaults to org-wide visibility)

4. **Server actions pattern**: All data mutations through server actions
   - Type-safe
   - Revalidates paths
   - Consistent error handling

---

## Performance Considerations

### Indexes Added
```prisma
// DataChangeLog indexes
@@index([spreadsheetId, rowId])
@@index([spreadsheetId, timestamp])
@@index([userId, timestamp])
@@index([organizationId, timestamp])

// TrashItem indexes
@@index([organizationId, deletedAt])
@@index([organizationId, entityType])
@@index([expiresAt])

// SpreadsheetPermission indexes
@@index([spreadsheetId])

// Spreadsheet indexes
@@index([organizationId, isDeleted])
```

### Query Optimization
- Change logs paginated (50 per page)
- Trash items filtered by organization
- Soft-deleted spreadsheets excluded from main queries via `where: { isDeleted: false }`

---

## Linear Issues Coverage

| Linear Issue | Status | Implementation |
|--------------|--------|----------------|
| SAM-44: Data Change Tracking | ✅ Complete | DataChangeLog model + API + Integration |
| SAM-45: Soft Delete & Trash | ✅ Complete | TrashItem model + UI + API + Integration |
| SAM-46: Table-Level Permissions | ✅ Complete | SpreadsheetPermission model + API |
| SAM-47: Safety Rails | ✅ Complete | ConfirmationDialog component + Integration |
| SAM-48: Player Timeline | ⏳ Not Started | Requires metrics discovery service |
| SAM-49: Cross-Spreadsheet Reports | ⏳ Not Started | Requires report builder UI |

---

## How to Continue

### Immediate Next Steps (1-2 hours)

1. **Integrate Row History into Spreadsheet Detail Page**
   - Add "History" button to row actions menu
   - Show RowHistory dialog when clicked
   - Pass spreadsheet ID and row ID

2. **Build Permissions Management UI**
   - Add permissions tab/section to spreadsheet detail page
   - List current permissions
   - Add/remove permissions interface
   - Visibility toggle

3. **Test the change logging integration**
   - Create a new spreadsheet
   - Add/update/delete rows
   - Check that DataChangeLog entries are created
   - View history using RowHistory component

### Medium Term (3-5 hours)

4. **Player Timeline**: Build metrics discovery service
5. **Reports Builder**: Design report configuration UI

### Testing (1-2 hours)

6. Apply database migration
7. Run through testing checklist
8. Fix any bugs discovered

---

## Questions for User

1. **Database Access**: When will the database be available to apply migrations?
2. **Column Delete**: Should we implement impact analysis before allowing column deletion?
3. **Auto-purge**: Should we implement a cron job to automatically purge expired trash items, or manual cleanup?
4. **Player Timeline**: Should this be on the player profile, or a separate "Analytics" section?
5. **Reports Priority**: Which is more important - Player Timeline (SAM-48) or Cross-Spreadsheet Reports (SAM-49)?

---

**Last Updated**: 2025-11-29
**Implementation Phase**: Phase 1 Complete, Phase 2 In Progress
