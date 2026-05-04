// apps/wallet-service/src/infrastructure/consumers/user-registered.consumer.ts
import { Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class UserRegisteredConsumer {
  private readonly logger = new Logger(UserRegisteredConsumer.name);

  @EventPattern('user.registered')
  async handleUserRegistered(data: any) {
    this.logger.log('🔥🔥🔥 RABBITMQ EVENT RECEIVED SUCCESSFULLY 🔥🔥🔥');
    this.logger.log('Event: user.registered');
    this.logger.log('Full Payload:');
    this.logger.log(JSON.stringify(data, null, 2));
    this.logger.log('→ Wallet creation logic should be triggered here');
  }
}