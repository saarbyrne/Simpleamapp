# RLS Policies - Final Fixed Version

## What Was Fixed

The RLS_POLICIES_FIXED.sql file has been corrected to address all schema mismatches. Here's what was wrong and how it was fixed:

### Issue 1: Column Name Case Sensitivity
**Problem:** Original policies used snake_case (`organization_id`) but Prisma generates camelCase columns (`organizationId`)
**Fix:** All column names now use quoted camelCase identifiers: `"organizationId"`, `"userId"`, etc.

### Issue 2: user_roles Table Structure Misunderstanding
**Problem:** Policies tried to access `ur."organizationId"` from the `user_roles` table, but that column doesn't exist there.

**Schema Structure:**
```
user_roles:
  - id
  - userId
  - roleId
  (NO organizationId column)

organization_roles:
  - id
  - name
  - permissions
  - organizationId  <-- organizationId is HERE
```

**Fix:** Changed all occurrences of `ur."organizationId"` to `orr."organizationId"` in JOIN queries.

### Fixed Policies

#### 1. Organizations - Admin Update
```sql
-- BEFORE (WRONG):
SELECT ur."organizationId"
FROM user_roles ur
JOIN organization_roles orr ON ur."roleId" = orr.id

-- AFTER (CORRECT):
SELECT orr."organizationId"
FROM user_roles ur
JOIN organization_roles orr ON ur."roleId" = orr.id
```

#### 2. Users - Admin Create
Same fix as above - changed `ur."organizationId"` to `orr."organizationId"`

#### 3. Persons - Admin Delete
```sql
-- BEFORE (WRONG):
JOIN user_roles ur ON po."organizationId" = ur."organizationId"

-- AFTER (CORRECT):
JOIN users u ON po."organizationId" = u."organizationId"
JOIN user_roles ur ON u.id = ur."userId"
```

#### 4. Person Organizations - Admin Delete
Changed `ur."organizationId"` to `orr."organizationId"`

#### 5. Forms - Admin Delete
Changed `ur."organizationId"` to `orr."organizationId"`

#### 6. Organization Roles - Admin Manage
Changed `ur."organizationId"` to `orr."organizationId"`

#### 7. User Roles - View Policy
```sql
-- BEFORE (WRONG):
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
)

-- AFTER (CORRECT):
USING (
  "roleId" IN (
    SELECT orr.id
    FROM organization_roles orr
    WHERE orr."organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
    )
  )
)
```

#### 8. User Roles - Admin Manage
```sql
-- BEFORE (WRONG):
"organizationId" IN (
  SELECT ur."organizationId"
  FROM user_roles ur
  ...
)

-- AFTER (CORRECT):
"roleId" IN (
  SELECT orr.id
  FROM user_roles ur
  JOIN organization_roles orr ON ur."roleId" = orr.id
  WHERE ur."userId" = auth.uid()::text
  AND orr.name = 'Admin'
)
```

#### 9. Files - Update/Delete Policies
```sql
-- BEFORE (WRONG):
USING ("uploadedBy" = auth.uid()::text)

-- AFTER (CORRECT):
USING ("uploadedById" = auth.uid()::text)
```

## How to Apply

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy the contents of `documents/RLS_POLICIES_FIXED.sql`
4. Paste and run the SQL
5. All policies should now execute without errors

## What These Policies Do

The RLS policies enforce multi-tenant security by ensuring:

1. **Organization Isolation**: Users can only see data from their own organization
2. **Role-Based Access**: Admins have additional permissions for management operations
3. **Ownership Rules**: Users can only modify their own content (notes, files)
4. **Cascade Filtering**: Related data is automatically filtered through organization membership

## Next Steps

After running the RLS policies successfully:

1. Create the Storage bucket for player photos ([SUPABASE_STORAGE_SETUP.md](./SUPABASE_STORAGE_SETUP.md))
2. Test player creation with photo upload
3. Test CSV import functionality
4. Verify error boundaries and loading states work correctly
