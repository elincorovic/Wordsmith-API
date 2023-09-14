export interface BookWithRatings {
  title: string;
  author: string;
  img_path: string;
  ratings: { rating: number }[];
}
