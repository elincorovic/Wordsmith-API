import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { slugify } from 'voca';

const prisma = new PrismaClient();

async function main() {
  // Create Categories
  const category1 = await prisma.category.create({
    data: {
      slug: slugify('Fiction'),
      title: 'Fiction',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      slug: slugify('Non-Fiction'),
      title: 'Non-Fiction',
    },
  });

  const category3 = await prisma.category.create({
    data: {
      slug: slugify('Action'),
      title: 'Action',
    },
  });

  const category4 = await prisma.category.create({
    data: {
      slug: slugify('Biography'),
      title: 'Biography',
    },
  });

  const category5 = await prisma.category.create({
    data: {
      slug: slugify('Mystery'),
      title: 'Mystery',
    },
  });

  const category6 = await prisma.category.create({
    data: {
      slug: slugify('Science-Fiction'),
      title: 'Science-Fiction',
    },
  });

  // Create Books
  const book1 = await prisma.book.create({
    data: {
      title: 'The Great Gatsby',
      slug: slugify('The Great Gatsby'),
      author: 'F. Scott Fitzgerald',
      year: 1925,
      pages: 180,
      language: 'English',
      description: 'A classic novel about the American Dream.',
      avgRating: 0,
      categories: {
        connect: [category1, category2],
      },
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'Sapiens: A Brief History of Humankind',
      slug: slugify('Sapiens: A Brief History of Humankind'),
      author: 'Yuval Noah Harari',
      year: 2014,
      pages: 443,
      language: 'English',
      description: 'A thought-provoking exploration of human history.',
      avgRating: 0,
      categories: {
        connect: [category3, category4],
      },
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'To Kill a Mockingbird',
      slug: slugify('To Kill a Mockingbird'),
      author: 'Harper Lee',
      year: 1960,
      pages: 281,
      language: 'English',
      description: 'A novel addressing racial injustice in the American South.',
      avgRating: 0,
      categories: {
        connect: [category5, category6],
      },
    },
  });

  const book4 = await prisma.book.create({
    data: {
      title: '1984',
      slug: slugify('1984'),
      author: 'George Orwell',
      year: 1949,
      pages: 328,
      language: 'English',
      description: 'A dystopian novel about a totalitarian regime.',
      avgRating: 0,
      categories: {
        connect: [category2, category5, category6],
      },
    },
  });

  const book5 = await prisma.book.create({
    data: {
      title: 'Pride and Prejudice',
      slug: slugify('Pride and Prejudice'),
      author: 'Jane Austen',
      year: 1813,
      pages: 279,
      language: 'English',
      description: 'A classic romance novel set in 19th-century England.',
      avgRating: 0,
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
      isAdmin: true,
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
