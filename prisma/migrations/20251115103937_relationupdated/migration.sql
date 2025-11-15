/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `TimeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TimeEntry` table. All the data in the column will be lost.
  - You are about to drop the `_UserTeams` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `hours` to the `TimeEntry` table without a default value. This is not possible if the table is not empty.
  - Made the column `taskId` on table `TimeEntry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropForeignKey
ALTER TABLE "TimeEntry" DROP CONSTRAINT "TimeEntry_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TimeEntry" DROP CONSTRAINT "TimeEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserTeams" DROP CONSTRAINT "_UserTeams_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserTeams" DROP CONSTRAINT "_UserTeams_B_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "TimeEntry" DROP COLUMN "duration",
DROP COLUMN "userId",
ADD COLUMN     "hours" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "taskId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "teamId" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "_UserTeams";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
