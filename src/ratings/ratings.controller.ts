import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateRatingDto } from './dto';
import { GetUser } from 'src/utils/decorators';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtGuard)
  @Post()
  createRating(
    @Body() dto: CreateRatingDto,
    @GetUser('username') username: string,
  ) {
    return this.ratingsService.createRating(dto, username);
  }
}
