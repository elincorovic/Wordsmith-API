import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import * as sharp from 'sharp';
import { unlinkSync, writeFile, writeFileSync } from 'fs';
import { generateBookSlug } from 'src/utils/slugGenerators/generate-book-slug';
import { buildFilter } from 'src/utils/bookUtils/build-filter';
import { validateImg } from 'src/utils/fileValidation/validate-img';
import { validatePdf } from 'src/utils/fileValidation/validate-pdf';
import { validateFilters } from 'src/utils/bookUtils/validate-filter';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getBooks(query: any) {
    try {
      //* converting filter options to proper types
      const category = query.category ? query.category.split(',') : undefined;
      const rating = query.rating
        ? query.rating
            .split(',')
            .map((x: string) => parseInt(x))
            .sort()
        : undefined;
      const fromYear = query.fromYear ? parseInt(query.fromYear) : undefined;
      const toYear = query.toYear ? parseInt(query.toYear) : undefined;
      const limit = query.limit ? parseInt(query.limit) : undefined;
      const sortBy = query.sortBy;
      const search = query.search;
      const author = query.author;

      //* validating numeric filter options
      validateFilters(fromYear, toYear, rating, limit, sortBy);

      //* building the prisma filter obj
      const filterObj = buildFilter(
        category,
        fromYear,
        toYear,
        rating,
        search,
        author,
      );

      const books = await this.prisma.book.findMany({
        take: limit,
        where: filterObj,
        select: {
          title: true,
          author: true,
          slug: true,
          avgRating: true,
        },
        orderBy:
          sortBy === 'best-rating'
            ? { avgRating: 'desc' }
            : sortBy === 'author'
            ? { author: 'asc' }
            : { title: 'asc' },
      });

      if (!books || books.length == 0)
        throw new NotFoundException('No books match the specified filters');

      return books;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error retreiving books');
    }
  }

  async getBook(slug: string) {
    const book = await this.prisma.book.findUnique({
      where: {
        slug: slug,
      },
      include: {
        ratings: true,
        categories: true,
      },
    });

    if (!book) throw new BadRequestException('No book with this slug');

    return book;
  }

  async createBook(
    dto: CreateBookDto,
    img: Express.Multer.File,
    pdf: Express.Multer.File,
  ) {
    try {
      //* validating files and checking mime types
      validateImg(img);
      validatePdf(pdf);

      const categoriesInput = dto.categories.split(',').map((slug) => {
        return { slug: slug };
      });

      console.log(categoriesInput);

      //*generating a book slug (number + title)
      const slug = generateBookSlug(dto.title);

      const book = await this.prisma.book.create({
        data: {
          title: dto.title,
          slug: slug,
          author: dto.author,
          pages: parseInt(dto.pages),
          year: parseInt(dto.year),
          language: dto.language,
          description: dto.description,
          avgRating: 0,
          categories: {
            connect: categoriesInput,
          },
        },
      });

      const imgPath: string = 'uploads/books-imgs/' + slug + '.jpeg';
      const pdfPath: string = 'uploads/books-pdfs/' + slug + '.pdf';

      //* writing files to fs
      try {
        //* resizing image to proper format
        const resizedImg: Buffer = await sharp(img.buffer)
          .resize({
            width: 250,
            height: 400,
            fit: 'cover',
          })
          .toFormat('jpeg')
          .toBuffer();

        writeFile(imgPath, resizedImg, (err) => {
          if (err) throw new Error('Could not write img file');
        });
        writeFile(pdfPath, pdf.buffer, (err) => {
          if (err) throw new Error('Could not write pdf file');
        });
      } catch (error) {
        console.error('Error writing file: ', error);
      }

      return book;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          if (error.meta.target[0] === 'slug')
            throw new BadRequestException(
              'A book with this slug already exists',
            );
        }
        if (error.code === 'P2025') {
          throw new BadRequestException('Invalid list of categories');
        }
      }
      throw error;
    }
  }

  async updateBook(
    dto: CreateBookDto,
    img: Express.Multer.File,
    pdf: Express.Multer.File,
    slug: string,
  ) {
    try {
      //* validating files and checking mime types
      validateImg(img);
      validatePdf(pdf);

      const categoriesInput = dto.categories.split(',').map((slug) => {
        return { slug: slug };
      });

      const oldBook = await this.getBook(slug);

      if (!oldBook)
        throw new BadRequestException('No book found with the given slug');

      //*generating a book slug (number + title) if title changed
      const newSlug =
        dto.title != oldBook.title ? generateBookSlug(dto.title) : slug;

      const book = await this.prisma.book.update({
        where: {
          slug: slug,
        },
        data: {
          title: dto.title,
          slug: newSlug,
          author: dto.author,
          pages: parseInt(dto.pages),
          year: parseInt(dto.year),
          language: dto.language,
          description: dto.description,
          categories: {
            set: categoriesInput,
          },
        },
      });

      const oldImgPath: string = 'uploads/books-imgs/' + slug + '.jpeg';
      const oldPdfPath: string = 'uploads/books-pdfs/' + slug + '.pdf';
      const newImgPath: string = 'uploads/books-imgs/' + book.slug + '.jpeg';
      const newPdfPath: string = 'uploads/books-pdfs/' + book.slug + '.pdf';

      //* deleting old files
      try {
        unlinkSync(oldImgPath);
        unlinkSync(oldPdfPath);
      } catch (error) {
        console.log('Error deleting file: ', error);
      }

      //* writing new files to fs
      try {
        //* resizing image to proper format
        const resizedImg: Buffer = await sharp(img.buffer)
          .resize({
            width: 250,
            height: 400,
            fit: 'cover',
          })
          .toFormat('jpeg')
          .toBuffer();
        writeFileSync(newImgPath, resizedImg);
        writeFileSync(newPdfPath, pdf.buffer);
      } catch (error) {
        console.log('Error writing file: ', error);
      }

      return book;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log(error.meta);
        if (error.code === 'P2002') {
          if (error.meta.target[0] === 'slug')
            throw new BadRequestException(
              'A book with this slug already exists',
            );
        }
        if (error.code === 'P2025') {
          throw new BadRequestException('Invalid list of categories');
        }
      }
      throw error;
    }
  }

  async deleteBook(slug: string) {
    try {
      const deletedBook = await this.prisma.book.delete({
        where: {
          slug: slug,
        },
        select: {
          title: true,
          slug: true,
        },
      });

      const imgPath: string = 'uploads/books-imgs/' + slug + '.jpeg';
      const pdfPath: string = 'uploads/books-pdfs/' + slug + '.pdf';

      //* deleting files from fs
      try {
        unlinkSync(imgPath);
        unlinkSync(pdfPath);
      } catch (error) {
        console.log('Error deleting file: ', error);
      }

      return deletedBook;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Book not found');
        }
      }
      throw error;
    }
  }
}
