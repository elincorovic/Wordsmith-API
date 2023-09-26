import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRatingDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async createRating(dto: CreateRatingDto, username: string) {
    try {
      const rating = await this.prisma.rating.create({
        data: {
          ...dto,
          username: username,
        },
      });

      return rating;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          if (error.meta.field_name === 'Rating_bookSlug_fkey (index)') {
            throw new BadRequestException('No book with this slug');
          }
        }
      }
      throw error;
    }
  }
}
