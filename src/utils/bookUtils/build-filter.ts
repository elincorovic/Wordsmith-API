export function buildFilter(
  category: string[] | undefined,
  fromYear: number | undefined,
  toYear: number | undefined,
  rating: number[] | undefined,
  search: string | undefined,
  author: string | undefined,
) {
  let filterObj: any = {};
  if (category) {
    filterObj.categories = {
      some: {
        slug: {
          in: category,
        },
      },
    };
  }

  if (fromYear && toYear) {
    filterObj.year = {
      gte: fromYear,
      lte: toYear,
    };
  } else if (fromYear) {
    filterObj.year = {
      gte: fromYear,
    };
  } else if (toYear) {
    filterObj.year = {
      lte: toYear,
    };
  }

  if (rating) {
    let minRating: number;
    let maxrating: number;
    if (rating.length === 1) {
      minRating = rating[0] - 0.5;
      maxrating = rating[0] + 0.5;
    } else {
      minRating = rating[0] - 0.5;
      maxrating = rating[rating.length - 1] + 0.5;
    }
    filterObj.avgRating = {
      lt: maxrating,
      gte: minRating,
    };
  }

  if (search) {
    filterObj.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        author: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (author) {
    filterObj.author = author;
  }

  return filterObj;
}
