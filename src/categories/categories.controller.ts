import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { IsAdmin, JwtGuard } from 'src/auth/guard';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategories() {
    return this.categoriesService.getCategories();
  }

  @UseGuards(JwtGuard, IsAdmin)
  @Post()
  @UseInterceptors(FileInterceptor('img'))
  createCategory(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    if (!img) throw new BadRequestException('No image file was uploaded');
    return this.categoriesService.createCategory(dto, img);
  }

  @Get('images/:filename')
  @Header('Content-Type', 'image/jpeg')
  getImage(@Param('filename') filename: string): StreamableFile {
    const filePath = join(process.cwd(), '/uploads/categories-imgs/', filename);
    if (!existsSync(filePath))
      throw new BadRequestException('The requested file does not exist');
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }

  @UseGuards(JwtGuard, IsAdmin)
  @Patch(':slug')
  @UseInterceptors(FileInterceptor('img'))
  updateCategory(
    @Body() dto: CreateCategoryDto,
    @Param('slug') slug: string,
    @UploadedFile() img: Express.Multer.File,
  ) {
    return this.categoriesService.updateCategory(dto, img, slug);
  }

  @UseGuards(JwtGuard, IsAdmin)
  @Delete(':slug')
  deleteCategory(@Param('slug') slug: string) {
    return this.categoriesService.deleteCategory(slug);
  }
}
