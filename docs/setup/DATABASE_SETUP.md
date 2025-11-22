# Database Setup - Create Tables First

## ⚠️ CRITICAL: Run This BEFORE RLS Policies

The RLS policies require tables to exist. You need to create the tables first using Prisma.

---

## Step 1: Create All Database Tables

### Option A: Using Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/hjzcimtmdxafilgrfeye

2. Click **SQL Editor** in the left sidebar

3. Click **New Query**

4. Copy and paste this SQL (creates all tables from Prisma schema):

```sql
-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    sport TEXT,
    logo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    auth_provider TEXT NOT NULL DEFAULT 'email',
    auth_provider_id TEXT,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    person_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Persons (Players, Staff, etc.)
CREATE TABLE IF NOT EXISTS persons (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TIMESTAMPTZ,
    nationality TEXT,
    phone TEXT,
    email TEXT,
    photo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Person Organizations (Junction Table)
CREATE TABLE IF NOT EXISTS person_organizations (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'player',
    position TEXT,
    jersey_number INTEGER,
    status TEXT,
    tags TEXT[],
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(person_id, organization_id)
);

-- Organization Roles
CREATE TABLE IF NOT EXISTS organization_roles (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, name)
);

-- User Roles
CREATE TABLE IF NOT EXISTS user_roles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id TEXT NOT NULL REFERENCES organization_roles(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Forms
CREATE TABLE IF NOT EXISTS forms (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    settings JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Form Fields
CREATE TABLE IF NOT EXISTS form_fields (
    id TEXT PRIMARY KEY,
    form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    required BOOLEAN NOT NULL DEFAULT false,
    options JSONB,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Form Responses
CREATE TABLE IF NOT EXISTS form_responses (
    id TEXT PRIMARY KEY,
    form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    respondent_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    person_id TEXT REFERENCES persons(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Form Templates
CREATE TABLE IF NOT EXISTS form_templates (
    id TEXT PRIMARY KEY,
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    template_data JSONB NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event Attendance
CREATE TABLE IF NOT EXISTS event_attendance (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    person_id TEXT NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, person_id)
);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    person_id TEXT REFERENCES persons(id) ON DELETE CASCADE,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    tags TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Files
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL,
    uploaded_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    person_id TEXT REFERENCES persons(id) ON DELETE CASCADE,
    folder_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spreadsheets
CREATE TABLE IF NOT EXISTS spreadsheets (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    schema JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spreadsheet Rows
CREATE TABLE IF NOT EXISTS spreadsheet_rows (
    id TEXT PRIMARY KEY,
    spreadsheet_id TEXT NOT NULL REFERENCES spreadsheets(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Canvas Boards
CREATE TABLE IF NOT EXISTS canvas_boards (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Plans
CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activities (Audit Log)
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    data JSONB NOT NULL,
    person_id TEXT REFERENCES persons(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key for person_id in users (circular dependency)
ALTER TABLE users ADD CONSTRAINT users_person_id_fkey
FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_person_organizations_person ON person_organizations(person_id);
CREATE INDEX IF NOT EXISTS idx_person_organizations_org ON person_organizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_organization ON forms(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_organization ON events(organization_id);
CREATE INDEX IF NOT EXISTS idx_notes_organization ON notes(organization_id);
CREATE INDEX IF NOT EXISTS idx_files_organization ON files(organization_id);
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);
```

5. Click **Run** (or press Cmd/Ctrl + Enter)

6. Wait for "Success. No rows returned" message

### Option B: Using Prisma (If Above Fails)

If you prefer to use Prisma, you need to use the DIRECT connection (not pooler):

```bash
# Create a temporary env override
export DATABASE_URL="postgresql://postgres:%2BG%2Ba.8PbaUjBrry@db.hjzcimtmdxafilgrfeye.supabase.co:5432/postgres"

# Push schema
npx prisma db push --accept-data-loss

# Generate Prisma client
npx prisma generate
```

**Note:** Prisma db push can hang with connection poolers. Using the direct connection (port 5432) or the SQL method above is more reliable.

---

## Step 2: Verify Tables Were Created

In Supabase SQL Editor, run:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see 20 tables:
- activities
- canvas_boards
- event_attendance
- events
- files
- form_fields
- form_responses
- form_templates
- forms
- notes
- organization_roles
- organizations
- person_organizations
- persons
- plans
- spreadsheet_rows
- spreadsheets
- subscriptions
- user_roles
- users

---

## Step 3: NOW Run RLS Policies

Once tables exist, follow the original instructions:

1. Go to **SQL Editor** in Supabase Dashboard

2. Open [RLS_POLICIES.sql](RLS_POLICIES.sql)

3. Copy the entire file contents

4. Paste into SQL Editor

5. Click **Run**

6. Wait for completion (may take 30-60 seconds for all policies)

---

## Step 4: Create Storage Bucket

Follow [SETUP_INSTRUCTIONS.md Step 2](SETUP_INSTRUCTIONS.md#step-2-create-storage-bucket)

---

## Troubleshooting

### "relation already exists"
- Tables already created - skip to Step 3 (RLS policies)

### "permission denied"
- Make sure you're using the service role key, not anon key
- Check you're running in Supabase SQL Editor (has full permissions)

### Prisma hangs on db push
- Use the SQL method above instead
- OR use DIRECT_URL connection (port 5432, not 6543)

### "prepared statement already exists"
- This is from connection pooler - use direct connection or SQL method

---

## Quick Summary

1. **Create tables** (SQL method recommended - copy/paste above SQL)
2. **Run RLS policies** ([RLS_POLICIES.sql](RLS_POLICIES.sql))
3. **Create storage bucket** ([SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md))
4. **Test the app!**

Total time: 15 minutes
