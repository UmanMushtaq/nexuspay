import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { TransactionInitiatedEvent, WalletDebitedEvent, WalletDebitFailedEvent } from '@nexuspay/domain';
import { WalletRepositoryImpl } from '../../infrastructure/repositories/wallet.repository';

@Injectable()
export class WalletSaga {
  private readonly logger = new Logger(WalletSaga.name);
    constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly walletRepository: WalletRepositoryImpl
  ) {}
  @RabbitSubscribe({
    exchange: 'exchange.transaction',
    routingKey: 'transaction.initiated',
    queue: 'wallet.transaction.initiated.queue',
  })
  async handleTransactionInitiated(event: TransactionInitiatedEvent): Promise<void> {
    this.logger.log(`[WalletSaga] Received TransactionInitiated: ${event.reference} | Amount: ${event.amount}`);

    try {
      this.logger.log(`[WalletSaga] Processing debit for wallet ${event.fromWalletId}`);

      const wallet = await this.walletRepository.findById(event.fromWalletId);
      if (!wallet) {
        throw new Error(`Wallet not found: ${event.fromWalletId}`);
      }

      if (!wallet.canSpend(event.amount)) {
        throw new Error('Insufficient funds or wallet is locked');
      }

      await this.walletRepository.deductBalance(wallet.userId, event.amount);

      this.logger.log(`[WalletSaga] ✅ Debit successful for ${event.reference}`);

      const successEvent = new WalletDebitedEvent(
        event.transactionId,
        event.reference,
        event.fromWalletId,
        event.amount
      );

      await this.amqpConnection.publish(
        'wallet.exchange',
        'wallet.debited',
        successEvent
      );

      this.logger.log(`[WalletSaga] Debit processed successfully for transaction ${event.reference}`);

    } catch (error: any) {
      this.logger.error(`[WalletSaga] Failed to process debit for transaction ${event.reference}`, error);

      const failedEvent = new WalletDebitFailedEvent(
        event.transactionId,
        event.reference,
        event.fromWalletId,
        error.message || 'Unknown error'
      );

      await this.amqpConnection.publish(
        'wallet.exchange',
        'wallet.debit.failed',
        failedEvent
      );
    }
  }

}