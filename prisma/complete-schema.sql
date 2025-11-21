-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sport" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "phone" TEXT,
    "authProvider" TEXT NOT NULL DEFAULT 'email',
    "authProviderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "language" TEXT,
    "timezone" TEXT,
    "dateFormat" TEXT,
    "timeFormat" TEXT,
    "notificationSettings" JSONB,
    "roleNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isPlatformAdmin" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT NOT NULL,
    "personId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_organizations" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'player',
    "position" TEXT,
    "jerseyNumber" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "tags" TEXT[],

    CONSTRAINT "person_organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permissions" TEXT[],
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "organization_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "organizationId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "schema" JSONB NOT NULL,
    "organizationId" TEXT NOT NULL,
    "templateId" TEXT,
    "scheduleType" TEXT NOT NULL DEFAULT 'one_time',
    "scheduledAt" TIMESTAMP(3),
    "recurringRule" JSONB,
    "targetType" TEXT NOT NULL DEFAULT 'all',
    "targetIds" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_responses" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "personOrgId" TEXT NOT NULL,
    "userId" TEXT,
    "responses" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sections" JSONB NOT NULL DEFAULT '{}',
    "sectionConfigs" JSONB NOT NULL DEFAULT '{}',
    "defaultDuration" INTEGER NOT NULL DEFAULT 120,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringRule" TEXT,
    "seriesId" TEXT,
    "organizationId" TEXT NOT NULL,
    "templateId" TEXT,
    "linkedFormId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_attendance" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "personOrgId" TEXT NOT NULL,
    "userId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'invited',
    "notes" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" JSONB NOT NULL,
    "privacyLevel" TEXT NOT NULL DEFAULT 'public',
    "organizationId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "linkedPersonId" TEXT,
    "linkedEventId" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_links" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "bucket" TEXT NOT NULL DEFAULT 'files',
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "url" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "organizationId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "linkedPersonId" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "version" INTEGER NOT NULL DEFAULT 1,
    "previousVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_links" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spreadsheet_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "sampleData" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spreadsheet_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spreadsheets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "schema" JSONB NOT NULL,
    "data" JSONB NOT NULL,
    "templateId" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spreadsheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spreadsheet_versions" (
    "id" TEXT NOT NULL,
    "spreadsheetId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "schema" JSONB NOT NULL,
    "data" JSONB NOT NULL,
    "createdById" TEXT,
    "changeNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spreadsheet_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canvas_boards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "canvas_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drawing_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "sport" TEXT NOT NULL DEFAULT 'football',
    "data" JSONB NOT NULL,
    "thumbnailUrl" TEXT,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drawing_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drawings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "tags" TEXT[],
    "data" JSONB NOT NULL,
    "thumbnailUrl" TEXT,
    "linkedToType" TEXT,
    "linkedToId" TEXT,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "templateId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drawings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "linkedToType" TEXT,
    "linkedToId" TEXT,
    "ownerId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completedAt" TIMESTAMP(3),
    "completedBy" TEXT,
    "assignedTo" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_links" (
    "id" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "milestone_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_comments" (
    "id" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "milestone_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "userId" TEXT,
    "personId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_templates" (
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
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
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

-- CreateTable
CREATE TABLE "report_schedules" (
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

-- CreateTable
CREATE TABLE "community_templates" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "category" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "tags" TEXT[],
    "features" TEXT[],
    "config" JSONB NOT NULL,
    "previewImage" TEXT,
    "thumbnailUrl" TEXT,
    "authorId" TEXT,
    "authorName" TEXT,
    "orgName" TEXT,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "allowModifications" BOOLEAN NOT NULL DEFAULT true,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'published',
    "moderationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "community_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_reviews" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_usages" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdType" TEXT NOT NULL,
    "createdId" TEXT,
    "createdName" TEXT,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_usages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "person_organizations_personId_organizationId_key" ON "person_organizations"("personId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_roles_name_organizationId_key" ON "organization_roles"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendance_eventId_personOrgId_key" ON "event_attendance"("eventId", "personOrgId");

-- CreateIndex
CREATE INDEX "notes_organizationId_idx" ON "notes"("organizationId");

-- CreateIndex
CREATE INDEX "notes_authorId_idx" ON "notes"("authorId");

-- CreateIndex
CREATE INDEX "notes_linkedPersonId_idx" ON "notes"("linkedPersonId");

-- CreateIndex
CREATE INDEX "notes_linkedEventId_idx" ON "notes"("linkedEventId");

-- CreateIndex
CREATE INDEX "notes_privacyLevel_idx" ON "notes"("privacyLevel");

-- CreateIndex
CREATE INDEX "note_links_noteId_idx" ON "note_links"("noteId");

-- CreateIndex
CREATE INDEX "note_links_targetType_targetId_idx" ON "note_links"("targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "note_links_noteId_targetType_targetId_key" ON "note_links"("noteId", "targetType", "targetId");

-- CreateIndex
CREATE INDEX "files_organizationId_idx" ON "files"("organizationId");

-- CreateIndex
CREATE INDEX "files_uploadedById_idx" ON "files"("uploadedById");

-- CreateIndex
CREATE INDEX "files_linkedPersonId_idx" ON "files"("linkedPersonId");

-- CreateIndex
CREATE INDEX "files_visibility_idx" ON "files"("visibility");

-- CreateIndex
CREATE INDEX "files_mimeType_idx" ON "files"("mimeType");

-- CreateIndex
CREATE INDEX "files_tags_idx" ON "files"("tags");

-- CreateIndex
CREATE INDEX "file_links_fileId_idx" ON "file_links"("fileId");

-- CreateIndex
CREATE INDEX "file_links_targetType_targetId_idx" ON "file_links"("targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "file_links_fileId_targetType_targetId_key" ON "file_links"("fileId", "targetType", "targetId");

-- CreateIndex
CREATE INDEX "drawing_templates_isGlobal_category_idx" ON "drawing_templates"("isGlobal", "category");

-- CreateIndex
CREATE INDEX "drawing_templates_organizationId_category_idx" ON "drawing_templates"("organizationId", "category");

-- CreateIndex
CREATE INDEX "drawing_templates_category_downloads_idx" ON "drawing_templates"("category", "downloads");

-- CreateIndex
CREATE UNIQUE INDEX "drawings_shareToken_key" ON "drawings"("shareToken");

-- CreateIndex
CREATE INDEX "drawings_organizationId_updatedAt_idx" ON "drawings"("organizationId", "updatedAt");

-- CreateIndex
CREATE INDEX "drawings_organizationId_type_idx" ON "drawings"("organizationId", "type");

-- CreateIndex
CREATE INDEX "drawings_organizationId_createdBy_idx" ON "drawings"("organizationId", "createdBy");

-- CreateIndex
CREATE INDEX "drawings_organizationId_name_idx" ON "drawings"("organizationId", "name");

-- CreateIndex
CREATE INDEX "drawings_organizationId_description_idx" ON "drawings"("organizationId", "description");

-- CreateIndex
CREATE INDEX "drawings_organizationId_tags_idx" ON "drawings"("organizationId", "tags");

-- CreateIndex
CREATE INDEX "plans_organizationId_type_idx" ON "plans"("organizationId", "type");

-- CreateIndex
CREATE INDEX "plans_organizationId_status_idx" ON "plans"("organizationId", "status");

-- CreateIndex
CREATE INDEX "plans_organizationId_ownerId_idx" ON "plans"("organizationId", "ownerId");

-- CreateIndex
CREATE INDEX "plans_linkedToType_linkedToId_idx" ON "plans"("linkedToType", "linkedToId");

-- CreateIndex
CREATE INDEX "milestones_planId_order_idx" ON "milestones"("planId", "order");

-- CreateIndex
CREATE INDEX "milestones_planId_status_idx" ON "milestones"("planId", "status");

-- CreateIndex
CREATE INDEX "milestone_links_milestoneId_idx" ON "milestone_links"("milestoneId");

-- CreateIndex
CREATE INDEX "milestone_links_targetType_targetId_idx" ON "milestone_links"("targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "milestone_links_milestoneId_targetType_targetId_key" ON "milestone_links"("milestoneId", "targetType", "targetId");

-- CreateIndex
CREATE INDEX "milestone_comments_milestoneId_idx" ON "milestone_comments"("milestoneId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_organizationId_key" ON "subscriptions"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_plan_idx" ON "subscriptions"("plan");

-- CreateIndex
CREATE INDEX "report_templates_organizationId_idx" ON "report_templates"("organizationId");

-- CreateIndex
CREATE INDEX "report_templates_isGlobal_category_idx" ON "report_templates"("isGlobal", "category");

-- CreateIndex
CREATE UNIQUE INDEX "reports_shareToken_key" ON "reports"("shareToken");

-- CreateIndex
CREATE INDEX "reports_organizationId_idx" ON "reports"("organizationId");

-- CreateIndex
CREATE INDEX "reports_organizationId_type_idx" ON "reports"("organizationId", "type");

-- CreateIndex
CREATE INDEX "reports_createdBy_idx" ON "reports"("createdBy");

-- CreateIndex
CREATE INDEX "reports_shareToken_idx" ON "reports"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "report_schedules_reportId_key" ON "report_schedules"("reportId");

-- CreateIndex
CREATE INDEX "report_schedules_isActive_nextSend_idx" ON "report_schedules"("isActive", "nextSend");

-- CreateIndex
CREATE INDEX "community_templates_type_status_idx" ON "community_templates"("type", "status");

-- CreateIndex
CREATE INDEX "community_templates_category_status_idx" ON "community_templates"("category", "status");

-- CreateIndex
CREATE INDEX "community_templates_sport_status_idx" ON "community_templates"("sport", "status");

-- CreateIndex
CREATE INDEX "community_templates_isOfficial_isFeatured_idx" ON "community_templates"("isOfficial", "isFeatured");

-- CreateIndex
CREATE INDEX "community_templates_status_publishedAt_idx" ON "community_templates"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "community_templates_authorId_idx" ON "community_templates"("authorId");

-- CreateIndex
CREATE INDEX "template_reviews_templateId_idx" ON "template_reviews"("templateId");

-- CreateIndex
CREATE INDEX "template_reviews_userId_idx" ON "template_reviews"("userId");

-- CreateIndex
CREATE INDEX "template_reviews_rating_idx" ON "template_reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "template_reviews_templateId_userId_key" ON "template_reviews"("templateId", "userId");

-- CreateIndex
CREATE INDEX "template_usages_templateId_idx" ON "template_usages"("templateId");

-- CreateIndex
CREATE INDEX "template_usages_userId_idx" ON "template_usages"("userId");

-- CreateIndex
CREATE INDEX "template_usages_usedAt_idx" ON "template_usages"("usedAt");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_organizations" ADD CONSTRAINT "person_organizations_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_organizations" ADD CONSTRAINT "person_organizations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_roles" ADD CONSTRAINT "organization_roles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "organization_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_templates" ADD CONSTRAINT "form_templates_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "form_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_personOrgId_fkey" FOREIGN KEY ("personOrgId") REFERENCES "person_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_templates" ADD CONSTRAINT "event_templates_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "event_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendance" ADD CONSTRAINT "event_attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendance" ADD CONSTRAINT "event_attendance_personOrgId_fkey" FOREIGN KEY ("personOrgId") REFERENCES "person_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendance" ADD CONSTRAINT "event_attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_linkedPersonId_fkey" FOREIGN KEY ("linkedPersonId") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_linkedEventId_fkey" FOREIGN KEY ("linkedEventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_links" ADD CONSTRAINT "note_links_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_linkedPersonId_fkey" FOREIGN KEY ("linkedPersonId") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_links" ADD CONSTRAINT "file_links_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spreadsheet_templates" ADD CONSTRAINT "spreadsheet_templates_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spreadsheets" ADD CONSTRAINT "spreadsheets_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "spreadsheet_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spreadsheets" ADD CONSTRAINT "spreadsheets_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spreadsheet_versions" ADD CONSTRAINT "spreadsheet_versions_spreadsheetId_fkey" FOREIGN KEY ("spreadsheetId") REFERENCES "spreadsheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvas_boards" ADD CONSTRAINT "canvas_boards_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drawing_templates" ADD CONSTRAINT "drawing_templates_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drawings" ADD CONSTRAINT "drawings_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "drawing_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drawings" ADD CONSTRAINT "drawings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_links" ADD CONSTRAINT "milestone_links_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_comments" ADD CONSTRAINT "milestone_comments_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_comments" ADD CONSTRAINT "milestone_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_templates" ADD CONSTRAINT "report_templates_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "report_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_schedules" ADD CONSTRAINT "report_schedules_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_templates" ADD CONSTRAINT "community_templates_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_reviews" ADD CONSTRAINT "template_reviews_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "community_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_reviews" ADD CONSTRAINT "template_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_usages" ADD CONSTRAINT "template_usages_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "community_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_usages" ADD CONSTRAINT "template_usages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

