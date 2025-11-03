-- Row-Level Security (RLS) Policies for SimpleAM.app
-- Fixed with correct snake_case column names for PostgreSQL

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

CREATE POLICY "Users can view their organization"
ON organizations FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Admins can update organization"
ON organizations FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT orr."organizationId"
    FROM user_roles ur
    JOIN organization_roles orr ON ur."roleId" = orr.id
    WHERE ur."userId" = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

-- ============================================
-- USERS
-- ============================================

CREATE POLICY "Users can view organization members"
ON users FOR SELECT
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (id = auth.uid()::text);

CREATE POLICY "Admins can create users"
ON users FOR INSERT
TO authenticated
WITH CHECK (
  "organizationId" IN (
    SELECT orr."organizationId"
    FROM user_roles ur
    JOIN organization_roles orr ON ur."roleId" = orr.id
    WHERE ur."userId" = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

-- ============================================
-- PERSONS (Players, Staff, etc.)
-- ============================================

CREATE POLICY "Users can view organization persons"
ON persons FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT "personId" FROM person_organizations
    WHERE "organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
    )
  )
);

CREATE POLICY "Users can create persons"
ON persons FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update organization persons"
ON persons FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT "personId" FROM person_organizations
    WHERE "organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
    )
  )
);

CREATE POLICY "Admins can delete persons"
ON persons FOR DELETE
TO authenticated
USING (
  id IN (
    SELECT po."personId"
    FROM person_organizations po
    JOIN users u ON po."organizationId" = u."organizationId"
    JOIN user_roles ur ON u.id = ur."userId"
    JOIN organization_roles orr ON ur."roleId" = orr.id
    WHERE u.id = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

-- ============================================
-- PERSON_ORGANIZATIONS
-- ============================================

CREATE POLICY "Users can view organization person links"
ON person_organizations FOR SELECT
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can create person links"
ON person_organizations FOR INSERT
TO authenticated
WITH CHECK (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can update person links"
ON person_organizations FOR UPDATE
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Admins can delete person links"
ON person_organizations FOR DELETE
TO authenticated
USING (
  "organizationId" IN (
    SELECT orr."organizationId"
    FROM user_roles ur
    JOIN organization_roles orr ON ur."roleId" = orr.id
    WHERE ur."userId" = auth.uid()::text
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
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can create forms"
ON forms FOR INSERT
TO authenticated
WITH CHECK (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can update organization forms"
ON forms FOR UPDATE
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Admins can delete forms"
ON forms FOR DELETE
TO authenticated
USING (
  "organizationId" IN (
    SELECT orr."organizationId"
    FROM user_roles ur
    JOIN organization_roles orr ON ur."roleId" = orr.id
    WHERE ur."userId" = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

-- ============================================
-- FORM RESPONSES
-- ============================================

CREATE POLICY "Users can view form responses"
ON form_responses FOR SELECT
TO authenticated
USING (
  "formId" IN (
    SELECT id FROM forms WHERE "organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
    )
  )
);

CREATE POLICY "Users can create form responses"
ON form_responses FOR INSERT
TO authenticated
WITH CHECK (
  "formId" IN (
    SELECT id FROM forms WHERE "organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
    )
  )
);

-- ============================================
-- EVENTS
-- ============================================

CREATE POLICY "Users can view organization events"
ON events FOR SELECT
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can create events"
ON events FOR INSERT
TO authenticated
WITH CHECK (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can update events"
ON events FOR UPDATE
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can delete events"
ON events FOR DELETE
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

-- ============================================
-- EVENT ATTENDANCE
-- ============================================

CREATE POLICY "Users can view event attendance"
ON event_attendance FOR SELECT
TO authenticated
USING (
  "eventId" IN (
    SELECT id FROM events WHERE "organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
    )
  )
);

CREATE POLICY "Users can record attendance"
ON event_attendance FOR INSERT
TO authenticated
WITH CHECK (
  "eventId" IN (
    SELECT id FROM events WHERE "organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
    )
  )
);

CREATE POLICY "Users can update attendance"
ON event_attendance FOR UPDATE
TO authenticated
USING (
  "eventId" IN (
    SELECT id FROM events WHERE "organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
    )
  )
);

-- ============================================
-- NOTES
-- ============================================

CREATE POLICY "Users can view organization notes"
ON notes FOR SELECT
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can create notes"
ON notes FOR INSERT
TO authenticated
WITH CHECK (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Note authors can update their notes"
ON notes FOR UPDATE
TO authenticated
USING ("authorId" = auth.uid()::text);

CREATE POLICY "Note authors can delete their notes"
ON notes FOR DELETE
TO authenticated
USING ("authorId" = auth.uid()::text);

-- ============================================
-- FILES
-- ============================================

CREATE POLICY "Users can view organization files"
ON files FOR SELECT
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can upload files"
ON files FOR INSERT
TO authenticated
WITH CHECK (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "File uploaders can update their files"
ON files FOR UPDATE
TO authenticated
USING ("uploadedById" = auth.uid()::text);

CREATE POLICY "File uploaders can delete their files"
ON files FOR DELETE
TO authenticated
USING ("uploadedById" = auth.uid()::text);

-- ============================================
-- ACTIVITIES (Audit Log)
-- ============================================

CREATE POLICY "Users can view organization activities"
ON activities FOR SELECT
TO authenticated
USING (
  "userId" IN (
    SELECT id FROM users WHERE "organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
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

CREATE POLICY "Users can view organization spreadsheets"
ON spreadsheets FOR SELECT
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can manage organization spreadsheets"
ON spreadsheets FOR ALL
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can view organization canvas boards"
ON canvas_boards FOR SELECT
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can manage organization canvas boards"
ON canvas_boards FOR ALL
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can view organization plans"
ON plans FOR SELECT
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can manage organization plans"
ON plans FOR ALL
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

-- ============================================
-- ORGANIZATION_ROLES & USER_ROLES
-- ============================================

CREATE POLICY "Users can view organization roles"
ON organization_roles FOR SELECT
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Admins can manage roles"
ON organization_roles FOR ALL
TO authenticated
USING (
  "organizationId" IN (
    SELECT orr."organizationId"
    FROM user_roles ur
    JOIN organization_roles orr ON ur."roleId" = orr.id
    WHERE ur."userId" = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

CREATE POLICY "Users can view user roles"
ON user_roles FOR SELECT
TO authenticated
USING (
  "roleId" IN (
    SELECT orr.id
    FROM organization_roles orr
    WHERE orr."organizationId" IN (
      SELECT "organizationId" FROM users WHERE id = auth.uid()::text
    )
  )
);

CREATE POLICY "Admins can manage user roles"
ON user_roles FOR ALL
TO authenticated
USING (
  "roleId" IN (
    SELECT orr.id
    FROM user_roles ur
    JOIN organization_roles orr ON ur."roleId" = orr.id
    WHERE ur."userId" = auth.uid()::text
    AND orr.name = 'Admin'
  )
);

-- ============================================
-- FORM TEMPLATES & SUBSCRIPTIONS
-- ============================================

CREATE POLICY "Users can view form templates"
ON form_templates FOR SELECT
TO authenticated
USING (
  "organizationId" IS NULL OR
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can create templates"
ON form_templates FOR INSERT
TO authenticated
WITH CHECK (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);

CREATE POLICY "Users can view organization subscriptions"
ON subscriptions FOR SELECT
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" FROM users WHERE id = auth.uid()::text
  )
);
