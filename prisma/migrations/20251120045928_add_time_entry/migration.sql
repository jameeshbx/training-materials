/*
  Warnings:

  - You are about to drop the column `duration` on the `TimeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `workedAt` on the `TimeEntry` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `TimeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeEntry" DROP COLUMN "duration",
DROP COLUMN "workedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
