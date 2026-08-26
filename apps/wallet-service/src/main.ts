
import { NestFactory } from '@nestjs/core';
import { WalletModule } from './wallet.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(WalletModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

 const port = process.env.PORT || 3002;
  await app.listen(port);

  console.log(`🚀 Wallet Service running on http://localhost:${port}`);
}

bootstrap();