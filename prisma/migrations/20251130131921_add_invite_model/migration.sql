/*
  Warnings:

  - You are about to drop the column `email` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `invitedBy` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `invitedById` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitedEmail` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_invitedBy_fkey";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "email",
DROP COLUMN "invitedBy",
ADD COLUMN     "invitedById" TEXT NOT NULL,
ADD COLUMN     "invitedEmail" TEXT NOT NULL;

-- DropTable
DROP TABLE "Notification";

-- CreateIndex
CREATE INDEX "Invite_invitedEmail_idx" ON "Invite"("invitedEmail");

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
