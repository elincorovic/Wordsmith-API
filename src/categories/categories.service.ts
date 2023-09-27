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
import { generateCategorySlug } from 'src/utils/slugGenerators/generate-category-slug';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
      //* validating img and checking mime type
      validateImg(img);

      //* generating slug for categories from title
      const slug = generateCategorySlug(dto.title);

      const category = await this.prisma.category.create({
        data: {
          slug: slug,
          title: dto.title,
        },
      });

      const imgPath: string =
        'uploads/categories-imgs/' + category.slug + '.jpeg';

      //* writing img file fs
      try {
        //* resizing image to proper format
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
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          if (error.meta.target[0] === 'slug')
            throw new BadRequestException('This category already exists');
        }
      }
      throw error;
    }
  }

  async deleteCategory(slug: string) {
    try {
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

      //* deleting img from fs
      try {
        unlinkSync(imgPath);
      } catch (error) {
        console.log('Error deleting file: ', error);
      }

      return deletedCategory;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('No category with this slug');
        }
      }
      throw error;
    }
  }

  async updateCategory(
    dto: CreateCategoryDto,
    img: Express.Multer.File,
    slug: string,
  ) {
    //* validating img and checking mime type
    validateImg(img);

    //* checking existence of old category
    const oldCategory = await this.prisma.category.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!oldCategory)
      throw new BadRequestException('No category found with this slug');

    //* generating new slug if title changed
    const newSlug =
      dto.title != oldCategory.title ? generateCategorySlug(dto.title) : slug;

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

    //* deleting old files
    try {
      unlinkSync(oldImgPath);
    } catch (error) {
      console.log('Error deleting file: ', error);
    }

    //* writing new files to fs
    try {
      //* resizing image to proper format
      const resizedImg: Buffer = await sharp(img.buffer)
        .resize({
          width: 250,
          height: 100,
          fit: 'cover',
        })
        .toFormat('jpeg')
        .toBuffer();

      writeFileSync(newImgPath, resizedImg);
    } catch (error) {
      console.log('Error writing file: ', error);
    }

    return category;
  }
}
