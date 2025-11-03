-- Row-Level Security (RLS) Policies for SimpleAM.app
-- Run these in Supabase SQL Editor after Prisma migration

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE spreadsheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ORGANIZATIONS
-- ============================================

-- Users can only see their own organization
CREATE POLICY "Users can view their organization"
ON organizations FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

-- Only admins can update organization
CREATE POLICY "Admins can update organization"
ON organizations FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT ur.organization_id
    FROM user_roles ur
    JOIN organization_roles orr ON ur.role_id = orr.id
    WHERE ur.user_id = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

-- ============================================
-- USERS
-- ============================================

-- Users can view users in their organization
CREATE POLICY "Users can view organization members"
ON users FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (id = auth.uid()::text);

-- Admins can create users
CREATE POLICY "Admins can create users"
ON users FOR INSERT
TO authenticated
WITH CHECK (
  organization_id IN (
    SELECT ur.organization_id
    FROM user_roles ur
    JOIN organization_roles orr ON ur.role_id = orr.id
    WHERE ur.user_id = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

-- ============================================
-- PERSONS (Players, Staff, etc.)
-- ============================================

-- Users can view persons in their organization
CREATE POLICY "Users can view organization persons"
ON persons FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT person_id FROM person_organizations
    WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()::text
    )
  )
);

-- Authenticated users can create persons
CREATE POLICY "Users can create persons"
ON persons FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can update persons in their organization
CREATE POLICY "Users can update organization persons"
ON persons FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT person_id FROM person_organizations
    WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()::text
    )
  )
);

-- Admins can delete persons
CREATE POLICY "Admins can delete persons"
ON persons FOR DELETE
TO authenticated
USING (
  id IN (
    SELECT po.person_id
    FROM person_organizations po
    JOIN user_roles ur ON po.organization_id = ur.organization_id
    JOIN organization_roles orr ON ur.role_id = orr.id
    WHERE ur.user_id = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

-- ============================================
-- PERSON_ORGANIZATIONS
-- ============================================

-- Users can view person-org links in their organization
CREATE POLICY "Users can view organization person links"
ON person_organizations FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

-- Users can create person-org links in their organization
CREATE POLICY "Users can create person links"
ON person_organizations FOR INSERT
TO authenticated
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

-- Users can update person-org links in their organization
CREATE POLICY "Users can update person links"
ON person_organizations FOR UPDATE
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

-- Admins can delete person-org links
CREATE POLICY "Admins can delete person links"
ON person_organizations FOR DELETE
TO authenticated
USING (
  organization_id IN (
    SELECT ur.organization_id
    FROM user_roles ur
    JOIN organization_roles orr ON ur.role_id = orr.id
    WHERE ur.user_id = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

-- ============================================
-- FORMS
-- ============================================

CREATE POLICY "Users can view organization forms"
ON forms FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can create forms"
ON forms FOR INSERT
TO authenticated
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can update organization forms"
ON forms FOR UPDATE
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Admins can delete forms"
ON forms FOR DELETE
TO authenticated
USING (
  organization_id IN (
    SELECT ur.organization_id
    FROM user_roles ur
    JOIN organization_roles orr ON ur.role_id = orr.id
    WHERE ur.user_id = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

-- ============================================
-- EVENTS
-- ============================================

CREATE POLICY "Users can view organization events"
ON events FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can create events"
ON events FOR INSERT
TO authenticated
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can update events"
ON events FOR UPDATE
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can delete events"
ON events FOR DELETE
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

-- ============================================
-- NOTES
-- ============================================

CREATE POLICY "Users can view organization notes"
ON notes FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can create notes"
ON notes FOR INSERT
TO authenticated
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Note authors can update their notes"
ON notes FOR UPDATE
TO authenticated
USING (author_id = auth.uid()::text);

CREATE POLICY "Note authors can delete their notes"
ON notes FOR DELETE
TO authenticated
USING (author_id = auth.uid()::text);

-- ============================================
-- FILES
-- ============================================

CREATE POLICY "Users can view organization files"
ON files FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can upload files"
ON files FOR INSERT
TO authenticated
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "File uploaders can update their files"
ON files FOR UPDATE
TO authenticated
USING (uploaded_by = auth.uid()::text);

CREATE POLICY "File uploaders can delete their files"
ON files FOR DELETE
TO authenticated
USING (uploaded_by = auth.uid()::text);

-- ============================================
-- ACTIVITIES (Audit Log)
-- ============================================

CREATE POLICY "Users can view organization activities"
ON activities FOR SELECT
TO authenticated
USING (
  user_id IN (
    SELECT id FROM users WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()::text
    )
  )
);

CREATE POLICY "System can create activities"
ON activities FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- SPREADSHEETS, CANVAS, PLANS
-- ============================================

-- Similar patterns for remaining tables
CREATE POLICY "Users can view organization spreadsheets"
ON spreadsheets FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can manage organization spreadsheets"
ON spreadsheets FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can view organization canvas boards"
ON canvas_boards FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can manage organization canvas boards"
ON canvas_boards FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can view organization plans"
ON plans FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can manage organization plans"
ON plans FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

-- ============================================
-- ORGANIZATION_ROLES & USER_ROLES
-- ============================================

CREATE POLICY "Users can view organization roles"
ON organization_roles FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Admins can manage roles"
ON organization_roles FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT ur.organization_id
    FROM user_roles ur
    JOIN organization_roles orr ON ur.role_id = orr.id
    WHERE ur.user_id = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

CREATE POLICY "Users can view user roles"
ON user_roles FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Admins can manage user roles"
ON user_roles FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT ur.organization_id
    FROM user_roles ur
    JOIN organization_roles orr ON ur.role_id = orr.id
    WHERE ur.user_id = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

-- ============================================
-- VERIFICATION
-- ============================================

-- To verify RLS is enabled on all tables:
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- To view all policies:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
