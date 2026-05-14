import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { TransactionInitiatedEvent, WalletDebitedEvent, WalletDebitFailedEvent } from '@nexuspay/domain';

@Injectable()
export class WalletSaga {
  private readonly logger = new Logger(WalletSaga.name);
    constructor(
        private readonly amqpConnection:AmqpConnection
    ) {}
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
        const debitSuccess = false; // Simulate success for now
      // For now, just log success (we will add real debit + response event later)
      // await this.walletService.debit(event.fromWalletId, event.amount, event.transactionId);
        if (debitSuccess) {
        this.logger.log(`[WalletSaga] ✅ Debit successful for ${event.reference}`);
        // Publish success event back to Transaction Service
        // await this.rabbitPublisher.publishWalletDebited(event);
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
      } else {
        throw new Error('Insufficient funds');
      }
      this.logger.log(`[WalletSaga] Debit processed successfully for transaction ${event.reference}`);

    } catch (error:any) {
      this.logger.error(`[WalletSaga] Failed to process debit for transaction ${event.reference}`, error);
      
      const failedEvent = new WalletDebitFailedEvent(
        event.transactionId,
        event.reference,
        event.fromWalletId,
        error.message || 'Unknown error'
      )
      await this.amqpConnection.publish(
        'wallet.exchange',
        'wallet.debit.failed',
        failedEvent
      );
    }
  }
}