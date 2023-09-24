import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/utils/decorators';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('img'))
  updateUser(
    @GetUser('id') userId: number,
    @Body() dto: UpdateUserDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    return this.usersService.updateUser(userId, dto, img);
  }

  @Patch('change-password')
  changePassword(
    @GetUser('id') userId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(userId, dto);
  }
}
