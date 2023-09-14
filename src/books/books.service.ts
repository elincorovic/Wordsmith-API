import { Get, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getBooks(query: any) {
    const category = query.category
      ? query.category.split(',')
      : (await this.prisma.category.findMany({ select: { title: true } })).map(
          (category) => category.title,
        );
    const year = query.year ? query.year.split(',') : null;
    const rating = query.rating ? query.rating.split(',') : null;

    const books = await this.prisma.book.findMany({
      where: {
        categories: {
          some: {
            title: {
              in: category,
            },
          },
        },
      },
    });

    return books;
  }

  async getBook(bookId: number) {
    const book = this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
      include: {
        ratings: true,
      },
    });

    return book;
  }
}
