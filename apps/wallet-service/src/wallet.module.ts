import { Module } from "@nestjs/common";
import { WalletOrmEntity } from "./infrastructure/persistence/entities/wallet.orm-entity";
import { WalletRepositoryImpl } from "./infrastructure/repositories/wallet.repository";
import { CreateWalletUseCase } from "./application/use-cases/create-wallet.use-case";
import { WalletController } from "./infrastructure/controllers/wallet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
 imports: [
    TypeOrmModule.forFeature([WalletOrmEntity]),
  ],
  controllers: [WalletController],
  providers: [
    CreateWalletUseCase,
    WalletRepositoryImpl,
  ],
})
export class WalletModule {}