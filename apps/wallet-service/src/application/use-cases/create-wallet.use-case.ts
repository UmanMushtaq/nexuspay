import { Injectable, Logger } from "@nestjs/common";
import { WalletRepositoryImpl } from "../../infrastructure/repositories/wallet.repository";
import { OnEvent } from '@nestjs/event-emitter';
import { Wallet } from "../../domain/entities/wallet.entity";


@Injectable()
export class CreateWalletUseCase {
    private readonly logger = new Logger(CreateWalletUseCase.name);

    constructor(private readonly walletRepository: WalletRepositoryImpl){}
    @OnEvent('user.registered')
    async handleUserRegisteredEvent(payload: { userId: string }) {
        this.logger.log(`Creating wallet for new user: ${payload.userId}`)
        const wallet = new Wallet({
            userId: payload.userId,
      balance: 0,
      currency: 'EUR',
      isLocked: false,
        })
        await this.walletRepository.create(wallet);

    this.logger.log(`Wallet created successfully for user ${payload.userId}`);
    }
}
