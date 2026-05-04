import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { WalletRepositoryImpl } from "../repositories/wallet.repository";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";


@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletController{
    constructor(private readonly walletRepository: WalletRepositoryImpl){}

    @Get(':userId')
    async getWallet(@Param('userId') userId:string){
const wallet = await this.walletRepository.findByUserId(userId);
    return wallet || { message: 'Wallet not found' };
    }


}
