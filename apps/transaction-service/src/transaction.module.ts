import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

import { TransactionSaga } from './application/sagas/transaction.saga';
import { TransactionRepositoryImpl } from './infrastructure/repositories/transaction.repository';
import { TransactionOrmEntity } from './infrastructure/persistence/entities/transaction.orm-entity';
import { databaseConfig } from './infrastructure/persistence/config/database.config';

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

    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig,
    }),
    TypeOrmModule.forFeature([TransactionOrmEntity]),
  ],
  controllers: [],
  providers: [
    TransactionSaga,
    TransactionRepositoryImpl,
  ],
})
export class TransactionModule {}