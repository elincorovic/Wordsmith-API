import { IsNotEmpty, IsString } from 'class-validator';

export class AddFavouriteDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}
