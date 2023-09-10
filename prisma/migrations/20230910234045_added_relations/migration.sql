/*
  Warnings:

  - Added the required column `img_path` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookId` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "img_path" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "bookId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CategoriesOnBooks" (
    "bookId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoriesOnBooks_pkey" PRIMARY KEY ("bookId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoriesOnBooks" ADD CONSTRAINT "CategoriesOnBooks_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnBooks" ADD CONSTRAINT "CategoriesOnBooks_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
