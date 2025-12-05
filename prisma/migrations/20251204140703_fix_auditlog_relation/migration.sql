/*
  Warnings:

  - You are about to drop the column `entity` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AuditLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "entity",
DROP COLUMN "entityId",
DROP COLUMN "userId",
ADD COLUMN     "actorEmail" TEXT,
ADD COLUMN     "actorId" TEXT,
ADD COLUMN     "actorRole" TEXT,
ADD COLUMN     "level" TEXT DEFAULT 'info',
ADD COLUMN     "resource" TEXT,
ADD COLUMN     "resourceId" TEXT;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
