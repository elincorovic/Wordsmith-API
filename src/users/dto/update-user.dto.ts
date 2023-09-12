import { IsEmail, IsNumberString, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  fullname?: string;

  @IsNumberString()
  @IsOptional()
  phonenumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
