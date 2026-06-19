import { Injectable, Logger } from '@nestjs/common';
import { WalletRepositoryImpl } from '../../infrastructure/repositories/wallet.repository';
import { Wallet } from '../../domain/entities/wallet.entity';

@Injectable()
export class CreateWalletUseCase {
  private readonly logger = new Logger(CreateWalletUseCase.name);

  constructor(private readonly walletRepository: WalletRepositoryImpl) {}

  async execute(userId: string): Promise<void> {
    const existing = await this.walletRepository.findByUserId(userId);
    if (existing) {
      this.logger.warn(`Wallet already exists for user ${userId}`);
      return;
    }

    const wallet = new Wallet({
      userId,
      balance: 0,
      currency: 'EUR',
      isLocked: false,
    });

    await this.walletRepository.create(wallet);
    this.logger.log(`Wallet created for user ${userId}`);
  }
}