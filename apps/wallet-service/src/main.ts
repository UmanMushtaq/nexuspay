// apps/wallet-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { WalletModule } from './wallet.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(WalletModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(3002);

  console.log('🚀 Wallet Service running on http://localhost:3002');
}

bootstrap();