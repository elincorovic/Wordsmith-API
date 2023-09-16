import { IsArray, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNumberString()
  @IsNotEmpty()
  year: string;

  @IsNumberString()
  @IsNotEmpty()
  pages: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  categories: string;
}
