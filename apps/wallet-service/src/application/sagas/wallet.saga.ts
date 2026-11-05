import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  TransactionInitiatedEvent,
  WalletDebitedEvent,
  WalletDebitFailedEvent,
  TransferReversalRequestedEvent,
  TransferReversedEvent,
} from '@nexuspay/domain';
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

    const outcome = await this.walletRepository.transfer({
      transactionId: event.transactionId,
      fromWalletId: event.fromWalletId,
      toWalletId: event.toWalletId,
      amount: Number(event.amount),
    });

    if (outcome === 'DUPLICATE') {
      this.logger.warn(`[WalletSaga] Redelivery ignored for ${event.reference}`);
      return;
    }

    if (outcome !== 'OK') {
      this.logger.warn(`[WalletSaga] Transfer rejected for ${event.reference}: ${outcome}`);
      await this.amqpConnection.publish(
        'wallet.exchange',
        'wallet.debit.failed',
        new WalletDebitFailedEvent(
          event.transactionId,
          event.reference,
          event.fromWalletId,
          outcome,
        ),
      );
      return;
    }

    this.logger.log(`[WalletSaga] Transfer settled for ${event.reference}`);
    await this.amqpConnection.publish(
      'wallet.exchange',
      'wallet.debited',
      new WalletDebitedEvent(
        event.transactionId,
        event.reference,
        event.fromWalletId,
        Number(event.amount),
      ),
    );
  }

  // Undoes a settled transfer when transaction-service asks for it.
  @RabbitSubscribe({
    exchange: 'exchange.transaction',
    routingKey: 'transaction.reversal.requested',
    queue: 'wallet.transaction.reversal.queue',
  })
  async handleReversalRequested(event: TransferReversalRequestedEvent): Promise<void> {
    this.logger.log(`[WalletSaga] Reversal requested for ${event.reference}: ${event.reason}`);

    const outcome = await this.walletRepository.refund({
      transactionId: event.transactionId,
      walletId: event.fromWalletId,
      amount: Number(event.amount),
    });

    if (outcome === 'WALLET_NOT_FOUND') {
      this.logger.error(`[WalletSaga] Cannot refund ${event.reference}, wallet missing`);
      return;
    }

    if (outcome === 'DUPLICATE') {
      this.logger.warn(`[WalletSaga] Refund already applied for ${event.reference}`);
    }

    await this.amqpConnection.publish(
      'wallet.exchange',
      'wallet.reversed',
      new TransferReversedEvent(
        event.transactionId,
        event.reference,
        event.fromWalletId,
        Number(event.amount),
      ),
    );
  }
}
