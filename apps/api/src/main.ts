import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   const config = new DocumentBuilder()
      .setTitle('Reminder Task API')
      .setDescription(
         `API documentation for Reminder Task application.

## Features
- **Authentication**: JWT-based authentication with username/password
- **Tasks**: CRUD operations for tasks with Many-to-Many category relations
- **Categories**: Custom categories with types (TASK_KIND, TASK_TYPE, TASK_COLLECTION)

## Authentication
Most endpoints require Bearer token authentication. Use the /auth/login endpoint to get your access token.`,
      )
      .setVersion('1.0')
      .addBearerAuth(
         {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            description: 'Enter JWT token',
            in: 'header',
         },
         'bearer',
      )
      .addTag('1. Health', 'API health check endpoint')
      .addTag('Authentication', 'User authentication endpoints')
      .addTag('Tasks', 'Task management endpoints')
      .addTag('Categories', 'Category management endpoints')
      .addTag('Profile', 'User profile management endpoints')
      .build();

   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
         persistAuthorization: true,
         tagsSorter: 'alpha',
         operationsSorter: 'alpha',
      },
   });

   app.enableCors();
   await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
