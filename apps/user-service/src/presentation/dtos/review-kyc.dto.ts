import { IsEnum, IsOptional, IsString } from "class-validator";
import { KycStatus } from "../../domain/entities/KycStatus.enum";


export class ReviewKycDto{
    @IsEnum([KycStatus.APPROVED, KycStatus.REJECTED])
    decision!:KycStatus.APPROVED | KycStatus.REJECTED;

    @IsString()
    reviewedBy!:string;

    @IsString()
    @IsOptional()
    rejectionReason?:string;
}