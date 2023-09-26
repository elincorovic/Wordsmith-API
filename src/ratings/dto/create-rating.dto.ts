import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  bookSlug: string;

  @IsOptional()
  @IsString()
  comment: string;
}
