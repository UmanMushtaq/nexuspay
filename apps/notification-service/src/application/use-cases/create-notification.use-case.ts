import { Injectable, Logger } from '@nestjs/common';
import { NotificationRepositoryImpl } from '../../infrastructure/repositories/notification.repository';
import {
  Notification,
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '../../domain/entities/notification.entity';

@Injectable()
export class CreateNotificationUseCase {
  private readonly logger = new Logger(CreateNotificationUseCase.name);

  constructor(
    private readonly notificationRepository: NotificationRepositoryImpl,
  ) {}

  async execute(
    userId: string,
    type: NotificationType,
    message: string,
  ): Promise<void> {
    const notification = new Notification({
      id: crypto.randomUUID(),
      userId,
      type,
      message,
      channel: NotificationChannel.EMAIL,
      status: NotificationStatus.SENT,
    });

    await this.notificationRepository.create(notification);
    this.logger.log(`[Notification] ${type} sent to user ${userId}: ${message}`);
  }
}