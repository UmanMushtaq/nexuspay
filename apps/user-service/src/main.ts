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
  const port = process.env.PORT || 3001;
  await app.listen(port);  // Using port 3001 to avoid conflict with api-gateway later

  console.log(`🚀 User Service is running on: http://localhost:${port}`);
}

bootstrap();