import { Get, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getBooks() {
    const books = await this.prisma.book.findMany({
      include: {
        categories: {
          select: {
            title: true,
          },
        },
      },
    });

    return books;
  }
}
