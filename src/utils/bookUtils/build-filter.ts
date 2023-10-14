export function buildFilter(
  category: string | undefined,
  fromYear: number | undefined,
  toYear: number | undefined,
  fromRating: number | undefined,
  toRating: number | undefined,
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

  if (fromRating && toRating) {
    filterObj.avgRating = {
      gte: fromRating,
      lte: toRating,
    };
  } else if (fromRating) {
    filterObj.avgRating = {
      gte: fromRating,
    };
  } else if (toRating) {
    filterObj.avgRating = {
      lte: toRating,
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
