/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { TransactionModule } from './transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);
 app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  const port = process.env.PORT || 3003;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/`,
  );
}

bootstrap();
