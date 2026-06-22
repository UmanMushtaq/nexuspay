import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer } from 'kafkajs';


@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy{
    private readonly logger = new Logger(KafkaProducerService.name)

    private producer : Producer;

    constructor(){
        const kafka = new Kafka({
            clientId: 'transaction-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        })
        this.producer = kafka.producer();

    }
    async onModuleInit() {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async publishToKafka(topic:string, message:object):Promise<void>{
    try {
         await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      this.logger.log(`Published to Kafka topic: ${topic}`);
    } catch (error:any) {
        this.logger.error(`Failed to publish to Kafka: ${error.message}`);
        
    }

  }

}