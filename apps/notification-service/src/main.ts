import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log(`🚀 Notification Service running on http://localhost:${port}`);
}
bootstrap();