import { BadRequestException } from '@nestjs/common';

export function validateFilters(
  fromYear: number | undefined,
  toYear: number | undefined,
  fromRating: number | undefined,
  toRating: number | undefined,
  limit: number | undefined,
  sortBy: string | undefined,
) {
  const SORT_BY = ['title', 'best-rating', 'author', 'popularity'];

  if (fromYear !== undefined && isNaN(fromYear)) {
    throw new BadRequestException('Invalid fromYear parameter');
  }

  if (toYear !== undefined && isNaN(toYear)) {
    throw new BadRequestException('Invalid toYear parameter');
  }

  if (fromRating !== undefined && isNaN(fromRating)) {
    throw new BadRequestException('Invalid fromRating parameter');
  }

  if (toRating !== undefined && isNaN(toRating)) {
    throw new BadRequestException('Invalid toRating parameter');
  }

  if (sortBy !== undefined && !SORT_BY.includes(sortBy)) {
    throw new BadRequestException('Invalid sortBy parameter');
  }

  if (limit !== undefined && isNaN(limit)) {
    throw new BadRequestException('Invalid limit parameter');
  }
}
