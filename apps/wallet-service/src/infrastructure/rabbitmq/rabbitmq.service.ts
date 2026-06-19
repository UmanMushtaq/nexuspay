import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);

  log(message: string) {
    this.logger.log(message);
  }
}