import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',  // URL of the React app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  });


  const options = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API documentation for task management system')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
