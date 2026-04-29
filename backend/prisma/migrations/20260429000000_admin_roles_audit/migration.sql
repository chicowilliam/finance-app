-- Create enums
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');
CREATE TYPE "AuditAction" AS ENUM ('user_deactivated', 'user_reactivated', 'user_deleted');

-- Alter users
ALTER TABLE "User"
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'user',
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Create admin audit logs
CREATE TABLE "AdminAuditLog" (
  "id" SERIAL NOT NULL,
  "action" "AuditAction" NOT NULL,
  "actorUserId" INTEGER NOT NULL,
  "targetUserId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "details" TEXT,
  CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminAuditLog_actorUserId_idx" ON "AdminAuditLog"("actorUserId");
CREATE INDEX "AdminAuditLog_targetUserId_idx" ON "AdminAuditLog"("targetUserId");
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");

ALTER TABLE "AdminAuditLog"
  ADD CONSTRAINT "AdminAuditLog_actorUserId_fkey"
  FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AdminAuditLog"
  ADD CONSTRAINT "AdminAuditLog_targetUserId_fkey"
  FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
