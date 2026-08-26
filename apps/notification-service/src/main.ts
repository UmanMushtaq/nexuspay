import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  await app.listen(3005);
  console.log('🚀 Notification Service running on http://localhost:3005');
}
bootstrap();