import { BookWithRatings } from '../interfaces/books';
import { BookWithRatingsSum } from '../interfaces/books/book-with-ratings-sum.interface';

export function summarizeRatings(
  books: BookWithRatings[],
): BookWithRatingsSum[] {
  return books.map((book) => {
    const count = book.ratings.length;
    const sum = book.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const avg = count > 0 ? sum / count : 0;

    return {
      ...book,
      ratings: {
        count,
        avg,
      },
    };
  });
}
