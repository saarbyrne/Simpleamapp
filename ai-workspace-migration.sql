-- AI Workspace Migration SQL
-- Paste this directly into Supabase SQL Editor

-- ============================================
-- CREATE AI WORKSPACE TABLES
-- ============================================

-- Create ai_workspaces table
CREATE TABLE IF NOT EXISTS ai_workspaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    artifact_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    initial_prompt TEXT NOT NULL,
    artifact_data JSONB,
    generated_content JSONB,
    published_at TIMESTAMPTZ,
    published_to JSONB,
    version INTEGER NOT NULL DEFAULT 1,
    organization_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ai_workspaces_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE
);

-- Create ai_workspace_messages table
CREATE TABLE IF NOT EXISTS ai_workspace_messages (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ai_workspace_messages_workspace
        FOREIGN KEY (workspace_id)
        REFERENCES ai_workspaces(id)
        ON DELETE CASCADE
);

-- ============================================
-- CREATE INDEXES
-- ============================================

-- Indexes for ai_workspaces
CREATE INDEX IF NOT EXISTS idx_ai_workspaces_organization_id
    ON ai_workspaces(organization_id);

CREATE INDEX IF NOT EXISTS idx_ai_workspaces_user_id
    ON ai_workspaces(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_workspaces_artifact_type
    ON ai_workspaces(artifact_type);

CREATE INDEX IF NOT EXISTS idx_ai_workspaces_status
    ON ai_workspaces(status);

-- Indexes for ai_workspace_messages
CREATE INDEX IF NOT EXISTS idx_ai_workspace_messages_workspace_id
    ON ai_workspace_messages(workspace_id);

CREATE INDEX IF NOT EXISTS idx_ai_workspace_messages_created_at
    ON ai_workspace_messages(created_at);

-- ============================================
-- UPDATE ORGANIZATION FEATURES
-- ============================================

-- Add aiWorkspaceEnabled column to organization_features table
ALTER TABLE organization_features
ADD COLUMN IF NOT EXISTS ai_workspace_enabled BOOLEAN NOT NULL DEFAULT true;

-- Update existing organization_features records to enable AI Workspace
UPDATE organization_features
SET ai_workspace_enabled = true
WHERE ai_workspace_enabled IS NULL;

-- ============================================
-- CREATE TRIGGER FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for ai_workspaces
DROP TRIGGER IF EXISTS update_ai_workspaces_updated_at ON ai_workspaces;
CREATE TRIGGER update_ai_workspaces_updated_at
    BEFORE UPDATE ON ai_workspaces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFY MIGRATION
-- ============================================

-- Check that tables exist
SELECT
    'ai_workspaces' as table_name,
    COUNT(*) as row_count
FROM ai_workspaces
UNION ALL
SELECT
    'ai_workspace_messages' as table_name,
    COUNT(*) as row_count
FROM ai_workspace_messages
UNION ALL
SELECT
    'organization_features (with ai_workspace_enabled)' as table_name,
    COUNT(*) as row_count
FROM organization_features
WHERE ai_workspace_enabled IS NOT NULL;

-- ============================================
-- ROLLBACK (OPTIONAL - ONLY IF NEEDED)
-- ============================================

/*
-- Uncomment and run these if you need to rollback the migration

DROP TRIGGER IF EXISTS update_ai_workspaces_updated_at ON ai_workspaces;
DROP TABLE IF EXISTS ai_workspace_messages CASCADE;
DROP TABLE IF EXISTS ai_workspaces CASCADE;
ALTER TABLE organization_features DROP COLUMN IF EXISTS ai_workspace_enabled;
*/
