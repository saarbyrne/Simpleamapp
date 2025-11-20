-- AlterTable
ALTER TABLE "users" ADD COLUMN "isPlatformAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex (optional but helpful for queries)
CREATE INDEX "users_isPlatformAdmin_idx" ON "users"("isPlatformAdmin");
