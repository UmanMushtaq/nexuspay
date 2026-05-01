// apps/user-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  // Enable global validation pipe (for DTO validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors()
  await app.listen(3001);   // Using port 3001 to avoid conflict with api-gateway later

  console.log(`🚀 User Service is running on: http://localhost:3001`);
}

bootstrap();