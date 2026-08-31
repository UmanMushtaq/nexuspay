import { Controller, Get, Headers } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";
import { serviceUrls } from "../config/service-urls.config";

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly httpService: HttpService) {}

    @Get('events')
    async getEvents(@Headers('authorization') authHeader: string) {
        const response = await firstValueFrom(
            this.httpService.get(`${serviceUrls.analytics}/analytics/events`, {
                headers: { Authorization: authHeader },
            })
        );
        return response.data;
    }
}