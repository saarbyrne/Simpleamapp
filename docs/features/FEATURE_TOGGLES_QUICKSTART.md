# Feature Toggles Quick Start Guide

## For Platform Administrators

### Accessing Feature Management

1. Log in as a platform admin
2. Navigate to **Platform Admin** → **Organizations**
3. Click on any organization
4. Look for the **Features** card in the overview
5. Click **Manage Features** button

### Managing Features

#### Toggle Individual Features

1. On the features management page, find the feature you want to toggle
2. Click the switch to enable/disable
3. For features with sub-features, expand the card to see granular controls
4. Click **Save Changes** when done

#### Bulk Actions

**Enable All Features:**
- Click **Enable All** in the Quick Actions section
- Changes apply immediately

**Disable All Features:**
- Click **Disable All** in the Quick Actions section
- Confirm the action in the dialog
- Changes apply immediately

**Reset to Defaults:**
- Click **Reset to Defaults** in the Quick Actions section
- All features will be enabled
- Changes apply immediately

### Understanding the Features

#### Main Features (12)

| Feature | Description | Sub-Features |
|---------|-------------|--------------|
| **AI Assistant** | AI-powered insights and assistance | None |
| **Players** | Player roster management | Notes, Files, Medical Data |
| **Forms** | Custom form builder | Builder, Responses, Scheduling |
| **Reports** | Analytics and reporting | Builder, Templates, Scheduling, AI Insights, Sharing |
| **Calendar** | Event scheduling | Attendance, Forms, Drawings, Spreadsheets, Notes, Files |
| **Messages** | Team chat | None |
| **Notes** | Note-taking | None |
| **Spreadsheets** | Data management | None |
| **Canvas** | Tactical drawings | None |
| **Files** | File storage | None |
| **Planner** | Long-term planning | None |
| **Templates** | Template marketplace | None |

#### Feature Relationships

- **Parent-Child**: Disabling a parent feature automatically disables all sub-features
- **Independent**: Main features without sub-features operate independently

## For Developers

### Quick Integration

#### 1. Protect a New Route

```tsx
// app/dashboard/my-feature/page.tsx
import { FeatureGuard } from '@/components/dashboard/FeatureGuard'

export default function MyFeaturePage() {
  return (
    <FeatureGuard feature="myFeature">
      <div>Your protected content here</div>
    </FeatureGuard>
  )
}
```

#### 2. Check Feature Access Programmatically

```typescript
import { getUserEnabledFeatures } from '@/app/actions/user-features'

async function checkAccess() {
  const result = await getUserEnabledFeatures()
  
  if (result.success && result.features?.includes('reports')) {
    // User has access to reports
  }
}
```

#### 3. Add a New Feature

**Step 1: Update Schema**
```prisma
// prisma/schema.prisma
model OrganizationFeatures {
  // ... existing fields
  myNewFeatureEnabled Boolean @default(true)
}
```

**Step 2: Add Metadata**
```typescript
// lib/permissions/feature-metadata.ts
export const FEATURE_METADATA = {
  // ... existing features
  myNewFeature: {
    key: 'myNewFeature',
    label: 'My New Feature',
    description: 'Description here',
    icon: IconComponent,
    fieldName: 'myNewFeatureEnabled',
    subFeatures: [],
    navPath: '/dashboard/my-new-feature',
  },
}
```

**Step 3: Add to Sidebar**
```typescript
// components/dashboard/app-sidebar.tsx
const allNavItems = [
  // ... existing items
  { 
    labelKey: 'nav.myNewFeature', 
    href: '/dashboard/my-new-feature', 
    icon: IconComponent, 
    featureKey: 'myNewFeature' 
  },
]
```

**Step 4: Create Migration**
```bash
npx prisma migrate dev --name add_my_new_feature
```

### Common Patterns

#### Conditional Rendering

```tsx
'use client'

import { useState, useEffect } from 'react'
import { getUserEnabledFeatures } from '@/app/actions/user-features'

export function MyComponent() {
  const [hasReports, setHasReports] = useState(false)

  useEffect(() => {
    getUserEnabledFeatures().then(result => {
      if (result.success && result.features) {
        setHasReports(result.features.includes('reports'))
      }
    })
  }, [])

  return (
    <div>
      {hasReports && <ReportsButton />}
    </div>
  )
}
```

