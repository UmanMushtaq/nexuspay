import { HttpStatus, Injectable } from "@nestjs/common";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repositry";
import { ReviewKycDto } from "../../presentation/dtos/review-kyc.dto";
import { KycResponseDto } from "../../presentation/dtos/kyc-response.dto";
import { KycStatus } from "../../domain/entities/KycStatus.enum";
import { DomainException } from "../../common/exceptions/domain.exception";
import { KycEventPublisher } from "../../infrastructure/messaging/kyc-event.publisher";

@Injectable()
export class ReviewKycUseCase {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly kycEventPublisher: KycEventPublisher,
  ) {}

  async execute(userId: string, dto: ReviewKycDto): Promise<KycResponseDto> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new DomainException('User not found', HttpStatus.NOT_FOUND);
      }

      const kyc = await this.userRepository.findKycByUserId(userId);
      if (!kyc) {
        throw new DomainException(
          'No KYC submission found for this user',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (kyc.status === KycStatus.APPROVED) {
        throw new DomainException(
          'KYC is already approved',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.userRepository.updateKycStatus(
        userId,
        dto.decision,
        dto.reviewedBy,
      );

      if (dto.decision === KycStatus.APPROVED) {
        await this.kycEventPublisher.publishKycApproved(user.id, user.email);
      } else {
        await this.kycEventPublisher.publishKycRejected(user.id, user.email, dto.rejectionReason);
      }

      const message =
        dto.decision === KycStatus.APPROVED
          ? 'KYC approved successfully.'
          : `KYC rejected. Reason: ${dto.rejectionReason ?? 'Not specified'}`;

      return new KycResponseDto({
        id: kyc.id,
        userId: kyc.userId,
        status: dto.decision,
        message,
      });
    } catch (error) {
      console.error('FULL ERROR:', error);
      if (error instanceof DomainException) throw error;
      throw new DomainException(
        'Failed to review KYC. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}