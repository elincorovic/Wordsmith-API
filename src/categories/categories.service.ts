import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import * as sharp from 'sharp';
import { unlinkSync, writeFileSync } from 'fs';
import { Prisma } from '@prisma/client';
import { slugify } from 'voca';
import { validateImg } from 'src/utils/fileValidation/validate-img';
import { generateSlug } from 'src/utils/bookUtils/generate-slug';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      select: {
        slug: true,
        title: true,
      },
    });
    return categories;
  }

  async createCategory(dto: CreateCategoryDto, img: Express.Multer.File) {
    try {
      validateImg(img);

      const category = await this.prisma.category.create({
        data: {
          slug: slugify(dto.title),
          title: dto.title,
        },
      });

      const imgPath: string =
        'uploads/categories-imgs/' + category.slug + '.jpeg';

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
          if (error.meta.target[0] === 'slug')
            throw new ForbiddenException('This category already exists');
        }
      }
      throw error;
    }
  }

  async deleteCategory(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!category)
      throw new BadRequestException('No category found with this slug');
    const deletedCategory = await this.prisma.category.delete({
      where: {
        slug: slug,
      },
      select: {
        slug: true,
        title: true,
      },
    });

    const imgPath: string = 'uploads/categories-imgs/' + slug + '.jpeg';

    try {
      unlinkSync(imgPath);
    } catch (error) {
      console.log('Error deleting file: ', error);
    }

    return deletedCategory;
  }

  async updateCategory(
    dto: CreateCategoryDto,
    img: Express.Multer.File,
    slug: string,
  ) {
    validateImg(img);

    const oldCategory = await this.prisma.category.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!oldCategory)
      throw new BadRequestException('No category found with this slug');

    const newSlug =
      dto.title != oldCategory.title ? generateSlug(dto.title) : slug;

    const category = await this.prisma.category.update({
      where: {
        slug: slug,
      },
      data: {
        slug: newSlug,
        ...dto,
      },
    });

    const oldImgPath: string = 'uploads/categories-imgs/' + slug + '.jpeg';
    const newImgPath: string =
      'uploads/categories-imgs/' + category.slug + '.jpeg';

    const resizedImg: Buffer = await sharp(img.buffer)
      .resize({
        width: 250,
        height: 100,
        fit: 'cover',
      })
      .toFormat('jpeg')
      .toBuffer();

    try {
      unlinkSync(oldImgPath);
    } catch (error) {
      console.log('Error deleting file: ', error);
    }

    try {
      writeFileSync(newImgPath, resizedImg);
    } catch (error) {
      console.log('Error writing file: ', error);
    }

    return category;
  }
}
