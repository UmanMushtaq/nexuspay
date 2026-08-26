import { NestFactory } from '@nestjs/core';
import { AnalyticsModule } from './analytics.module';

async function bootstrap() {
  const app = await NestFactory.create(AnalyticsModule);
  const port = process.env.PORT || 3004;
  await app.listen(port);
  console.log(`🚀 Analytics Service running on http://localhost:${port}`);
}
bootstrap();