/*
  Warnings:

  - The primary key for the `Invite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `accepted` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `acceptedAt` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `invitedById` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `invitedEmail` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Invite` table. All the data in the column will be lost.
  - The `id` column on the `Invite` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `email` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_invitedById_fkey";

-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_teamId_fkey";

-- DropIndex
DROP INDEX "Invite_invitedEmail_idx";

-- AlterTable
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_pkey",
DROP COLUMN "accepted",
DROP COLUMN "acceptedAt",
DROP COLUMN "invitedById",
DROP COLUMN "invitedEmail",
DROP COLUMN "teamId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "userId" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Invite_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
