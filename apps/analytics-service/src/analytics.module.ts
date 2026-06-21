import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEventOrmEntity } from './infrastructure/persistence/entities/analytics-event.orm-entity';
import { AnalyticsEventRepository } from './infrastructure/repositories/analytics-event.repository';
import { AnalyticsKafkaConsumer } from './infrastructure/kafka/analytics-kafka.consumer';
import { AnalyticsController } from './infrastructure/controllers/analytics.controller';



@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.ANALYTICS_DB_HOST || 'localhost',
        port: parseInt(process.env.ANALYTICS_DB_PORT || '5436'),
        username: process.env.ANALYTICS_DB_USER || 'postgres',
        password: process.env.ANALYTICS_DB_PASSWORD || 'postgres',
        database: process.env.ANALYTICS_DB_NAME || 'analytics_db',
        entities: [AnalyticsEventOrmEntity],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([AnalyticsEventOrmEntity]),
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsEventRepository,
    AnalyticsKafkaConsumer,
  ],
})
export class AnalyticsModule {}