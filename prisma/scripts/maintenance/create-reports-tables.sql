-- Create Report Templates Table
CREATE TABLE IF NOT EXISTS "report_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "sections" JSONB,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT,
    "createdBy" TEXT,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "rating" FLOAT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_templates_pkey" PRIMARY KEY ("id")
);

-- Create Reports Table
CREATE TABLE IF NOT EXISTS "reports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "templateId" TEXT,
    "config" JSONB NOT NULL,
    "sections" JSONB,
    "insights" JSONB,
    "organizationId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- Create Report Schedules Table
CREATE TABLE IF NOT EXISTS "report_schedules" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "dayOfWeek" INTEGER,
    "dayOfMonth" INTEGER,
    "recipients" TEXT[],
    "format" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSent" TIMESTAMP(3),
    "nextSend" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_schedules_pkey" PRIMARY KEY ("id")
);

-- Add missing columns to existing tables if they don't exist
DO $$
BEGIN
    -- Add missing columns to users table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'language') THEN
        ALTER TABLE "users" ADD COLUMN "language" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'timezone') THEN
        ALTER TABLE "users" ADD COLUMN "timezone" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'dateFormat') THEN
        ALTER TABLE "users" ADD COLUMN "dateFormat" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'timeFormat') THEN
        ALTER TABLE "users" ADD COLUMN "timeFormat" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'notificationSettings') THEN
        ALTER TABLE "users" ADD COLUMN "notificationSettings" JSONB;
    END IF;

    -- Add missing columns to spreadsheets table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'spreadsheets' AND column_name = 'templateId') THEN
        ALTER TABLE "spreadsheets" ADD COLUMN "templateId" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'spreadsheets' AND column_name = 'createdById') THEN
        ALTER TABLE "spreadsheets" ADD COLUMN "createdById" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'spreadsheets' AND column_name = 'version') THEN
        ALTER TABLE "spreadsheets" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;
    END IF;

    -- Add missing columns to notes table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'linkedEventId') THEN
        ALTER TABLE "notes" ADD COLUMN "linkedEventId" TEXT;
    END IF;
END $$;

-- Create Indexes
CREATE INDEX IF NOT EXISTS "report_templates_organizationId_idx" ON "report_templates"("organizationId");
CREATE INDEX IF NOT EXISTS "report_templates_isGlobal_category_idx" ON "report_templates"("isGlobal", "category");
CREATE INDEX IF NOT EXISTS "reports_organizationId_idx" ON "reports"("organizationId");
CREATE INDEX IF NOT EXISTS "reports_organizationId_type_idx" ON "reports"("organizationId", "type");
CREATE INDEX IF NOT EXISTS "reports_createdBy_idx" ON "reports"("createdBy");
CREATE INDEX IF NOT EXISTS "reports_shareToken_key" ON "reports"("shareToken");
CREATE INDEX IF NOT EXISTS "report_schedules_isActive_nextSend_idx" ON "report_schedules"("isActive", "nextSend");

-- Create Unique Constraints
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'report_schedules_reportId_key') THEN
        ALTER TABLE "report_schedules" ADD CONSTRAINT "report_schedules_reportId_key" UNIQUE ("reportId");
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reports_shareToken_key') THEN
        ALTER TABLE "reports" ADD CONSTRAINT "reports_shareToken_key" UNIQUE ("shareToken");
    END IF;
END $$;

-- Add Foreign Key Constraints
DO $$
BEGIN
    -- Report Templates
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'report_templates_organizationId_fkey') THEN
        ALTER TABLE "report_templates" ADD CONSTRAINT "report_templates_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Reports
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reports_templateId_fkey') THEN
        ALTER TABLE "reports" ADD CONSTRAINT "reports_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "report_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reports_organizationId_fkey') THEN
        ALTER TABLE "reports" ADD CONSTRAINT "reports_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Report Schedules
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'report_schedules_reportId_fkey') THEN
        ALTER TABLE "report_schedules" ADD CONSTRAINT "report_schedules_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Add missing foreign keys for existing tables
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'spreadsheets_templateId_fkey') THEN
        ALTER TABLE "spreadsheets" ADD CONSTRAINT "spreadsheets_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "spreadsheet_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notes_linkedEventId_fkey') THEN
        ALTER TABLE "notes" ADD CONSTRAINT "notes_linkedEventId_fkey" FOREIGN KEY ("linkedEventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
