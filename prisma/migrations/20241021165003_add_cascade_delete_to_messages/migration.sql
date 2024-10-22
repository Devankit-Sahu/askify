-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_fileId_fkey";

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
