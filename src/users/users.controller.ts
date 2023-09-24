import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Req,
  StreamableFile,
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
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  @UseInterceptors(FileInterceptor('img'))
  updateUser(
    @GetUser('id') userId: number,
    @Body() dto: UpdateUserDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    return this.usersService.updateUser(userId, dto, img);
  }

  @UseGuards(JwtGuard)
  @Patch('change-password')
  changePassword(
    @GetUser('id') userId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(userId, dto);
  }

  @Get('images/:filename')
  @Header('Content-Type', 'image/jpeg')
  getImage(@Param('filename') filename: string): StreamableFile {
    const filePath = join(process.cwd(), '/uploads/users-imgs/', filename);
    if (!existsSync(filePath))
      throw new BadRequestException('The requested file does not exist');
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }
}
