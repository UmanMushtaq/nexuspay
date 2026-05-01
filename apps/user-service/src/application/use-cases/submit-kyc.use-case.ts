import { HttpStatus, Injectable } from "@nestjs/common";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repositry";
import { SubmitKycDto } from "../../presentation/dtos/submit-kyc.dto";
import { KycResponseDto } from "../../presentation/dtos/kyc-response.dto";
import { DomainException } from "../../common/exceptions/domain.exception";
import { Kyc } from "../../domain/entities/kyc.entity";
import { KycStatus } from "../../domain/entities/KycStatus.enum";



@Injectable()
export class SubmitKycUseCase{

    constructor(
        private readonly userRepository:UserRepositoryImpl
    ){}
    async execute(userId:string, dto:SubmitKycDto):Promise<KycResponseDto>{

        try {
            const user = await this.userRepository.findById(userId)
            if (!user){
                throw new DomainException('User not found', HttpStatus.NOT_FOUND)
            }

            if (user.isKycApproved()){
                throw new DomainException('KYC is already approved',HttpStatus.BAD_REQUEST)
            }
            const kyc =new Kyc({
                userId: userId,
        status: KycStatus.PENDING,
        idType: dto.idType,
        idNumber: dto.idNumber,
        idExpiry: new Date(dto.idExpiry),
        idPhotoUrl: dto.idPhotoUrl,
        selfieUrl: dto.selfieUrl,
        addressProofUrl: dto.addressProofUrl,
        submittedAt: new Date(),
            })
            const savedKyc = await this.userRepository.saveKyc(kyc);

      // Update user KYC status to PENDING
      await this.userRepository.updateKycStatus(userId, KycStatus.PENDING);

      return new KycResponseDto({
        id: savedKyc.id,
        userId: savedKyc.userId,
        status: savedKyc.status,
        message: 'KYC submitted successfully. Your documents are under review.',
      });
            
        } catch (error) {
            if (error instanceof DomainException) {
        throw error;
      }
      throw new DomainException(
        'Failed to submit KYC. Please try again later.', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
        }
    }
}