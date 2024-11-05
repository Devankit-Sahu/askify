/*
  Warnings:

  - You are about to drop the column `userId` on the `messages` table. All the data in the column will be lost.
  - Made the column `userId` on table `files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileId` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_userId_fkey";

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "userId",
ALTER COLUMN "fileId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
