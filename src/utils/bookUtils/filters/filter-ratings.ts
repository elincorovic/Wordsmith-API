import { BookWithRatingsSum } from 'src/utils/interfaces/books/book-with-ratings-sum.interface';

export function filterRatings(
  books: BookWithRatingsSum[],
  fromRating: number,
  toRating: number,
): BookWithRatingsSum[] | null {
  if (books) {
    if (fromRating || toRating) {
      let filteredBooks = books.filter((book) => {
        if (fromRating && toRating) {
          return book.ratings.avg >= fromRating && book.ratings.avg <= toRating;
        } else if (fromRating) {
          return book.ratings.avg >= fromRating;
        } else if (toRating) {
          return book.ratings.avg <= toRating;
        }
      });
      return filteredBooks;
    } else {
      return books;
    }
  } else {
    return null;
  }
}
