export interface BookWithRatingsSum {
  title: string;
  author: string;
  slug: string;
  ratings: {
    count: number;
    avg: number;
  };
}
