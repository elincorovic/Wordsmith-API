import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getBooks() {
    return this.booksService.getBooks();
  }

  @Get(':bookId')
  getBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.booksService.getBook(bookId);
  }
}
