-- Additional RLS Policies for Staff Management
-- These policies work with the new roleNames and permissions fields on the users table

-- ============================================
-- STAFF MANAGEMENT POLICIES
-- ============================================

-- Drop existing policy to replace it with more granular one
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Users can update their own profile (except permissions)
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (id = auth.uid()::text)
WITH CHECK (
  id = auth.uid()::text
  -- Prevent users from modifying their own permissions array
  AND (
    permissions IS NOT DISTINCT FROM (
      SELECT permissions FROM users WHERE id = auth.uid()::text
    )
  )
);

-- Admins can update any user's profile including permissions
CREATE POLICY "Admins can update staff profiles"
ON users FOR UPDATE
TO authenticated
USING (
  "organizationId" IN (
    SELECT u."organizationId"
    FROM users u
    WHERE u.id = auth.uid()::text
    AND 'admin' = ANY(u.permissions)
  )
)
WITH CHECK (
  "organizationId" IN (
    SELECT u."organizationId"
    FROM users u
    WHERE u.id = auth.uid()::text
    AND 'admin' = ANY(u.permissions)
  )
);

-- Users with manage_staff permission can update other staff roles (but not permissions)
CREATE POLICY "Staff managers can update roles"
ON users FOR UPDATE
TO authenticated
USING (
  "organizationId" IN (
    SELECT u."organizationId"
    FROM users u
    WHERE u.id = auth.uid()::text
    AND ('manage_staff' = ANY(u.permissions) OR 'admin' = ANY(u.permissions))
  )
)
WITH CHECK (
  "organizationId" IN (
    SELECT u."organizationId"
    FROM users u
    WHERE u.id = auth.uid()::text
    AND ('manage_staff' = ANY(u.permissions) OR 'admin' = ANY(u.permissions))
  )
  -- Prevent non-admins from modifying permissions
  AND (
    'admin' = ANY((SELECT permissions FROM users WHERE id = auth.uid()::text))
    OR permissions IS NOT DISTINCT FROM (
      SELECT permissions FROM users WHERE id = (
        SELECT id FROM users WHERE id = users.id LIMIT 1
      )
    )
  )
);

-- ============================================
-- ACTIVITY LOG POLICIES FOR STAFF ACTIONS
-- ============================================

CREATE POLICY "Users can view organization activities"
ON activities FOR SELECT
TO authenticated
USING (
  "userId" IN (
    SELECT id FROM users
    WHERE "organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
    )
  )
  OR "personId" IN (
    SELECT "personId" FROM person_organizations
    WHERE "organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
    )
  )
);

CREATE POLICY "Users can create activities"
ON activities FOR INSERT
TO authenticated
WITH CHECK (
  "userId" = auth.uid()::text
  OR "personId" IN (
    SELECT "personId" FROM person_organizations
    WHERE "organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
    )
  )
);

-- ============================================
-- NOTES POLICIES FOR STAFF
-- ============================================

-- Staff can view notes based on privacy level and their permissions
DROP POLICY IF EXISTS "Users can view organization notes" ON notes;

CREATE POLICY "Users can view organization notes"
ON notes FOR SELECT
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
  AND (
    -- Public notes visible to all
    "privacyLevel" = 'public'
    -- Medical notes only for users with medical_access or admin
    OR ("privacyLevel" = 'medical' AND (
      'medical_access' = ANY((SELECT permissions FROM users WHERE id = auth.uid()::text))
      OR 'admin' = ANY((SELECT permissions FROM users WHERE id = auth.uid()::text))
    ))
    -- Mental health notes only for users with mental_health_access or admin
    OR ("privacyLevel" = 'mental_health' AND (
      'mental_health_access' = ANY((SELECT permissions FROM users WHERE id = auth.uid()::text))
      OR 'admin' = ANY((SELECT permissions FROM users WHERE id = auth.uid()::text))
    ))
    -- Private notes only for author or admin
    OR ("privacyLevel" = 'private' AND (
      "authorId" = auth.uid()::text
      OR 'admin' = ANY((SELECT permissions FROM users WHERE id = auth.uid()::text))
    ))
    -- Author can always see their own notes
    OR "authorId" = auth.uid()::text
  )
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user has a specific permission
CREATE OR REPLACE FUNCTION user_has_permission(user_id text, required_permission text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
    AND (
      'admin' = ANY(permissions)
      OR required_permission = ANY(permissions)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION user_is_admin(user_id text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
    AND 'admin' = ANY(permissions)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
