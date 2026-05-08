// apps/transaction-service/src/application/use-cases/create-transaction.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';


import { HttpStatus } from '@nestjs/common';
import Redis from 'ioredis';
import { DomainException } from '../../common/exceptions/domain.exception';
import { TransactionType } from '../../domain/entities/transaction-type.enum';
import { TransactionStatus } from '../../domain/entities/transaction-status.enum';

import { TransactionRepositoryImpl } from '../../infrastructure/repositories/transaction.repository';
@Injectable()
export class CreateTransactionUseCase {
  private readonly logger = new Logger(CreateTransactionUseCase.name);
  private readonly redis = new Redis({ host: 'localhost', port: 6379 });

constructor(
  private readonly transactionRepository: TransactionRepositoryImpl   // ← Use this
) {}
  async execute(data: {
    fromWalletId: string;
    toWalletId: string;
    amount: number;
    currency: string;
    reference: string;
  }) {
    const lockKey = `lock:wallet:${data.fromWalletId}`;
    try {
      // Redis Distributed Lock (prevent double-spend)
      
       const locked = await this.redis.set(lockKey, 'locked', 'EX', 30, 'NX');

      if (!locked) {
        throw new DomainException('Transaction in progress. Please try again.', HttpStatus.CONFLICT);
      }

      const transaction = new Transaction({
        fromWalletId: data.fromWalletId,
        toWalletId: data.toWalletId,
        amount: data.amount,
        currency: data.currency,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.PENDING,
        reference: data.reference,
      });

      const savedTransaction = await this.transactionRepository.create(transaction);

      this.logger.log(`Transaction created: ${savedTransaction.id}`);

      // TODO: Start Saga here (debit → credit → confirm)

      return savedTransaction;

    } catch (error) {
      if (error instanceof DomainException) throw error;
      throw new DomainException('Failed to create transaction', HttpStatus.INTERNAL_SERVER_ERROR);
    }finally {
      await this.redis.del(lockKey); // Release lock
    }
  }
}