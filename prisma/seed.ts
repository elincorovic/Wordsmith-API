import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { slugify } from 'voca';

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
      slug: slugify('The Great Gatsby'),
      author: 'F. Scott Fitzgerald',
      year: 1925,
      pages: 180,
      language: 'English',
      description: 'A classic novel about the American Dream.',
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

  // Create Ratings
  const rating1 = await prisma.rating.create({
    data: {
      rating: 5,
      username: user1.username,
      bookId: book1.id,
    },
  });

  const rating2 = await prisma.rating.create({
    data: {
      rating: 2,
      username: user2.username,
      bookId: book2.id,
    },
  });

  const rating3 = await prisma.rating.create({
    data: {
      rating: 3,
      username: user2.username,
      bookId: book3.id,
    },
  });

  const rating4 = await prisma.rating.create({
    data: {
      rating: 4,
      username: user2.username,
      bookId: book4.id,
    },
  });

  const rating5 = await prisma.rating.create({
    data: {
      rating: 1,
      username: user2.username,
      bookId: book5.id,
    },
  });

  const rating6 = await prisma.rating.create({
    data: {
      rating: 2,
      username: user2.username,
      bookId: book1.id,
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
