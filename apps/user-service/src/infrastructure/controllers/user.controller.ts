import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { RegisterUserUseCase } from "../../application/use-cases";

import { CreateUserDto } from "../../presentation/dtos/create-user.dto";
import { RegisterResponseDto } from "../../presentation/dtos/register-response.dto";



@Controller('users')
export class UserController{

    constructor(private readonly registerUserUseCase:RegisterUserUseCase
    ){}
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto:CreateUserDto): Promise<RegisterResponseDto>{
        return this.registerUserUseCase.execute(createUserDto)
    }
}