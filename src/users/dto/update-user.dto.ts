import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  fullname?: string

  @IsNumber()
  phonenumber?: number

  @IsEmail()
  @IsNotEmpty()
  email: string
}
