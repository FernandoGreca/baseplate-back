import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MongooseExceptionFilter } from './filters/mongoose-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Base Backend API')
    .setDescription(
      'Base API for new projects. Provides user authentication with registration and JWT token generation. ' +
        'This backend serves as a starting point for applications that require authentication and initial structure.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();
  app.useGlobalFilters(new MongooseExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Swagger rodando em: http://localhost:${port}/api`);
}
bootstrap();
