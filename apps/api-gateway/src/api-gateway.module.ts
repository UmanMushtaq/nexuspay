import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './infrastructure/controllers/user.controller';
import { WalletController } from './infrastructure/controllers/wallet.controller';

@Module({
    imports:[HttpModule],
    controllers:[UserController, WalletController],
    providers:[]
})

export class ApiGatewayModule{}