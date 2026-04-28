import { NestFactory } from '@nestjs/core';
// why this to include swagger in main.ts file
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './config/typeorm.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter() as any,
  );
  const config = new DocumentBuilder()
    .setTitle('Notification System')
    .setDescription('NestJS API with Fastify and Swagger')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  if (process.env.NODE_ENV === 'development') {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize(); // Connect to run seeders
    await dataSource.destroy(); // Close the temporary seeder connection
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
