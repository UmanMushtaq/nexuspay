
import { Injectable, Logger } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { Transaction } from '../../domain/entities/transaction.entity';

import { TransactionStatus } from '../../domain/entities/transaction-status.enum';

import { TransactionRepositoryImpl } from '../../infrastructure/repositories/transaction.repository';

@Injectable()
export class TransactionSaga{
    private readonly logger = new Logger(TransactionSaga.name)
    constructor (private readonly transactionRepository:TransactionRepositoryImpl){}

   @OnEvent('transaction.created')
    async handleTransactionCreated(transaction:Transaction):Promise<void>{
        this.logger.log(`Starting Saga for transaction: ${transaction.id}`);
        try {
            this.logger.log(`Saga completed successfully for transaction ${transaction.id}`);
        } catch (error) {
            this.logger.error(`Saga failed for transaction ${transaction.id}, starting rollback`, error);
            await this.transactionRepository.updateStatus(transaction.id, TransactionStatus.COMPLETED);
      await this.rollbackTransaction(transaction.id);
        }
    }
    private async rollbackTransaction(transactionId: string) {
    try {
      await this.transactionRepository.updateStatus(transactionId, TransactionStatus.ROLLBACK);
      this.logger.log(`Transaction rolled back: ${transactionId}`);
    } catch (e) {
      this.logger.error('Rollback failed', e);
    }
  }
}