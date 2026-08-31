import { Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";
import { serviceUrls } from "../config/service-urls.config";

@Controller('transactions')
export class TransactionController {
    constructor(private readonly httpService: HttpService) {}

    @Post('transfer')
    async transfer(
        @Body() body: any,
        @Headers('authorization') authHeader: string,
    ) {
        const response = await firstValueFrom(
            this.httpService.post(`${serviceUrls.transaction}/transactions/transfer`, body, {
                headers: { Authorization: authHeader },
            })
        );
        return response.data;
    }

    @Get(':walletId/history')
    async getHistory(
        @Param('walletId') walletId: string,
        @Headers('authorization') authHeader: string,
    ) {
        const response = await firstValueFrom(
            this.httpService.get(`${serviceUrls.transaction}/transactions/${walletId}/history`, {
                headers: { Authorization: authHeader },
            })
        );
        return response.data;
    }
}