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

  const category5 = await prisma.category.create({
    data: {
      title: 'Mystery',
      img_path: 'mystery.jpg',
    },
  });

  const category6 = await prisma.category.create({
    data: {
      title: 'Science-Fiction',
      img_path: 'science-fiction.jpg',
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
      categories: {
        connect: [category1, category2],
      },
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
      categories: {
        connect: [category3, category4],
      },
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      year: 1960,
      pages: 281,
      language: 'English',
      description: 'A novel addressing racial injustice in the American South.',
      img_path: 'mockingbird.jpg',
      categories: {
        connect: [category5, category6],
      },
    },
  });

  const book4 = await prisma.book.create({
    data: {
      title: '1984',
      author: 'George Orwell',
      year: 1949,
      pages: 328,
      language: 'English',
      description: 'A dystopian novel about a totalitarian regime.',
      img_path: '1984.jpg',
      categories: {
        connect: [category2, category5, category6],
      },
    },
  });

  const book5 = await prisma.book.create({
    data: {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      year: 1813,
      pages: 279,
      language: 'English',
      description: 'A classic romance novel set in 19th-century England.',
      img_path: 'pride_and_prejudice.jpg',
      categories: {
        connect: [category2, category3, category4],
      },
    },
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
