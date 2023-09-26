import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UsersModule,
    BooksModule,
    CategoriesModule,
    RatingsModule,
  ],
})
export class AppModule {}
