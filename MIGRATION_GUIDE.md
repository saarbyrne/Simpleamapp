# Spreadsheets Refactor - Migration Guide

## Step-by-step Migration

### 1. Database Migration
When your database is online, run:
```bash
npx prisma db push
```

This will:
- Create the `spreadsheet_folders` table
- Add new columns to `spreadsheets` table:
  - `folderId` (optional foreign key)
  - `tags` (string array)
  - `tabs` (JSON field, defaults to empty array)
  - `starred` (boolean, defaults to false)
  - `lastOpenedAt` (datetime, optional)
  - `sharedWith` (string array)

### 2. Data Migration (Optional)
If you want to organize existing spreadsheets into folders automatically:

```typescript
// Example: Create default folders based on template categories
import { prisma } from '@/lib/db'

async function migrateToFolders(organizationId: string) {
  // Create category-based folders
  const loadTracking = await prisma.spreadsheetFolder.create({
    data: {
      name: 'Load Tracking',
      icon: '📊',
      organizationId,
      sortOrder: 1,
    }
  })

  const matchStats = await prisma.spreadsheetFolder.create({
    data: {
      name: 'Match Statistics',
      icon: '⚽',
      organizationId,
      sortOrder: 2,
    }
  })

  const wellness = await prisma.spreadsheetFolder.create({
    data: {
      name: 'Wellness Data',
      icon: '💪',
      organizationId,
      sortOrder: 3,
    }
  })

  // Move spreadsheets based on template category
  await prisma.spreadsheet.updateMany({
    where: {
      organizationId,
      template: {
        category: 'performance'
      }
    },
    data: {
      folderId: loadTracking.id
    }
  })

  // Add tags based on template
  const spreadsheets = await prisma.spreadsheet.findMany({
    where: { organizationId },
    include: { template: true }
  })

  for (const sheet of spreadsheets) {
    const tags = []
    if (sheet.template?.category) {
      tags.push(sheet.template.category)
    }
    if (sheet.name.toLowerCase().includes('weekly')) {
      tags.push('weekly')
    }
    if (sheet.name.toLowerCase().includes('monthly')) {
      tags.push('monthly')
    }

    await prisma.spreadsheet.update({
      where: { id: sheet.id },
      data: { tags }
    })
  }
}
```

### 3. Testing
After migration:

1. **Test folder creation**
   - Click "+" in folder sidebar
   - Create a folder with name and icon
   - Verify it appears in the list

2. **Test spreadsheet organization**
   - Click "..." on a spreadsheet card
   - Select "Move to folder"
   - Choose a folder
   - Verify spreadsheet appears in that folder

3. **Test filtering**
   - Search for a spreadsheet by name
   - Toggle starred filter
   - Select tags from filter dropdown
   - Change sort order

4. **Test view modes**
   - Toggle between grid and list view
   - Verify both display correctly

### 4. Cleanup (After Testing)
Once everything works:

1. Delete the old client file:
```bash
rm app/dashboard/spreadsheets/spreadsheets-client.tsx
```

2. Rename the new client:
```bash
mv app/dashboard/spreadsheets/spreadsheets-client-new.tsx app/dashboard/spreadsheets/spreadsheets-client.tsx
```

3. Update the import in [page.tsx](app/dashboard/spreadsheets/page.tsx:1):
```typescript
// Change from:
import { SpreadsheetsClientNew } from './spreadsheets-client-new'

// To:
import { SpreadsheetsClient } from './spreadsheets-client'
```

### 5. Optional Enhancements

#### Add Default Folders on Organization Creation
Update your organization creation logic to create default folders:

```typescript
// In organization creation flow
const defaultFolders = [
  { name: 'Load Tracking', icon: '📊', sortOrder: 1 },
  { name: 'Match Statistics', icon: '⚽', sortOrder: 2 },
  { name: 'Wellness Data', icon: '💪', sortOrder: 3 },
  { name: 'Injury Log', icon: '🏥', sortOrder: 4 },
  { name: 'GPS Data', icon: '📍', sortOrder: 5 },
  { name: 'Custom Reports', icon: '📋', sortOrder: 6 },
]

for (const folder of defaultFolders) {
  await prisma.spreadsheetFolder.create({
    data: {
      ...folder,
      organizationId: newOrg.id,
    }
  })
}
```

#### Add Common Tags
Create a helper to suggest common tags:

```typescript
export const COMMON_TAGS = [
  'weekly',
  'monthly',
  'daily',
  'season',
  'important',
  'archived',
  'load-tracking',
  'match-stats',
  'wellness',
  'injury',
  'gps',
  'custom',
]
```

## Rollback Plan

If you need to rollback:

1. Change the import in [page.tsx](app/dashboard/spreadsheets/page.tsx) back to the old client
2. The old client file is preserved as backup
3. New database fields are optional, so existing code will continue to work
4. Run prisma migration to remove new fields (if needed)

## Breaking Changes

None! All new fields are optional and have defaults. Existing spreadsheets will:
- Have no folder (null) → Show in "All Spreadsheets"
- Have empty tags array
- Have starred = false
- Have empty sharedWith array

## Support

If you encounter issues:
1. Check browser console for errors
2. Check server logs for action failures
3. Verify database migration completed successfully
4. Test with a fresh spreadsheet to isolate issues
