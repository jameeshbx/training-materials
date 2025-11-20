/*
  Warnings:

  - You are about to drop the column `end` on the `TimeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `TimeEntry` table. All the data in the column will be lost.
  - Added the required column `startAt` to the `TimeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TimeEntry" DROP CONSTRAINT "TimeEntry_taskId_fkey";

-- AlterTable
ALTER TABLE "TimeEntry" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "endAt" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "taskId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
