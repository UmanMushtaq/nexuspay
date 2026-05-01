import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IdType } from "../../domain/entities/IdType.enum";


export class SubmitKycDto{

    @IsEnum(IdType)
    @IsNotEmpty()
    idType!:IdType

    @IsString()
    @IsNotEmpty()
    idNumber!:string

    @IsDateString()
    @IsNotEmpty()
    idExpiry!:string

    @IsString()
    @IsOptional()
    idPhotoUrl?:string

    @IsString()
    @IsOptional()
    selfieUrl?:string

    @IsString()
    @IsOptional()
    addressProofUrl?:string
}