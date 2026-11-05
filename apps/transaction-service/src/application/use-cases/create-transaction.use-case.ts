import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { CreateTransferCommand } from '../commands/create-transfer.command';
import { TransactionRepositoryImpl } from '../../infrastructure/repositories/transaction.repository';
import { DomainException } from '../../common/exceptions/domain.exception';
import { TransactionType } from '../../domain/entities/transaction-type.enum';
import { TransactionInitiatedEvent } from '../events/transaction-initiated.event';
import { RabbitMQPublisher } from '../../infrastructure/messaging/rabbit-mq.publisher';
import { KafkaProducerService } from '../../infrastructure/kafka/kafka-producer.service';

@Injectable()
export class CreateTransactionUseCase {
  private readonly logger = new Logger(CreateTransactionUseCase.name);

  constructor(
    private readonly transactionRepository: TransactionRepositoryImpl,
    private readonly rabbitPublish: RabbitMQPublisher,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  // No wallet lock here on purpose. The balance invariant is enforced by a
  // conditional UPDATE inside wallet-service, which is the only place that
  // sees every concurrent writer.
  async execute(command: CreateTransferCommand) {
    command.validate();

    try {
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

      await this.rabbitPublish.publishTransactionInitiated(event);
      this.logger.log(`Event published: TransactionInitiatedEvent [${event.reference}]`);

      await this.kafkaProducer.publishToKafka('transactions.stream', {
        ...event,
        timestamp: new Date().toISOString(),
      });

      return savedTransaction;
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }
      throw new DomainException('Failed to create transaction', 500);
    }
  }
}
