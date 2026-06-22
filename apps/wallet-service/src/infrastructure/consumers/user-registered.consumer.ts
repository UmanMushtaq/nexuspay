
import { Injectable, Logger } from '@nestjs/common';
import { CreateWalletUseCase } from '../../application/use-cases/create-wallet.use-case';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class UserRegisteredConsumer {
  private readonly logger = new Logger(UserRegisteredConsumer.name);
  constructor(private readonly createWalletUseCase:CreateWalletUseCase,
     private readonly amqpConnection: AmqpConnection,
  ) {}
  @RabbitSubscribe({
    exchange: 'nexuspay.exchange',
    routingKey: 'user.kyc.approved',
    queue: 'wallet.kyc.approved',
  })

async handleKycApprovedEvent(payload: { userId: string }) {
  this.logger.log(`KYC approved event received for user: ${payload.userId}`);
  await this.createWalletUseCase.execute(payload.userId)

}

}