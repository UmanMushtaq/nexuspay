import { Body, Controller, Param, Post } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";

@Controller('users')
export class UserController{
    constructor(private readonly httpService:HttpService){}

    @Post('register')
    async register(@Body() body:any){
        const response:any = await firstValueFrom(this.httpService.post('http://localhost:3001/users/register', body))
        return response.data;
    }

    @Post('login')
  async login(@Body() body: any) {
    const response:any = await firstValueFrom(
      this.httpService.post('http://localhost:3001/users/login', body)
    );
    return response.data;
  }

  @Post(':id/kyc')
  async submitKyc(@Param('id') id: string, @Body() body: any) {
    const response:any = await firstValueFrom(
      this.httpService.post(`http://localhost:3001/users/${id}/kyc`, body)
    );
    return response.data;
  }
}