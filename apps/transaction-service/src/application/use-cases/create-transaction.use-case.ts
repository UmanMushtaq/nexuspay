import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { CreateTransferCommand } from '../commands/create-transfer.command';
import { TransactionRepositoryImpl } from '../../infrastructure/repositories/transaction.repository';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { DomainException } from '../../common/exceptions/domain.exception';
import { WalletLockedException } from '../../common/exceptions/wallet-locked.exception';
import { TransactionType } from '../../domain/entities/transaction-type.enum';
import { TransactionInitiatedEvent } from '../events/transaction-initiated.event';
import { RabbitMQPublisher } from '../../infrastructure/messaging/rabbit-mq.publisher';

@Injectable()
export class CreateTransactionUseCase {
  private readonly logger = new Logger(CreateTransactionUseCase.name);

  constructor(
    private readonly transactionRepository: TransactionRepositoryImpl,
    private readonly redisService: RedisService,
    private readonly rabbitPublish:RabbitMQPublisher
  ) {}

  async execute(command: CreateTransferCommand) {
    command.validate();

    try {
      // Use RedisService for locking
      const lockAcquired = await this.redisService.lockWallet(command.fromWalletId, 30);

      if (!lockAcquired) {
        throw new WalletLockedException(command.fromWalletId);
      }

      // Create Transaction
      const transaction = Transaction.create(
        command.fromWalletId,
        command.toWalletId,
        command.amount,
        TransactionType.TRANSFER,
        command.currency,
        command.description,
      );

      const savedTransaction = await this.transactionRepository.create(transaction);

      this.logger.log(`Transaction created successfully: ${savedTransaction.reference}`);
      const event = new TransactionInitiatedEvent(
        savedTransaction.id,
        savedTransaction.reference,
        savedTransaction.fromWalletId,
        savedTransaction.toWalletId,
        savedTransaction.amount,
        savedTransaction.currency,
        command.userId,
      );

      // TODO: Publish to RabbitMQ
       await this.rabbitPublish.publishTransactionInitiated(event);
      this.logger.log(`Event published: TransactionInitiatedEvent [${event.reference}]`);
      return savedTransaction;

    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }
      throw new DomainException('Failed to create transaction', 500);
    } 
    finally {
      // Always release lock
      await this.redisService.unlockWallet(command.fromWalletId);
    }
  }
}