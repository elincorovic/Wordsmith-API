/*
  Warnings:

  - You are about to drop the column `img_path` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `img_path` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_img_path_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "img_path";

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "comment" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "img_path";
