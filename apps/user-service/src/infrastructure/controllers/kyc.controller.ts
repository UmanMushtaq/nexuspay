import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from "@nestjs/common";
import { SubmitKycUseCase } from "../../application/use-cases/submit-kyc.use-case";
import { SubmitKycDto } from "../../presentation/dtos/submit-kyc.dto";
import { KycResponseDto } from "../../presentation/dtos/kyc-response.dto";


@Controller('users')
export class KycController{

    constructor(private readonly submitKycUseCase:SubmitKycUseCase){}

    @Post(':id/kyc')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async submitKyc(
        @Param('id') userId:string,
        @Body() dto:SubmitKycDto,
         @Req() req: any
    ):Promise<KycResponseDto>{
        return this.submitKycUseCase.execute(userId,dto)
    }
}