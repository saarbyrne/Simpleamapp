# Organization Feature Toggles

## Overview

The Organization Feature Toggles system allows platform administrators to control which features are available to each organization. This provides flexibility in managing feature access based on subscription tiers, organization needs, or feature rollout strategies.

## Architecture

### Database Schema

The system uses a dedicated `OrganizationFeatures` table with boolean columns for each feature:

- **Main Features** (12): AI, Players, Forms, Reports, Calendar, Messages, Notes, Spreadsheets, Canvas, Files, Planner, Templates
- **Sub-Features** (17): Granular controls within main features (e.g., Reports Builder, Calendar Attendance, Forms Scheduling)

All features default to `true` (enabled) for new organizations.

### Key Components

1. **Feature Metadata** (`lib/permissions/feature-metadata.ts`)
   - Defines all available features with labels, descriptions, icons
   - Maps feature keys to database field names
   - Provides feature hierarchy (parent-child relationships)

2. **Feature Access Utilities** (`lib/permissions/feature-access.ts`)
   - `getOrganizationFeatures()` - Fetch feature configuration
   - `isFeatureEnabled()` - Check if a specific feature is enabled
   - `updateOrganizationFeatures()` - Update feature settings
   - `resetOrganizationFeatures()` - Reset to defaults
   - `getFeatureCounts()` - Get enabled/disabled counts

3. **Server Actions**
   - Platform Admin Actions (`app/actions/organization-features.ts`) - Admin management
   - User Actions (`app/actions/user-features.ts`) - User feature checks

4. **UI Components**
   - `FeatureToggleCard` - Main feature card with sub-features
   - `SubFeatureToggle` - Individual sub-feature toggle
   - `FeatureToggleSwitch` - Base toggle switch component
   - `BulkFeatureActions` - Enable/Disable/Reset all features

5. **Route Protection**
   - `FeatureGuard` component - Client-side route protection
   - Sidebar filtering - Hides disabled features from navigation

## Usage

### For Platform Admins

#### Accessing Feature Management

1. Navigate to Platform Admin → Organizations
2. Click on an organization
3. View feature summary in the "Features" card
4. Click "Manage Features" to access the full feature management page

#### Managing Features

**Individual Features:**
- Toggle main features on/off
- Expand features with sub-features to configure granular controls
- Disabling a parent feature automatically disables all sub-features

**Bulk Actions:**
- **Enable All** - Turn on all features
- **Disable All** - Turn off all features (with confirmation)
- **Reset to Defaults** - Reset all features to enabled state

**Saving Changes:**
- Changes are tracked locally
- Click "Save Changes" to apply
- Confirmation toast appears on success

### For Developers

#### Adding a New Feature

1. **Update Database Schema** (`prisma/schema.prisma`):
```prisma
model OrganizationFeatures {
  // Add new field
  newFeatureEnabled Boolean @default(true)
}
```

2. **Update Feature Metadata** (`lib/permissions/feature-metadata.ts`):
```typescript
export const FEATURE_METADATA: Record<FeatureKey, FeatureMetadata> = {
  newFeature: {
    key: 'newFeature',
    label: 'New Feature',
    description: 'Description of the new feature',
    icon: IconComponent,
    fieldName: 'newFeatureEnabled',
    subFeatures: [],
    navPath: '/dashboard/new-feature',
  },
}
```

3. **Update Sidebar** (`components/dashboard/app-sidebar.tsx`):
```typescript
const allNavItems = [
  // Add new nav item
  { labelKey: 'nav.newFeature', href: '/dashboard/new-feature', icon: Icon, featureKey: 'newFeature' },
]
```

4. **Create Migration**:
```bash
npx prisma migrate dev --name add_new_feature
```

#### Protecting a Route

**Option 1: Using FeatureGuard Component**
```tsx
import { FeatureGuard } from '@/components/dashboard/FeatureGuard'

export default function NewFeaturePage() {
  return (
    <FeatureGuard feature="newFeature">
      {/* Your page content */}
    </FeatureGuard>
  )
}
```

**Option 2: Checking Programmatically**
```typescript
import { getUserEnabledFeatures } from '@/app/actions/user-features'

const result = await getUserEnabledFeatures()
if (result.success && result.features?.includes('newFeature')) {
  // Feature is enabled
}
```

#### Adding Sub-Features

1. Add field to schema:
```prisma
newFeatureSubEnabled Boolean @default(true)
```

2. Add to parent feature's metadata:
```typescript
subFeatures: [
  {
    key: 'newFeatureSub',
    label: 'Sub Feature',
    description: 'Sub-feature description',
    fieldName: 'newFeatureSubEnabled',
  },
]
```

## API Reference

### Server Actions

#### `getOrganizationFeaturesAction(orgId: string)`
Get all features for an organization.

**Returns:**
```typescript
{
  success: boolean
  features?: OrganizationFeatures | null
  error?: string
}
```

#### `updateOrganizationFeaturesAction(orgId: string, updates: Partial<OrganizationFeatures>)`
Update specific features for an organization.

**Example:**
```typescript
await updateOrganizationFeaturesAction('org-123', {
  reportsEnabled: false,
  formsEnabled: true,
})
```

#### `getUserEnabledFeatures()`
Get enabled features for the current user's organization.

**Returns:**
```typescript
{
  success: boolean
  features?: string[] // Array of feature keys
  error?: string
}
```

### Utility Functions

#### `isFeatureEnabled(orgId: string, feature: FeatureKey | SubFeatureKey)`
Check if a specific feature is enabled.

**Example:**
```typescript
const enabled = await isFeatureEnabled('org-123', 'reports')
```

#### `getFeatureCounts(orgId: string)`
Get counts of enabled/disabled features.

**Returns:**
```typescript
{
  enabled: number
  disabled: number
  total: number
}
```

## Migration Guide

### Applying the Migration

1. **Development:**
```bash
npx prisma migrate dev
```

2. **Production:**
```bash
npx prisma migrate deploy
```

The migration automatically seeds existing organizations with all features enabled.

### Rollback

If needed, you can rollback by:
1. Removing the `OrganizationFeatures` model from schema
2. Creating a new migration to drop the table
3. Removing feature-related code

## Best Practices

1. **Default to Enabled**: New features should default to `true` to avoid breaking existing organizations
2. **Fail Open**: On errors, allow access rather than blocking users
3. **Parent-Child Logic**: Always check parent feature before sub-features
4. **Performance**: Cache feature checks where possible
5. **User Communication**: Clearly communicate when features are disabled
6. **Testing**: Test feature combinations thoroughly

## Troubleshooting

### Features Not Filtering in Sidebar

1. Check browser console for errors
2. Verify `getUserEnabledFeatures` is returning correct data
3. Check that feature keys match between metadata and sidebar

### Platform Admin Can't Access Feature Management

1. Verify user has `isPlatformAdmin` flag set
2. Check platform admin authentication in actions
3. Review server logs for errors

### Migration Fails

1. Check database connection
2. Verify schema syntax
3. Ensure no conflicting migrations
4. Check for database locks

## Future Enhancements

- [ ] Feature usage analytics
- [ ] Scheduled feature rollouts
- [ ] Feature flags for A/B testing
- [ ] Organization-specific feature requests
- [ ] Automated feature recommendations based on usage
- [ ] Feature dependency management
- [ ] Bulk organization feature updates

## Related Documentation

- [Platform Admin Guide](../platform-admin/README.md)
- [Permissions System](../../lib/permissions/README.md)
- [Database Schema](../../prisma/README.md)

