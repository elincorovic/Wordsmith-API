import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // adding validation pipeline for validation (see auth/dto)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //strips out undefined elements
    }),
  );
  await app.listen(8080);
}
bootstrap();
