import { Module } from "@nestjs/common";
import { WalletOrmEntity } from "./infrastructure/persistence/entities/wallet.orm-entity";
import { WalletRepositoryImpl } from "./infrastructure/repositories/wallet.repository";
import { CreateWalletUseCase } from "./application/use-cases/create-wallet.use-case";
import { WalletController } from "./infrastructure/controllers/wallet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRegisteredConsumer } from "./infrastructure/consumers/user-registered.consumer";
import { databaseConfig } from "./infrastructure/persistence/config/database.config";
import { RabbitMQService } from "./infrastructure/rabbitmq/rabbitmq.service";
import { WalletSaga } from "./application/sagas/wallet.saga";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
 imports: [
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
  exchanges: [
    { name: 'exchange.transaction', type: 'topic' },
    { name: 'wallet.exchange', type: 'topic' },
  ],
  uri: process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672',
  connectionInitOptions: { wait: false },
}),
   TypeOrmModule.forRootAsync({
            useFactory:()=>databaseConfig,
        }),
    TypeOrmModule.forFeature([WalletOrmEntity]),
  ],
  controllers: [WalletController],
  providers: [
    CreateWalletUseCase,
    WalletRepositoryImpl,
    UserRegisteredConsumer,
    RabbitMQService,
    WalletSaga,
    
  ],
})
export class WalletModule {}