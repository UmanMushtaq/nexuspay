import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from "@nestjs/common";
import { SubmitKycUseCase } from "../../application/use-cases/submit-kyc.use-case";
import { SubmitKycDto } from "../../presentation/dtos/submit-kyc.dto";
import { KycResponseDto } from "../../presentation/dtos/kyc-response.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AdminGuard } from '../../common/guards/admin.guard';
import { ReviewKycUseCase } from "../../application/use-cases/review-kyc.use-case";
import { ReviewKycDto } from "../../presentation/dtos/review-kyc.dto";

@Controller('users')
export class KycController{

    constructor(private readonly submitKycUseCase:SubmitKycUseCase,
        private readonly reviewKycUseCase:ReviewKycUseCase
    ){}

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

    @Post(':id/kyc/review')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async reviewKyc(
    @Param('id') userId: string,
    @Body() dto: ReviewKycDto,
  ): Promise<KycResponseDto> {
    return this.reviewKycUseCase.execute(userId, dto);
  }
}