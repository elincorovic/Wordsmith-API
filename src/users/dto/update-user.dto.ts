import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  fullname?: string;

  @IsNumberString()
  @IsOptional()
  phonenumber?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
