/*
  Warnings:

  - You are about to drop the column `bookId` on the `Rating` table. All the data in the column will be lost.
  - Added the required column `bookSlug` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_bookId_fkey";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "bookId",
ADD COLUMN     "bookSlug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_bookSlug_fkey" FOREIGN KEY ("bookSlug") REFERENCES "Book"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
