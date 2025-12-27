// Load environment variables (for local development only - Cloud Run sets env vars directly)
// Only load dotenv for local development
const isCloudRun = process.env.K_SERVICE !== undefined;
if (!isCloudRun && process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as winston from 'winston';

// Configure Winston logger
// Note: Cloud Run has a read-only filesystem, so only use Console transport in production
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  }),
];

// Only add file transports for local development (not on Cloud Run - read-only filesystem)
if (!isCloudRun && process.env.NODE_ENV !== 'production') {
  const path = require('path');
  transports.push(
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/api-error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/api-combined.log'),
    }),
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports,
});

async function bootstrap() {
  console.log('Starting API Service bootstrap...');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`PORT: ${process.env.PORT}`);
  console.log(`DATABASE_TYPE: ${process.env.DATABASE_TYPE}`);
  console.log(`FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID}`);

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Enable CORS
    const allowedOrigins = isCloudRun
      ? [process.env.FRONTEND_URL, /\.run\.app$/] // Allow Cloud Run domains
      : ['http://localhost:3000', 'http://localhost'];

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
    });

    // Enable validation
    app.useGlobalPipes(new ValidationPipe());

    const port = process.env.PORT || 3002; // Use PORT env var (Cloud Run) or default to 3002
    console.log(`Attempting to listen on port ${port}...`);
    await app.listen(port, '0.0.0.0'); // Listen on all interfaces for Cloud Run
    const message = `🚀 API Service running on port ${port}`;
    console.log(message);
    logger.info(message);
  } catch (error) {
    console.error('Bootstrap error:', error);
    throw error;
  }
}

bootstrap().catch((error) => {
  console.error('Failed to start API Service:', error);
  logger.error('Failed to start API Service', error);
  process.exit(1);
});