#### Server-Side Check

```typescript
import { isFeatureEnabled } from '@/lib/permissions/feature-access'

export async function GET(request: Request) {
  const orgId = 'org-123' // Get from session
  
  const hasAccess = await isFeatureEnabled(orgId, 'reports')
  
  if (!hasAccess) {
    return new Response('Feature not available', { status: 403 })
  }
  
  // Continue with logic
}
```

## Common Scenarios

### Scenario 1: Disable Reports for an Organization

1. Go to Platform Admin → Organizations
2. Find and click the organization
3. Click **Manage Features**
4. Find the **Reports** card
5. Toggle the switch off
6. Click **Save Changes**

Result: Reports will be hidden from the sidebar and inaccessible for that organization.

### Scenario 2: Enable Only Specific Sub-Features

1. Navigate to the features management page
2. Find the feature (e.g., Calendar)
3. Ensure the main feature is enabled
4. Expand to see sub-features
5. Toggle specific sub-features on/off
6. Click **Save Changes**

Result: Users will see the main feature but only have access to enabled sub-features.

### Scenario 3: New Organization Setup

1. Create the organization
2. Features are automatically created with all enabled
3. Optionally customize features immediately
4. Or leave defaults and adjust later

Result: New organizations have full access by default.

## Troubleshooting

### Features Not Showing in Sidebar

**Problem:** User doesn't see a feature in their sidebar after enabling it.

**Solution:**
1. Ask user to refresh the page
2. Check browser console for errors
3. Verify feature was saved (check in platform admin)
4. Check that feature key matches in metadata and sidebar

### Can't Save Changes

**Problem:** Save button doesn't work or shows error.

**Solution:**
1. Check browser console for errors
2. Verify platform admin authentication
3. Check server logs
4. Ensure database connection is working

### Feature Still Accessible After Disabling

**Problem:** Users can still access a disabled feature.

**Solution:**
1. Verify changes were saved
2. Ask users to refresh their browser
3. Check that FeatureGuard is implemented on the page
4. Verify feature key matches across all files

## Best Practices

### For Admins

1. **Test Before Disabling** - Verify impact before disabling features for active organizations
2. **Communicate Changes** - Inform organization admins before changing features
3. **Use Bulk Actions Carefully** - Especially "Disable All" - it affects all users
4. **Document Reasons** - Keep notes on why features were disabled
5. **Regular Reviews** - Periodically review feature settings

### For Developers

1. **Always Use FeatureGuard** - Protect routes with the component
2. **Fail Open** - On errors, allow access rather than blocking
3. **Cache Wisely** - Cache feature checks but allow for updates
4. **Test Combinations** - Test with various feature combinations
5. **Document Dependencies** - Note if features depend on others

## Support

For questions or issues:
1. Check the full documentation: `docs/features/ORGANIZATION_FEATURE_TOGGLES.md`
2. Review the implementation summary: `docs/features/FEATURE_TOGGLES_IMPLEMENTATION_SUMMARY.md`
3. Check test files for examples: `tests/feature-toggles.test.ts`
4. Contact the development team

## Quick Reference

### Feature Keys
```
ai, players, forms, reports, calendar, messages, 
notes, spreadsheets, canvas, files, planner, templates
```

### Sub-Feature Keys
```
reportsBuilder, reportsTemplates, reportsScheduling, 
reportsAiInsights, reportsSharing, calendarAttendance, 
calendarForms, calendarDrawings, calendarSpreadsheets, 
calendarNotes, calendarFiles, formsBuilder, formsResponses, 
formsScheduling, playersNotes, playersFiles, playersMedicalData
```

### Important Files
- Metadata: `lib/permissions/feature-metadata.ts`
- Access Utils: `lib/permissions/feature-access.ts`
- Admin Actions: `app/actions/organization-features.ts`
- User Actions: `app/actions/user-features.ts`
- Feature Guard: `components/dashboard/FeatureGuard.tsx`
- Management Page: `app/platform-admin/organizations/[id]/features/page.tsx`

