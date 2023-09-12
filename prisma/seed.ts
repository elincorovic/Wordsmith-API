import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Create Categories
  const category1 = await prisma.category.create({
    data: {
      title: 'Fiction',
      img_path: 'fiction.jpg',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      title: 'Non-Fiction',
      img_path: 'nonfiction.jpg',
    },
  });

  const category3 = await prisma.category.create({
    data: {
      title: 'Action',
      img_path: 'action.jpg',
    },
  });

  const category4 = await prisma.category.create({
    data: {
      title: 'Biography',
      img_path: 'biography.jpg',
    },
  });

  // Create Books
  const book1 = await prisma.book.create({
    data: {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      year: 1925,
      pages: 180,
      language: 'English',
      description: 'A classic novel about the American Dream.',
      img_path: 'gatsby.jpg',
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      year: 2014,
      pages: 443,
      language: 'English',
      description: 'A thought-provoking exploration of human history.',
      img_path: 'sapiens.jpg',
    },
  });

  //Create Relations Books-Categories
  const booksCategoriesRelations = await prisma.categoriesOnBooks.createMany({
    data: [
      {
        bookId: book1.id,
        categoryId: category1.id,
      },
      {
        bookId: book1.id,
        categoryId: category2.id,
      },
      {
        bookId: book2.id,
        categoryId: category3.id,
      },
      {
        bookId: book2.id,
        categoryId: category4.id,
      },
    ],
  });

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      username: 'user1',
      email: 'john@example.com',
      hash: await argon.hash('password123'),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user2',
      email: 'jane@example.com',
      hash: await argon.hash('password456'),
    },
  });

  // Create Ratings
  const rating1 = await prisma.rating.create({
    data: {
      authorId: user1.id,
      bookId: book1.id,
    },
  });

  const rating2 = await prisma.rating.create({
    data: {
      authorId: user2.id,
      bookId: book2.id,
    },
  });

  console.log('Seed data inserted successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
