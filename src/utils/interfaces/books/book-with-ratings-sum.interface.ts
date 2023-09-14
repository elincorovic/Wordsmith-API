export interface BookWithRatingsSum {
  title: string;
  author: string;
  img_path: string;
  ratings: {
    count: number;
    avg: number;
  };
}
