-- Fix AI Workspace Tables
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS ai_workspace_messages CASCADE;
DROP TABLE IF EXISTS ai_workspaces CASCADE;

-- Create ai_workspaces table with correct column names
CREATE TABLE ai_workspaces (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    "artifactType" TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    "initialPrompt" TEXT NOT NULL,
    "artifactData" JSONB,
    "generatedContent" JSONB,
    "publishedAt" TIMESTAMPTZ,
    "publishedTo" JSONB,
    version INTEGER NOT NULL DEFAULT 1,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ai_workspaces_organization
        FOREIGN KEY ("organizationId")
        REFERENCES organizations(id)
        ON DELETE CASCADE
);

-- Create ai_workspace_messages table
CREATE TABLE ai_workspace_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "workspaceId" TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ai_workspace_messages_workspace
        FOREIGN KEY ("workspaceId")
        REFERENCES ai_workspaces(id)
        ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_ai_workspaces_organization_id ON ai_workspaces("organizationId");
CREATE INDEX idx_ai_workspaces_user_id ON ai_workspaces("userId");
CREATE INDEX idx_ai_workspaces_artifact_type ON ai_workspaces("artifactType");
CREATE INDEX idx_ai_workspaces_status ON ai_workspaces(status);

CREATE INDEX idx_ai_workspace_messages_workspace_id ON ai_workspace_messages("workspaceId");
CREATE INDEX idx_ai_workspace_messages_created_at ON ai_workspace_messages("createdAt");

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ai_workspaces_updated_at ON ai_workspaces;
CREATE TRIGGER update_ai_workspaces_updated_at
    BEFORE UPDATE ON ai_workspaces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify tables exist
SELECT 'ai_workspaces' as table_name, COUNT(*) as row_count FROM ai_workspaces
UNION ALL
SELECT 'ai_workspace_messages' as table_name, COUNT(*) as row_count FROM ai_workspace_messages;
