import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { IsAdmin, JwtGuard } from 'src/auth/guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getBooks(@Query() query: any) {
    return this.booksService.getBooks(query);
  }

  @Get(':slug')
  getBook(@Param('slug') slug: string) {
    return this.booksService.getBook(slug);
  }

  @UseGuards(JwtGuard, IsAdmin)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'img', maxCount: 1 },
      { name: 'pdf', maxCount: 1 },
    ]),
  )
  createBook(
    @Body() dto: CreateBookDto,
    @UploadedFiles()
    files: { img: Express.Multer.File[]; pdf: Express.Multer.File[] },
  ) {
    if (!files.img) throw new BadRequestException('No image file was uploaded');
    if (!files.pdf) throw new BadRequestException('No pdf file was uploaded');
    return this.booksService.createBook(dto, files.img[0], files.pdf[0]);
  }

  @UseGuards(JwtGuard, IsAdmin)
  @Patch(':slug')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'img', maxCount: 1 },
      { name: 'pdf', maxCount: 1 },
    ]),
  )
  updateBook(
    @Body() dto: CreateBookDto,
    @Param('slug') slug: string,
    @UploadedFiles()
    files: { img: Express.Multer.File[]; pdf: Express.Multer.File[] },
  ) {
    if (!files.img) throw new BadRequestException('No image file was uploaded');
    if (!files.pdf) throw new BadRequestException('No pdf file was uploaded');
    return this.booksService.updateBook(dto, files.img[0], files.pdf[0], slug);
  }

  @Get('images/:filename')
  @Header('Content-Type', 'image/jpeg')
  getImage(@Param('filename') filename: string): StreamableFile {
    const filePath = join(process.cwd(), '/uploads/books-imgs/', filename);
    if (!existsSync(filePath))
      throw new BadRequestException('The requested file does not exist');
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }

  @Get('pdfs/:filename')
  getPdf(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const filePath = join(process.cwd(), '/uploads/books-pdfs/', filename);
    if (!existsSync(filePath))
      throw new BadRequestException('The requested file does not exist');
    const file = createReadStream(filePath);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
    });
    return new StreamableFile(file);
  }

  @UseGuards(JwtGuard, IsAdmin)
  @Delete(':slug')
  deleteBook(@Param('slug') slug: string) {
    return this.booksService.deleteBook(slug);
  }
}
