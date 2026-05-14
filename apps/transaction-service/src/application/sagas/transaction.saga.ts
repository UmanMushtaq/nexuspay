
import { Get, HttpCode, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Transaction } from '../../domain/entities/transaction.entity';

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
    async handleTransactionCreated(transaction:Transaction):Promise<void>{
        this.logger.log(`Starting Saga for transaction: ${transaction.id}`);
        try {
          await this.transactionRepository.updateStatus(transaction.id, TransactionStatus.COMPLETED);
            this.logger.log(`Saga completed successfully for transaction ${transaction.id}`);
        } catch (error) {
            this.logger.error(`Saga failed for transaction ${transaction.id}, starting rollback`, error);
           
        }
    }
     @RabbitSubscribe({
    exchange: 'wallet.exchange',
    routingKey: 'wallet.debit.failed',
    queue: 'transaction.wallet.debit.failed.queue',
  }) 
    async handleWalletDebitFailed(transactionId: string) {
    try {
      await this.transactionRepository.updateStatus(transactionId, TransactionStatus.FAILED);
      this.logger.log(`Transaction rolled back: ${transactionId}`);
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