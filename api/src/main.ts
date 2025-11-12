import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MongooseExceptionFilter } from './filters/mongoose-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Base Backend API')
    .setDescription(
      [
        'Base API for new projects. Provides user authentication with registration and JWT token generation.',
        'This backend serves as a starting point for applications that require authentication and initial structure.',
        '',
        '### Filtragem dinâmica',
        'As operações de listagem aceitam filtros via query string (ex.: `?age[gte]=30&age[lt]=50`).',
        '- Números/Data: use `gt`, `gte`, `lt`, `lte` ou igualdade (sem operador).',
        '- Strings: use igualdade case-insensitive (`?name=Ana`) ou `contains` para busca parcial (`?name[contains]=an`).',
        '- Campos não mapeados no schema são ignorados automaticamente.',
      ].join('\n'),
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
  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Swagger rodando em: http://localhost:${port}/api`);
}
bootstrap();
