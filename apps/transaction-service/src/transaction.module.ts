import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

import { TransactionSaga } from './application/sagas/transaction.saga';
import { TransactionRepositoryImpl } from './infrastructure/repositories/transaction.repository';
import { TransactionOrmEntity } from './infrastructure/persistence/entities/transaction.orm-entity';
import { databaseConfig } from './infrastructure/persistence/config/database.config';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { RedisService } from './infrastructure/redis/redis.service';
import { RabbitMQPublisher } from './infrastructure/messaging/rabbit-mq.publisher';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq/lib/rabbitmq.module';
import { connect } from 'http2';

@Module({
  imports: [
    // Redis Configuration
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
          },
          password: process.env.REDIS_PASSWORD || 'nexuspay123',
          ttl: 3600,   // 1 hour in seconds
        }),
      }),
    }),
    RabbitMQModule.forRoot({
      exchanges:[
        {
          name:'exchange.transaction',
          type:'topic',
        },
    {
      name: 'wallet.exchange',        // ← Add this
      type: 'topic',
    },
      ],
        uri: process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672',
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig,
    }),
    TypeOrmModule.forFeature([TransactionOrmEntity]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionSaga,
    TransactionRepositoryImpl,
    RedisService,
    RabbitMQPublisher,
    CreateTransactionUseCase,
  ],
  exports: [
    RedisService,
    RabbitMQPublisher,
    CreateTransactionUseCase], // Export use case for external use
})
export class TransactionModule {}