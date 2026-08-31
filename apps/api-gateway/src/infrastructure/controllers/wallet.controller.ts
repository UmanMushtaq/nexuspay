import { Controller, Get, Headers, Param } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { HttpService } from '@nestjs/axios';
import { serviceUrls } from "../config/service-urls.config";

@Controller('wallets')
export class WalletController {
    constructor(private readonly httpService: HttpService) {}

    @Get(':userId')
    async getWallet(
        @Param('userId') userId: string,
        @Headers('authorization') authHeader: string,
    ) {
        const response = await firstValueFrom(
            this.httpService.get(`${serviceUrls.wallet}/wallets/${userId}`, {
                headers: { Authorization: authHeader },
            })
        );
        return response.data;
    }
}