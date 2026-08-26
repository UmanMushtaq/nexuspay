import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CreateNotificationUseCase } from '../../application/use-cases/create-notification.use-case';
import { NotificationType } from '../../domain/entities/notification.entity';

@Injectable()
export class NotificationConsumer {
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
  ) {}

  @RabbitSubscribe({
    exchange: 'nexuspay.exchange',
    routingKey: 'user.kyc.approved',
    queue: 'notification.kyc.approved',
  })
  async handleKycApproved(event: any): Promise<void> {
    this.logger.log(`[NotificationConsumer] KYC approved for user: ${event.userId}`);
    await this.createNotificationUseCase.execute(
      event.userId,
      NotificationType.KYC_APPROVED,
      'Your KYC has been approved. Your wallet is now active.',
    );
  }

  @RabbitSubscribe({
    exchange: 'nexuspay.exchange',
    routingKey: 'user.kyc.rejected',
    queue: 'notification.kyc.rejected',
  })
  async handleKycRejected(event: any): Promise<void> {
    this.logger.log(`[NotificationConsumer] KYC rejected for user: ${event.userId}`);
    await this.createNotificationUseCase.execute(
      event.userId,
      NotificationType.KYC_REJECTED,
      'Your KYC has been rejected. Please resubmit your documents.',
    );
  }

  @RabbitSubscribe({
    exchange: 'wallet.exchange',
    routingKey: 'wallet.debited',
    queue: 'notification.transaction.completed',
  })
  async handleTransactionCompleted(event: any): Promise<void> {
    this.logger.log(`[NotificationConsumer] Transaction completed: ${event.reference}`);
    await this.createNotificationUseCase.execute(
      event.userId || 'system',
      NotificationType.TRANSACTION_COMPLETED,
      `Your transfer of ${event.amount} EUR (ref: ${event.reference}) was completed successfully.`,
    );
  }

  @RabbitSubscribe({
    exchange: 'wallet.exchange',
    routingKey: 'wallet.debit.failed',
    queue: 'notification.transaction.failed',
  })
  async handleTransactionFailed(event: any): Promise<void> {
    this.logger.log(`[NotificationConsumer] Transaction failed: ${event.reference}`);
    await this.createNotificationUseCase.execute(
      event.userId || 'system',
      NotificationType.TRANSACTION_FAILED,
      `Your transfer (ref: ${event.reference}) failed. Reason: ${event.reason || 'Unknown error'}.`,
    );
  }
}