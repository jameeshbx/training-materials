-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
