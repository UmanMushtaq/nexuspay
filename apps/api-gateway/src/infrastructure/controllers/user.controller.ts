import { Body, Controller, Get, HttpCode, HttpStatus, Headers, Param, Post } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";
import { serviceUrls } from "../config/service-urls.config";

@Controller('users')
export class UserController {
    constructor(private readonly httpService: HttpService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: any) {
        const response = await firstValueFrom(
            this.httpService.post(`${serviceUrls.user}/users/register`, body)
        );
        return response.data;
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: any) {
        const response = await firstValueFrom(
            this.httpService.post(`${serviceUrls.user}/users/login`, body)
        );
        return response.data;
    }

    @Get('me')
    async getProfile(@Headers('authorization') authHeader: string) {
        const response = await firstValueFrom(
            this.httpService.get(`${serviceUrls.user}/users/me`, {
                headers: { Authorization: authHeader },
            })
        );
        return response.data;
    }

    @Post(':id/kyc')
    async submitKyc(
        @Param('id') id: string,
        @Body() body: any,
        @Headers('authorization') authHeader: string,
    ) {
        const response = await firstValueFrom(
            this.httpService.post(`${serviceUrls.user}/users/${id}/kyc`, body, {
                headers: { Authorization: authHeader },
            })
        );
        return response.data;
    }

    @Post(':id/kyc/review')
    async reviewKyc(
        @Param('id') id: string,
        @Body() body: any,
        @Headers('authorization') authHeader: string,
    ) {
        const response = await firstValueFrom(
            this.httpService.post(`${serviceUrls.user}/users/${id}/kyc/review`, body, {
                headers: { Authorization: authHeader },
            })
        );
        return response.data;
    }
}