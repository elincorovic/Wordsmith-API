import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  getCategories() {
    const categories = this.prisma.category.findMany({
      select: {
        title: true,
      },
    });
    return categories;
  }
}
