
import { Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CreateWalletUseCase } from '../../application/use-cases/create-wallet.use-case';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class UserRegisteredConsumer {
  private readonly logger = new Logger(UserRegisteredConsumer.name);
  constructor(private readonly createWalletUseCase:CreateWalletUseCase) {}
  @RabbitSubscribe({
    exchange: 'nexuspay.exchange',
    routingKey: 'user.kyc.approved',
    queue: 'wallet.kyc.approved',
  })

async handleKycApprovedEvent(payload: { userId: string }) {
  this.logger.log(`KYC approved event received for user: ${payload.userId}`);
  await this.createWalletUseCase.execute(payload.userId)

}
  @EventPattern('user.registered')
  async handleUserRegistered(data: any) {
    this.logger.log('🔥🔥🔥 RABBITMQ EVENT RECEIVED SUCCESSFULLY 🔥🔥🔥');
    this.logger.log('Event: user.registered');
    this.logger.log('Full Payload:');
    this.logger.log(JSON.stringify(data, null, 2));
    this.logger.log('→ Wallet creation logic should be triggered here');
  }
}