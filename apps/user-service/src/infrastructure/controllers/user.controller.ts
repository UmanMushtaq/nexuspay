import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { RegisterUserUseCase } from "../../application/use-cases";

import { CreateUserDto } from "../../presentation/dtos/create-user.dto";
import { RegisterResponseDto } from "../../presentation/dtos/register-response.dto";
import { LoginDto } from "../../presentation/dtos/login.dto";
import { LoginResponseDto } from "../../presentation/dtos/login-response.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { GetUserProfileUseCase } from "../../application/use-cases/get-user-profile.use-case";



@Controller('users')
export class UserController{

    constructor(private readonly registerUserUseCase:RegisterUserUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly getUserProfileUseCase: GetUserProfileUseCase,
    ){}
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto:CreateUserDto): Promise<RegisterResponseDto>{
        return this.registerUserUseCase.execute(createUserDto)
    }
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto ): Promise<LoginResponseDto>{
        return this.loginUseCase.execute(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req:any){
        return this.getUserProfileUseCase.execute(req.user.sub);
    }
}