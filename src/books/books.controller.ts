import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { IsAdmin, JwtGuard } from 'src/auth/guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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
    return this.booksService.createBook(dto, files.img[0], files.pdf[0]);
  }
}
