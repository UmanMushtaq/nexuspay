import { Module } from "@nestjs/common";
import { WalletOrmEntity } from "./infrastructure/persistence/entities/wallet.orm-entity";
import { WalletRepositoryImpl } from "./infrastructure/repositories/wallet.repository";
import { CreateWalletUseCase } from "./application/use-cases/create-wallet.use-case";
import { WalletController } from "./infrastructure/controllers/wallet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRegisteredConsumer } from "./infrastructure/consumers/user-registered.consumer";
import { databaseConfig } from "./infrastructure/persistence/config/database.config";
import { RabbitMQService } from "./infrastructure/rabbitmq/rabbitmq.service";


@Module({
 imports: [
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
    
  ],
})
export class WalletModule {}