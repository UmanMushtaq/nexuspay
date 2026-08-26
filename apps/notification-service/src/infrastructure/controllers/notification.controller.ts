import { Controller, Get, Param } from '@nestjs/common';
import { NotificationRepositoryImpl } from '../repositories/notification.repository';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationRepository: NotificationRepositoryImpl,
  ) {}

  @Get(':userId')
  async getNotifications(@Param('userId') userId: string) {
    const notifications = await this.notificationRepository.findByUserId(userId);
    return {
      success: true,
      userId,
      count: notifications.length,
      data: notifications,
    };
  }
}