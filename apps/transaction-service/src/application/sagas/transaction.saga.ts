import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  WalletDebitedEvent,
  WalletDebitFailedEvent,
  TransferReversedEvent,
} from '@nexuspay/domain';
import { TransactionStatus } from '../../domain/entities/transaction-status.enum';
import { TransactionRepositoryImpl } from '../../infrastructure/repositories/transaction.repository';

@Injectable()
export class TransactionSaga {
  private readonly logger = new Logger(TransactionSaga.name);

  constructor(private readonly transactionRepository: TransactionRepositoryImpl) {}

  @RabbitSubscribe({
    exchange: 'wallet.exchange',
    routingKey: 'wallet.debited',
    queue: 'transaction.wallet.debited.queue',
  })
  async handleWalletDebited(event: WalletDebitedEvent): Promise<void> {
    await this.transactionRepository.updateStatus(event.transactionId, TransactionStatus.COMPLETED);
    this.logger.log(`Transaction completed: ${event.transactionId}`);
  }

  // Wallet service moves money in one database transaction, so a failure
  // here means nothing was debited. FAILED is the correct end state.
  @RabbitSubscribe({
    exchange: 'wallet.exchange',
    routingKey: 'wallet.debit.failed',
    queue: 'transaction.wallet.debit.failed.queue',
  })
  async handleWalletDebitFailed(event: WalletDebitFailedEvent): Promise<void> {
    await this.transactionRepository.updateStatus(event.transactionId, TransactionStatus.FAILED);
    this.logger.log(`Transaction failed: ${event.transactionId} (${event.reason})`);
  }

  // A settled transfer that was undone later is ROLLBACK, not FAILED.
  // An auditor has to be able to tell the two apart.
  @RabbitSubscribe({
    exchange: 'wallet.exchange',
    routingKey: 'wallet.reversed',
    queue: 'transaction.wallet.reversed.queue',
  })
  async handleTransferReversed(event: TransferReversedEvent): Promise<void> {
    await this.transactionRepository.updateStatus(event.transactionId, TransactionStatus.ROLLBACK);
    this.logger.log(`Transaction rolled back: ${event.transactionId}`);
  }
}
