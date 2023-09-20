export function buildFilter(
  category: string | null,
  fromYear: number | null,
  toYear: number | null,
) {
  let filterObj: any = {};
  if (category) {
    filterObj.categories = {
      some: {
        title: {
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

  return filterObj;
}
