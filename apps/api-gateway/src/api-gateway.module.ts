import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './infrastructure/controllers/user.controller';
import { WalletController } from './infrastructure/controllers/wallet.controller';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { AnalyticsController } from './infrastructure/controllers/analytics.controller';
import { NotificationController } from './infrastructure/controllers/notification.controller';


@Module({
    imports:[HttpModule],
    controllers:[UserController, WalletController,TransactionController,NotificationController,AnalyticsController],
    providers:[]
})

export class ApiGatewayModule{}