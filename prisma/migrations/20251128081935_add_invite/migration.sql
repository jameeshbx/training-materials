/*
  Warnings:

  - You are about to drop the column `teamId` on the `Invite` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_teamId_fkey";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "teamId";
