-- Migration: Add complete Planner Module
-- This migration updates the existing plans table and adds missing milestone tables

-- Step 1: Update existing plans table to match new schema
-- Drop the old data column first
ALTER TABLE "plans" DROP COLUMN IF EXISTS "data";
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "type" TEXT DEFAULT 'custom';
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'not_started';
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "linkedToType" TEXT;
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "linkedToId" TEXT;
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "ownerId" TEXT;
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN DEFAULT false;
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "isTemplate" BOOLEAN DEFAULT false;
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP WITHOUT TIME ZONE;
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

-- Add indexes for plans table
CREATE INDEX IF NOT EXISTS "plans_organizationId_type_idx" ON "plans"("organizationId", "type");
CREATE INDEX IF NOT EXISTS "plans_organizationId_status_idx" ON "plans"("organizationId", "status");
CREATE INDEX IF NOT EXISTS "plans_organizationId_ownerId_idx" ON "plans"("organizationId", "ownerId");
CREATE INDEX IF NOT EXISTS "plans_linkedToType_linkedToId_idx" ON "plans"("linkedToType", "linkedToId");

-- Step 2: Create milestones table
CREATE TABLE IF NOT EXISTS "milestones" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP WITHOUT TIME ZONE,
    "endDate" TIMESTAMP WITHOUT TIME ZONE,
    "dueDate" TIMESTAMP WITHOUT TIME ZONE,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completedAt" TIMESTAMP WITHOUT TIME ZONE,
    "completedBy" TEXT,
    "assignedTo" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- Create indexes for milestones table
CREATE INDEX IF NOT EXISTS "milestones_planId_order_idx" ON "milestones"("planId", "order");
CREATE INDEX IF NOT EXISTS "milestones_planId_status_idx" ON "milestones"("planId", "status");

-- Step 3: Create milestone_links table
CREATE TABLE IF NOT EXISTS "milestone_links" (
    "id" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "milestone_links_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint to prevent duplicate links
ALTER TABLE "milestone_links" DROP CONSTRAINT IF EXISTS "milestone_links_milestoneId_targetType_targetId_key";
ALTER TABLE "milestone_links" ADD CONSTRAINT "milestone_links_milestoneId_targetType_targetId_key" UNIQUE ("milestoneId", "targetType", "targetId");

-- Create indexes for milestone_links table
CREATE INDEX IF NOT EXISTS "milestone_links_milestoneId_idx" ON "milestone_links"("milestoneId");
CREATE INDEX IF NOT EXISTS "milestone_links_targetType_targetId_idx" ON "milestone_links"("targetType", "targetId");

-- Step 4: Create milestone_comments table
CREATE TABLE IF NOT EXISTS "milestone_comments" (
    "id" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "milestone_comments_pkey" PRIMARY KEY ("id")
);

-- Create indexes for milestone_comments table
CREATE INDEX IF NOT EXISTS "milestone_comments_milestoneId_idx" ON "milestone_comments"("milestoneId");

-- Step 5: Add foreign key constraints

-- Plans table foreign keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'plans_ownerId_fkey') THEN
        ALTER TABLE "plans" ADD CONSTRAINT "plans_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Milestones table foreign keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'milestones_planId_fkey') THEN
        ALTER TABLE "milestones" ADD CONSTRAINT "milestones_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'milestones_assignedTo_fkey') THEN
        ALTER TABLE "milestones" ADD CONSTRAINT "milestones_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'milestones_completedBy_fkey') THEN
        ALTER TABLE "milestones" ADD CONSTRAINT "milestones_completedBy_fkey" FOREIGN KEY ("completedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Milestone links table foreign keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'milestone_links_milestoneId_fkey') THEN
        ALTER TABLE "milestone_links" ADD CONSTRAINT "milestone_links_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Milestone comments table foreign keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'milestone_comments_milestoneId_fkey') THEN
        ALTER TABLE "milestone_comments" ADD CONSTRAINT "milestone_comments_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'milestone_comments_authorId_fkey') THEN
        ALTER TABLE "milestone_comments" ADD CONSTRAINT "milestone_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Step 6: Enable Row Level Security (RLS) on new tables
ALTER TABLE "milestones" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "milestone_links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "milestone_comments" ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies will need to be created separately based on your security requirements
-- The existing plans table should already have RLS enabled

-- Step 7: Update search vectors if needed
-- Add search_vector column to milestones if it doesn't exist
ALTER TABLE "milestones" ADD COLUMN IF NOT EXISTS "search_vector" tsvector;

-- Create search vector update function for milestones
CREATE OR REPLACE FUNCTION update_milestones_search_vector()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for milestones search vector
DROP TRIGGER IF EXISTS update_milestones_search_vector_trigger ON "milestones";
CREATE TRIGGER update_milestones_search_vector_trigger
    BEFORE INSERT OR UPDATE ON "milestones"
    FOR EACH ROW EXECUTE FUNCTION update_milestones_search_vector();

-- Create GIN index for search vector
CREATE INDEX IF NOT EXISTS "milestones_search_vector_idx" ON "milestones" USING gin("search_vector");

-- Update existing rows to populate search vectors
UPDATE "milestones" SET title = title WHERE search_vector IS NULL;

-- Migration complete message
DO $$
BEGIN
    RAISE NOTICE 'Planner Module migration completed successfully!';
    RAISE NOTICE 'Tables created/updated: plans, milestones, milestone_links, milestone_comments';
    RAISE NOTICE 'Indexes and constraints added';
    RAISE NOTICE 'RLS enabled on new tables';
    RAISE NOTICE 'Search vectors configured';
END $$;
