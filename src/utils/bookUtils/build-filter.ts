export function buildFilter(
  category: string[] | undefined,
  fromYear: number | undefined,
  toYear: number | undefined,
  rating: string[] | undefined,
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
    filterObj.avgRating = {
      in: rating,
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
