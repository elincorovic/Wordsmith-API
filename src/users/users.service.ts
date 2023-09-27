import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddFavouriteDto, UpdateUserDto } from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as argon from 'argon2';
import { validateImg } from 'src/utils/fileValidation/validate-img';
import { existsSync, writeFile, writeFileSync } from 'fs';
import * as sharp from 'sharp';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateUser(
    userId: number,
    dto: UpdateUserDto,
    img: Express.Multer.File | undefined,
  ) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    if (img) {
      validateImg(img);
      const imgPath = 'uploads/users-imgs/' + user.username + '.jpeg';
      const resizedImg: Buffer = await sharp(img.buffer)
        .resize({
          width: 250,
          height: 250,
          fit: 'cover',
        })
        .toFormat('jpeg')
        .toBuffer();

      try {
        writeFileSync(imgPath, resizedImg);
      } catch (error) {
        console.error('Error writing img file: ', error);
      }
    }

    return user;
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    const passwordMatches = await argon.verify(user.hash, dto.oldPassword);
    if (!passwordMatches) throw new ForbiddenException('Password incorrect');

    const hash = await argon.hash(dto.newPassword);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hash,
      },
    });

    return {
      success: true,
    };
  }

  async deleteMe(username: string) {
    try {
      const user = await this.prisma.user.delete({
        where: {
          username: username,
        },
      });

      return { success: true, username: user.username };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new BadRequestException('User not found');
        }
      }
      throw error;
    }
  }

  async getFavourites(username: string) {
    const favourites = await this.prisma.book.findMany({
      where: {
        usersFavourite: {
          some: {
            username: username,
          },
        },
      },
    });

    return favourites;
  }

  async addFavourite(username: string, dto: AddFavouriteDto) {
    const user = await this.prisma.user.update({
      where: {
        username: username,
      },
      data: {
        favourites: {
          connect: {
            slug: dto.slug,
          },
        },
      },
    });

    return { success: true };
  }
}
