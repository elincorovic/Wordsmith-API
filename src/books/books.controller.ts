import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { query } from 'express';
import { CreateBookDto } from './dto/create-book.dto';
import { IsAdmin, JwtGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getBooks(@Query() query: any) {
    return this.booksService.getBooks(query);
  }

  @Get(':bookId')
  getBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.booksService.getBook(bookId);
  }

  @UseGuards(JwtGuard, IsAdmin)
  @Post()
  @UseInterceptors(FileInterceptor('img'))
  createBook(
    @Body() dto: CreateBookDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    return this.booksService.createBook(dto, img);
  }
}
