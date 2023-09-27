import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // adding validation pipeline for validation (see auth/dto)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //strips out undefined elements
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Wordsmith API Docs')
    .setDescription(
      'This is the documentation for all endpoints in the Wordsmith API',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({ origin: '*' });
  await app.listen(8080);
}
bootstrap();
