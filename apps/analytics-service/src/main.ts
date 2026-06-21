import { NestFactory } from '@nestjs/core';
import { AnalyticsModule } from './analytics.module';

async function bootstrap() {
  const app = await NestFactory.create(AnalyticsModule);
  await app.listen(3004);
  console.log('🚀 Analytics Service running on http://localhost:3004');
}
bootstrap();