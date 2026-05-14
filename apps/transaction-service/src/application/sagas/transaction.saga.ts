
import { Get, HttpCode, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Transaction } from '../../domain/entities/transaction.entity';
import { WalletDebitedEvent, WalletDebitFailedEvent } from '@nexuspay/domain';
import { TransactionStatus } from '../../domain/entities/transaction-status.enum';

import { TransactionRepositoryImpl } from '../../infrastructure/repositories/transaction.repository';

@Injectable()
export class TransactionSaga{
    private readonly logger = new Logger(TransactionSaga.name)
    constructor (private readonly transactionRepository:TransactionRepositoryImpl){}

    @RabbitSubscribe({
      exchange:'wallet.exchange',
      routingKey:'wallet.debited',
      queue:'transaction.wallet.debited.queue',
   
    }) 
    async handleTransactionCreated(event:WalletDebitedEvent):Promise<void>{
        this.logger.log(`Starting Saga for transaction: ${event.transactionId}`);
        try {
          await this.transactionRepository.updateStatus(event.transactionId, TransactionStatus.COMPLETED);
            this.logger.log(`Saga completed successfully for transaction ${event.transactionId}`);
        } catch (error) {
            this.logger.error(`Saga failed for transaction ${event.transactionId}, starting rollback`, error);
           
        }
    }
     @RabbitSubscribe({
    exchange: 'wallet.exchange',
    routingKey: 'wallet.debit.failed',
    queue: 'transaction.wallet.debit.failed.queue',
  }) 
    async handleWalletDebitFailed(event: WalletDebitFailedEvent) {
    try {
      await this.transactionRepository.updateStatus(event.transactionId, TransactionStatus.FAILED);
      this.logger.log(`Transaction rolled back: ${event.transactionId}`);
    } catch (e) {
      this.logger.error('Rollback failed', e);
    }
  }
  @Get('health')
@HttpCode(HttpStatus.OK)
health() {
  return {
    status: 'ok',
    service: 'transaction-service',
    timestamp: new Date().toISOString(),
  };
}
}