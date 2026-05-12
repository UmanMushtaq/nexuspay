import { Injectable, Logger } from "@nestjs/common";
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { TransactionInitiatedEvent } from "../../application/events/transaction-initiated.event";
@Injectable()
export class RabbitMQPublisher{
    private readonly logger = new Logger(RabbitMQPublisher.name);
    constructor(private readonly amqpConnection: AmqpConnection){}

    async publishTransactionInitiated(event:TransactionInitiatedEvent):Promise<void>{
        try {
            await this.amqpConnection.publish('exchange.transaction', 'transaction.initiated', {...event, timestamp: new Date().toISOString()
                
            });
            this.logger.log(`Published event to RabbitMQ: TransactionInitiatedEvent [${event.reference}]`);
        } catch (error: any) {
            this.logger.error(`Failed to publish event: ${error.message}`);
            
        }
    }
}