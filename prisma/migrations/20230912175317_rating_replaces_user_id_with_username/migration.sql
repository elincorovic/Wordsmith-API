/*
  Warnings:

  - You are about to drop the column `authorId` on the `Rating` table. All the data in the column will be lost.
  - Added the required column `username` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_authorId_fkey";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "authorId",
ADD COLUMN     "username" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
