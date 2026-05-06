
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);

  async onModuleInit() {
    try {
      const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
      const channel = await connection.createChannel();

      await channel.assertQueue('user_events', { durable: true });

      this.logger.log('✅ RabbitMQ Connected - Listening on queue: user_events');

      channel.consume('user_events', (msg) => {
        if (msg) {
          const data = JSON.parse(msg.content.toString());
          this.logger.log('🔥 RABBITMQ EVENT RECEIVED 🔥');
          this.logger.log('Data: ' + JSON.stringify(data, null, 2));
          channel.ack(msg);
        }
      });

    } catch (error) {
      this.logger.error('RabbitMQ Error', error);
    }
  }
}