import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class KycEventPublisher {
  private readonly logger = new Logger(KycEventPublisher.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishKycApproved(userId: string, email: string): Promise<void> {
    await this.amqpConnection.publish('nexuspay.exchange', 'user.kyc.approved', {
      userId,
      email,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Published user.kyc.approved for user ${userId}`);
  }

  async publishKycRejected(userId: string, email: string, reason?: string): Promise<void> {
    await this.amqpConnection.publish('nexuspay.exchange', 'user.kyc.rejected', {
      userId,
      email,
      reason,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Published user.kyc.rejected for user ${userId}`);
  }
}