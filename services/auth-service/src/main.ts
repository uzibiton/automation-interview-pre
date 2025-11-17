// Load environment variables FIRST before any imports
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL, /\.run\.app$/] // Allow Cloud Run domains in production
      : ['http://localhost:3000', 'http://localhost'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3001; // Use PORT env var (Cloud Run) or default to 3001
  await app.listen(port, '0.0.0.0'); // Listen on all interfaces for Cloud Run
  console.log(`🔐 Auth Service running on port ${port}`);
}

bootstrap();
