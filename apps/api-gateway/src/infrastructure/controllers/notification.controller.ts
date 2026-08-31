import { Controller, Get, Headers, Param } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";
import { serviceUrls } from "../config/service-urls.config";

@Controller('notifications')
export class NotificationController {
    constructor(private readonly httpService: HttpService) {}

    @Get(':userId')
    async getNotifications(
        @Param('userId') userId: string,
        @Headers('authorization') authHeader: string,
    ) {
        const response = await firstValueFrom(
            this.httpService.get(`${serviceUrls.notification}/notifications/${userId}`, {
                headers: { Authorization: authHeader },
            })
        );
        return response.data;
    }
}