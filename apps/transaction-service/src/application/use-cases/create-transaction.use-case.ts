// apps/transaction-service/src/application/use-cases/create-transaction.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';


import { HttpStatus } from '@nestjs/common';
import Redis from 'ioredis';
import { DomainException } from '../../common/exceptions/domain.exception';
import { TransactionType } from '../../domain/entities/transaction-type.enum';
import { TransactionStatus } from '../../domain/entities/transaction-status.enum';

import { TransactionRepositoryImpl } from '../../infrastructure/repositories/transaction.repository';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { CreateTransferCommand } from '../commands/create-transfer.command';
@Injectable()
export class CreateTransactionUseCase {
  private readonly logger = new Logger(CreateTransactionUseCase.name);
  private readonly redis = new Redis({ host: 'localhost', port: 6379 });

constructor(
  private readonly transactionRepository: TransactionRepositoryImpl,   // ← Use this
  private readonly redisService: RedisService,
) {}
  async execute(command:CreateTransferCommand) {
    command.validate();
    const lockKey = `lock:wallet:${command.fromWalletId}`;
    try {
      // Redis Distributed Lock (prevent double-spend)
      
       const locked = await this.redisService.lockWallet(command.fromWalletId, 30);

      if (!locked) {
        throw new DomainException('Transaction in progress. Please try again.', HttpStatus.CONFLICT);
      }

      const transaction = new Transaction({
        fromWalletId: command.fromWalletId,
        toWalletId: command.toWalletId,
        amount: command.amount,
        currency: command.currency,
        type: TransactionType.TRANSFER,
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