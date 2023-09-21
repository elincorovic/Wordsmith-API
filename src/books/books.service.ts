import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { summarizeRatings } from 'src/utils/bookUtils/summarize-ratings';
import { CreateBookDto } from './dto/create-book.dto';
import * as sharp from 'sharp';
import { unlink, unlinkSync, writeFile, writeFileSync } from 'fs';
import { generateSlug } from 'src/utils/bookUtils/generate-slug';
import { buildFilter } from 'src/utils/bookUtils/filters/build-filter';
import { filterRatings } from 'src/utils/bookUtils/filters/filter-ratings';
import { validateImg } from 'src/utils/fileValidation/validate-img';
import { validatePdf } from 'src/utils/fileValidation/validate-pdf';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getBooks(query: any) {
    try {
      const category = query.category ? query.category.split(',') : null;
      const fromYear = query.fromYear ? parseInt(query.fromYear) : null;
      const toYear = query.toYear ? parseInt(query.toYear) : null;
      const fromRating = query.fromRating ? parseInt(query.fromRating) : null;
      const toRating = query.toRating ? parseInt(query.toRating) : null;

      if (isNaN(fromYear)) {
        throw new BadRequestException('Invalid fromYear parameter');
      }

      if (isNaN(toYear)) {
        throw new BadRequestException('Invalid toYear parameter');
      }

      if (isNaN(fromRating)) {
        throw new BadRequestException('Invalid fromRating parameter');
      }

      if (isNaN(toRating)) {
        throw new BadRequestException('Invalid toRating parameter');
      }

      const filterObj = buildFilter(category, fromYear, toYear);

      const books = await this.prisma.book.findMany({
        where: filterObj,
        select: {
          title: true,
          author: true,
          slug: true,
          ratings: {
            select: {
              rating: true,
            },
          },
        },
      });

      let booksRatingsSummarized = summarizeRatings(books);

      let booksFilteredByRating = filterRatings(
        booksRatingsSummarized,
        fromRating,
        toRating,
      );

      if (!booksFilteredByRating || booksFilteredByRating.length == 0)
        throw new NotFoundException('No books match the specified filters');

      return booksFilteredByRating;
    } catch (error) {
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
    validateImg(img);
    validatePdf(pdf);

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

    const slug = generateSlug(dto.title);

    const book = await this.prisma.book.create({
      data: {
        title: dto.title,
        slug: slug,
        author: dto.author,
        pages: parseInt(dto.pages),
        year: parseInt(dto.year),
        language: dto.language,
        description: dto.description,
        categories: {
          connect: categories,
        },
      },
    });

    const imgPath: string = 'uploads/books-imgs/' + slug + '.jpeg';
    const pdfPath: string = 'uploads/books-pdfs/' + slug + '.pdf';

    const resizedImg: Buffer = await sharp(img.buffer)
      .resize({
        width: 250,
        height: 400,
        fit: 'cover',
      })
      .toFormat('jpeg')
      .toBuffer();

    try {
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
  }

  async updateBook(
    dto: CreateBookDto,
    img: Express.Multer.File,
    pdf: Express.Multer.File,
    slug: string,
  ) {
    const MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!img) throw new BadRequestException('No image file was uploaded');
    if (!MIME_TYPES.includes(img.mimetype))
      throw new BadRequestException('Image must be of type: jpeg, jpg or png');

    if (!pdf) throw new BadRequestException('No pdf file was uploaded');
    if (pdf.mimetype != 'application/pdf')
      throw new BadRequestException('Pdf upload must be of type pdf');

    const categoriesInput = dto.categories.split(',');

    //check if the list of categories is valid
    const categories = await this.prisma.category.findMany({
      where: {
        title: {
          in: categoriesInput,
        },
      },
    });

    if (!categories)
      throw new BadRequestException('Invalid list of categories');

    const oldBook = await this.getBook(slug);

    if (!oldBook)
      throw new BadRequestException('No book found with the given slug');

    const newSlug = dto.title != oldBook.title ? generateSlug(dto.title) : slug;

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
          connect: categories,
        },
      },
    });

    const oldImgPath: string = 'uploads/books-imgs/' + slug + '.jpeg';
    const oldPdfPath: string = 'uploads/books-pdfs/' + slug + '.pdf';
    const newImgPath: string = 'uploads/books-imgs/' + book.slug + '.jpeg';
    const newPdfPath: string = 'uploads/books-pdfs/' + book.slug + '.pdf';

    const resizedImg: Buffer = await sharp(img.buffer)
      .resize({
        width: 250,
        height: 400,
        fit: 'cover',
      })
      .toFormat('jpeg')
      .toBuffer();

    try {
      unlinkSync(oldImgPath);
      unlinkSync(oldPdfPath);
    } catch (error) {
      console.log('Error deleting file: ', error);
    }

    try {
      writeFileSync(newImgPath, resizedImg);
      writeFileSync(newPdfPath, pdf.buffer);
    } catch (error) {
      console.log('Error writing file: ', error);
    }

    return book;
  }

  async deleteBook(slug: string) {
    const book = await this.prisma.book.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!book)
      throw new BadRequestException('No book found with the given slug');
    const deletedBook = await this.prisma.book.delete({
      where: {
        slug: slug,
      },
      select: {
        title: true,
        slug: true,
      },
    });
    return deletedBook;
  }
}
