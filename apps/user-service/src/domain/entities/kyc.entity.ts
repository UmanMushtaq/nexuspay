// apps/user-service/src/domain/entities/kyc.entity.ts
import { KycStatus } from './KycStatus.enum';
import { IdType } from './IdType.enum';

export class Kyc {
  readonly id!: string;                    // ! = definite assignment assertion
  userId!: string;

  status!: KycStatus;

  idType!: IdType;
  idNumber!: string;
  idExpiry!: Date;
  idPhotoUrl?: string;
  selfieUrl?: string;
  addressProofUrl?: string;

  submittedAt!: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;

  constructor(partial: Partial<Kyc> = {}) {
    Object.assign(this, partial);

    // Default values
    this.submittedAt = this.submittedAt || new Date();
    this.status = this.status || KycStatus.PENDING;
  }

  approve(reviewedBy: string): void {
    this.status = KycStatus.APPROVED;
    this.reviewedBy = reviewedBy;
    this.reviewedAt = new Date();
  }

  reject(reason: string, reviewedBy: string): void {
    this.status = KycStatus.REJECTED;
    this.rejectionReason = reason;
    this.reviewedBy = reviewedBy;
    this.reviewedAt = new Date();
  }

  isApproved(): boolean {
    return this.status === KycStatus.APPROVED;
  }
}