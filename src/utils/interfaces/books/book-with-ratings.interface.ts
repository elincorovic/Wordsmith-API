export interface BookWithRatings {
  title: string;
  author: string;
  slug: string;
  ratings: { rating: number }[];
}
