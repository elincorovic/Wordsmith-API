import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { query } from 'express';

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
}
