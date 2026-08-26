import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq/lib/rabbitmq.module';
import { NotificationOrmEntity } from './infrastructure/persistence/entities/notification.orm-entity';
import { NotificationRepositoryImpl } from './infrastructure/repositories/notification.repository';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { NotificationConsumer } from './infrastructure/consumers/notification.consumer';
import { NotificationController } from './infrastructure/controllers/notification.controller';
import { databaseConfig } from './infrastructure/persistence/config/database.config';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        { name: 'nexuspay.exchange', type: 'topic' },
        { name: 'wallet.exchange', type: 'topic' },
      ],
      uri: process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig,
    }),
    TypeOrmModule.forFeature([NotificationOrmEntity]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationRepositoryImpl,
    CreateNotificationUseCase,
    NotificationConsumer,
  ],
})
export class NotificationModule {}