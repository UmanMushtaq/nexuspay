import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Req, UseGuards } from "@nestjs/common";
import { RegisterUserUseCase } from "../../application/use-cases";

import { CreateUserDto } from "../../presentation/dtos/create-user.dto";
import { RegisterResponseDto } from "../../presentation/dtos/register-response.dto";
import { LoginDto } from "../../presentation/dtos/login.dto";
import { LoginResponseDto } from "../../presentation/dtos/login-response.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";



@Controller('users')
export class UserController{

    constructor(private readonly registerUserUseCase:RegisterUserUseCase
    ){}
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto:CreateUserDto): Promise<RegisterResponseDto>{
        return this.registerUserUseCase.execute(createUserDto)
    }
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto ): Promise<LoginResponseDto>{
        return this.login.execute(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req:any){
        return {
            message: "This is a protected route",
            user:req.user
        }
    }
}