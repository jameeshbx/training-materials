/*
  Warnings:

  - You are about to drop the column `invitedById` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `invitedEmail` on the `Invite` table. All the data in the column will be lost.
  - Added the required column `email` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitedBy` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_invitedById_fkey";

-- DropIndex
DROP INDEX "Invite_invitedEmail_idx";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "invitedById",
DROP COLUMN "invitedEmail",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "invitedBy" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "data" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
