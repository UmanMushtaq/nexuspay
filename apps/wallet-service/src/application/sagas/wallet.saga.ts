import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { TransactionInitiatedEvent } from '@nexuspay/domain'; // Adjust import if needed

@Injectable()
export class WalletSaga {
  private readonly logger = new Logger(WalletSaga.name);

  @RabbitSubscribe({
    exchange: 'exchange.transaction',
    routingKey: 'transaction.initiated',
    queue: 'wallet.transaction.initiated.queue',
  })
  async handleTransactionInitiated(event: TransactionInitiatedEvent): Promise<void> {
    this.logger.log(`[WalletSaga] Received TransactionInitiated: ${event.reference} | Amount: ${event.amount}`);

    try {
      // TODO: Implement actual debit logic here later
      this.logger.log(`[WalletSaga] Processing debit for wallet ${event.fromWalletId}`);

      // For now, just log success (we will add real debit + response event later)
      // await this.walletService.debit(event.fromWalletId, event.amount, event.transactionId);

      this.logger.log(`[WalletSaga] Debit processed successfully for transaction ${event.reference}`);

    } catch (error) {
      this.logger.error(`[WalletSaga] Failed to process debit for transaction ${event.reference}`, error);
      // TODO: Publish wallet.debit.failed event
    }
  }
}