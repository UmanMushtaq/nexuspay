import { Injectable, Logger } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";


@Injectable()
export class UserRegisteredConsumer{
    private readonly logger = new Logger(UserRegisteredConsumer.name)

    @EventPattern('user.registered')
    async handleUserRegister(data:any){
        this.logger.log(`[RabbitMQ Event Received] New User Registered!`);
    this.logger.log(`User ID: ${data.userId}`);
    this.logger.log(`Email: ${data.email}`);
    this.logger.log(`Name: ${data.firstName}`);
    this.logger.log(`Time: ${data.timestamp}`);
    }
}