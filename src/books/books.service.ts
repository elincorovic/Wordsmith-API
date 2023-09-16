import {
  BadRequestException,
  Get,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { summarizeRatings } from 'src/utils/bookUtils/summarized-ratings';
import { CreateBookDto } from './dto/create-book.dto';
import * as sharp from 'sharp';
import { unlink, writeFile, writeFileSync } from 'fs';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getBooks(query: any) {
    const category = query.category ? query.category.split(',') : null;
    const fromYear = query.fromYear ? parseInt(query.fromYear) : null;
    const toYear = query.toYear ? parseInt(query.toYear) : null;
    const fromRating = query.fromRating ? parseInt(query.fromRating) : null;
    const toRating = query.toRating ? parseInt(query.toRating) : null;

    let filterObj: any = {};
    if (category) {
      filterObj.categories = {
        some: {
          title: {
            in: category,
          },
        },
      };
    }

    if (fromYear && toYear) {
      filterObj.year = {
        gte: fromYear,
        lte: toYear,
      };
    } else if (fromYear) {
      filterObj.year = {
        gte: fromYear,
      };
    } else if (toYear) {
      filterObj.year = {
        lte: toYear,
      };
    }

    const books = await this.prisma.book.findMany({
      where: filterObj,
      select: {
        title: true,
        author: true,
        img_path: true,
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    let booksRatingsSummarized = summarizeRatings(books);

    if (fromRating || toRating) {
      booksRatingsSummarized = booksRatingsSummarized.filter((book) => {
        if (fromRating && toRating) {
          return book.ratings.avg >= fromRating && book.ratings.avg <= toRating;
        } else if (fromRating) {
          return book.ratings.avg >= fromRating;
        } else if (toRating) {
          return book.ratings.avg <= toRating;
        }
      });
    }

    return booksRatingsSummarized;
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

  async createBook(dto: CreateBookDto, img: Express.Multer.File) {
    const MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!img) throw new BadRequestException('No image was uploaded');
    if (!MIME_TYPES.includes(img.mimetype))
      throw new BadRequestException('Image must be of type: jpeg, jpg or png');

    const categoriesInput = dto.categories.split(',');

    const categories = await this.prisma.category.findMany({
      where: {
        title: {
          in: categoriesInput,
        },
      },
    });

    if (!categories)
      throw new BadRequestException('Invalid list of categories');

    const max: number = 999_999;
    const min: number = 100_000;
    const img_path: string =
      'uploads/books-imgs/' +
      (Math.round(Math.random() * (max - min + 1)) + min) +
      dto.title +
      '.jpeg';

    const resizedImg: Buffer = await sharp(img.buffer)
      .resize({
        width: 250,
        height: 400,
        fit: 'cover',
      })
      .toFormat('jpeg')
      .toBuffer();

    try {
      writeFileSync(img_path, resizedImg);
    } catch (error) {
      console.error('Error writing file: ', error);
    }

    const book = await this.prisma.book.create({
      data: {
        title: dto.title,
        author: dto.author,
        pages: parseInt(dto.pages),
        year: parseInt(dto.year),
        img_path: img_path,
        language: dto.language,
        description: dto.description,
        categories: {
          connect: categories,
        },
      },
    });

    if (!book) {
      unlink(img_path, (err) => {
        if (err) console.error('Error deleting img: ' + err);
      });
      throw new InternalServerErrorException('Book could not be created');
    }

    return book;
  }
}
