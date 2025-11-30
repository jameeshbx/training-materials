/*
  Warnings:

  - You are about to drop the column `userId` on the `Invite` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_userId_fkey";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
