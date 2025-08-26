/*
  Warnings:

  - A unique constraint covering the columns `[url,userId]` on the table `RssFeed` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RssFeed" DROP CONSTRAINT "RssFeed_userId_fkey";

-- DropIndex
DROP INDEX "RssFeed_url_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sentimentScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5;

-- CreateIndex
CREATE UNIQUE INDEX "RssFeed_url_userId_key" ON "RssFeed"("url", "userId");

-- AddForeignKey
ALTER TABLE "RssFeed" ADD CONSTRAINT "RssFeed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
