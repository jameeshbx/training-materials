/*
  Warnings:

  - You are about to drop the column `hours` on the `TimeEntry` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `TimeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TimeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeEntry" DROP COLUMN "hours",
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
