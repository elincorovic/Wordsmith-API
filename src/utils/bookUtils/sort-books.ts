import { BadRequestException } from '@nestjs/common';
import { BookWithRatingsSum } from '../interfaces/books/book-with-ratings-sum.interface';

export function sortBooks(
  sortBy: string | null,
  books: BookWithRatingsSum[],
): BookWithRatingsSum[] {
  if (sortBy == 'best-rating') {
    return books.sort((a, b) => b.ratings.avg - a.ratings.avg);
  }
  if (sortBy == 'title') {
    return books.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sortBy == 'author') {
    return books.sort((a, b) => a.author.localeCompare(b.author));
  }
  if (!sortBy) return books;
  throw new BadRequestException('Invalid parameter for sortBy');
}
