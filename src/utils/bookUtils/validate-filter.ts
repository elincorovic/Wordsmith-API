import { BadRequestException } from '@nestjs/common';

export function validateFilters(
  fromYear: number | null,
  toYear: number | null,
  fromRating: number | null,
  toRating: number | null,
) {
  if (isNaN(fromYear)) {
    throw new BadRequestException('Invalid fromYear parameter');
  }

  if (isNaN(toYear)) {
    throw new BadRequestException('Invalid toYear parameter');
  }

  if (isNaN(fromRating)) {
    throw new BadRequestException('Invalid fromRating parameter');
  }

  if (isNaN(toRating)) {
    throw new BadRequestException('Invalid toRating parameter');
  }
}
