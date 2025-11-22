-- Add missing columns to users table
-- These columns exist in prisma/schema.prisma but weren't in the original migration.sql

ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "phone" TEXT,
ADD COLUMN IF NOT EXISTS "language" TEXT,
ADD COLUMN IF NOT EXISTS "timezone" TEXT,
ADD COLUMN IF NOT EXISTS "dateFormat" TEXT,
ADD COLUMN IF NOT EXISTS "timeFormat" TEXT,
ADD COLUMN IF NOT EXISTS "notificationSettings" JSONB;
