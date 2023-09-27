import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateRatingDto } from './dto';
import { GetUser } from 'src/utils/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ratings')
@UseGuards(JwtGuard)
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  createRating(
    @Body() dto: CreateRatingDto,
    @GetUser('username') username: string,
  ) {
    return this.ratingsService.createRating(dto, username);
  }

  @Delete(':slug')
  deleteRating(
    @Param('slug') slug: string,
    @GetUser('username') username: string,
  ) {
    return this.ratingsService.deleteRating(slug, username);
  }
}
