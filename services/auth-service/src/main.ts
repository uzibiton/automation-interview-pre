// Load environment variables FIRST before any imports
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost'],
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  const port = 3001; // Auth service always uses port 3001
  await app.listen(port);
  console.log(`🔐 Auth Service running on port ${port}`);
}

bootstrap();
