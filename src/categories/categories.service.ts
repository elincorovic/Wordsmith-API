import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import * as sharp from 'sharp';
import { writeFileSync } from 'fs';

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
    console.log(dto);
    const category = await this.prisma.category.create({
      data: {
        title: dto.title,
      },
    });

    const imgPath: string =
      'uploads/categories-imgs/' + category.title + '.jpeg';

    const resizedImg: Buffer = await sharp(img.buffer)
      .resize({
        width: 250,
        height: 100,
        fit: 'cover',
      })
      .toFormat('jpeg')
      .toBuffer();

    try {
      writeFileSync(imgPath, resizedImg);
    } catch (error) {
      console.log('Error writing file: ', error);
    }

    return category;
  }
}
