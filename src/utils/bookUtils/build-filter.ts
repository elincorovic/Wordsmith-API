export function buildFilter(
  category: string | null,
  fromYear: number | null,
  toYear: number | null,
  fromRating: number | null,
  toRating: number | null,
  search: string | null,
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

  return filterObj;
}
