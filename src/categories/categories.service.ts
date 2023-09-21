import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import * as sharp from 'sharp';
import { writeFileSync } from 'fs';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      select: {
        title: true,
      },
    });
    return categories;
  }

  async createCategory(dto: CreateCategoryDto, img: Express.Multer.File) {
    try {
      const category = await this.prisma.category.create({
        data: {
          title: dto.title,
        },
      });

      const imgPath: string =
        'uploads/categories-imgs/' + category.title + '.jpeg';

      try {
        const resizedImg: Buffer = await sharp(img.buffer)
          .resize({
            width: 250,
            height: 100,
            fit: 'cover',
          })
          .toFormat('jpeg')
          .toBuffer();

        writeFileSync(imgPath, resizedImg);
      } catch (error) {
        console.log('Error writing file: ', error);
      }

      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log(error);
          if (error.meta.target[0] === 'title')
            throw new ForbiddenException('This category already exists');
        }
      }
      throw error;
    }
  }

  async deleteCategory(title: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        title: title,
      },
    });
    if (!category)
      throw new BadRequestException('No category found with this title');
    const deletedCategory = await this.prisma.category.delete({
      where: {
        title: title,
      },
      select: {
        title: true,
      },
    });
    return deletedCategory;
  }
}
