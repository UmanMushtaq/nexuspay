import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './infrastructure/controllers/user.controller';
import { WalletController } from './infrastructure/controllers/wallet.controller';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { AnalyticsController } from './infrastructure/controllers/analytics.controller';
import { NotificationController } from './infrastructure/controllers/notification.controller';
import { RateLimitGuard } from './infrastructure/guards/rate-limit.guard';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports:[HttpModule,
        JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    }),
    ],
    controllers:[UserController, WalletController,TransactionController,NotificationController,AnalyticsController],
    providers:[
        {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    ]
})

export class ApiGatewayModule{}