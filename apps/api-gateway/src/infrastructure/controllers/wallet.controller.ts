import { Controller, Get, Injectable, Param } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { HttpService } from '@nestjs/axios';


@Controller('wallets')
export class WalletController{
    constructor(private readonly httpService:HttpService){}

    @Get(':userId')
  async getWallet(@Param('userId') userId: string) {
    const response:any = await firstValueFrom(
      this.httpService.get(`http://localhost:3002/wallets/${userId}`)
    );
    return response.data;
  }
}