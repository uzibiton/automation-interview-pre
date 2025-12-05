// Load environment variables FIRST before any imports
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/api-error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/api-combined.log'),
    }),
  ],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

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

  const port = process.env.PORT || 3002; // Use PORT env var (Cloud Run) or default to 3002
  await app.listen(port, '0.0.0.0'); // Listen on all interfaces for Cloud Run
  const message = `🚀 API Service running on port ${port}`;
  console.log(message);
  logger.info(message);
}

bootstrap().catch((error) => {
  logger.error('Failed to start API Service', error);
  process.exit(1);
});
