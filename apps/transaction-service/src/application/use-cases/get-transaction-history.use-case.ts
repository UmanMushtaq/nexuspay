import { Injectable, Logger } from '@nestjs/common';
import { TransactionRepositoryImpl } from '../../infrastructure/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';

@Injectable()
export class GetTransactionHistoryUseCase {
  private readonly logger = new Logger(GetTransactionHistoryUseCase.name);

  constructor(
    private readonly transactionRepository: TransactionRepositoryImpl,
  ) {}

  async execute(walletId: string): Promise<Transaction[]> {
    this.logger.log(`Fetching transaction history for wallet: ${walletId}`);
    return this.transactionRepository.findByWalletId(walletId);
  }
}