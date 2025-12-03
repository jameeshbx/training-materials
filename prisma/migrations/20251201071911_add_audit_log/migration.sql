/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `redacted` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `redactedBy` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `AuditLog` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AuditLog_createdAt_idx";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "createdAt",
DROP COLUMN "ip",
DROP COLUMN "level",
DROP COLUMN "redacted",
DROP COLUMN "redactedBy",
DROP COLUMN "userAgent",
ALTER COLUMN "details" DROP NOT NULL,
ALTER COLUMN "details" SET DATA TYPE TEXT;
