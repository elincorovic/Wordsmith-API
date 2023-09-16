/*
  Warnings:

  - You are about to drop the column `img_path` on the `Book` table. All the data in the column will be lost.
  - Added the required column `slug` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Book_img_path_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "img_path",
ADD COLUMN     "slug" TEXT NOT NULL;
