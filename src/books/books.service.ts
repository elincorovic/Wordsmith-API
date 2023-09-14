import { Get, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getBooks(query: any) {
    const category = query.category ? query.category.split(',') : null;
    const year = query.year ? query.year.split(',') : null;
    const rating = query.rating ? query.rating.split(',') : null;

    const books = await this.prisma.$queryRaw`
      SELECT
        b.id,
        b.title,
        b.author,
        b.img_path,
        AVG(r.rating)::float as avgRating,
        COUNT(r.rating)::integer as countRatings
      FROM
        "Book" b
      LEFT JOIN
        "Rating" r ON b.id = r."bookId"
      GROUP BY
        b.id, b.title
      ORDER BY
        b.title
      `;

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
