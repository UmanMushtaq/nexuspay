import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Kafka, Consumer } from 'kafkajs';
import { AnalyticsEventRepository } from "../repositories/analytics-event.repository";
import { AnalyticsEvent } from "../../domain/entities/analytics-event.entity";


@Injectable()
export class AnalyticsKafkaConsumer implements OnModuleInit{
    private readonly logger = new Logger(AnalyticsKafkaConsumer.name)
    private consumer : Consumer;

constructor(private readonly analyticsEventRepository: AnalyticsEventRepository){
    const kafka = new Kafka({
        clientId:'analytics-service',
        brokers:[process.env.KAFKA_BROKER || 'localhost:9092'],
    })
    this.consumer  = kafka.consumer({groupId:'analytic-group'})
}

async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({topic:'transactions.stream', fromBeginning:true});

        await this.consumer.run({
      eachMessage: async ({message}:{message:any})=>{
        try {
            const payload = JSON.parse(message.value?.toString() ||'{}');
            this.logger.log(`Kafka event received: ${payload.reference}`);

          const event = new AnalyticsEvent({
            transactionId: payload.transactionId,
            reference: payload.reference,
            fromWalletId: payload.fromWalletId,
            toWalletId: payload.toWalletId,
            amount: payload.amount,
            currency: payload.currency,
            userId: payload.userId,
            eventType: 'transaction.initiated',
          });

          await this.analyticsEventRepository.save(event);
          this.logger.log(`Analytics event saved: ${payload.reference}`);
        } catch (error) {
             this.logger.error('Failed to process Kafka message', error);
        }
      }  
    })
}

}