import { Kyc } from "./kyc.entity";
import { KycStatus } from "./KycStatus.enum";
import { UserRole } from "./UserRole.enum";

export class User{
    readonly id!:string;
    readonly email!:string;
     passwordHash!:string
     firstName!: string;
  lastName!: string;
  dateOfBirth!: Date;
  nationality!: string;
  phone!: string;

  role!: UserRole;
  kycStatus:KycStatus = KycStatus.PENDING;
  kyc?:Kyc;
  isEmailVerified!: boolean;
  isPhoneVerified!: boolean;

  readonly createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(partial:Partial<User>){
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date()
  }

  isKycApproved():boolean{
    return this.kycStatus ===KycStatus.APPROVED
  }
  canCreateWallet():boolean{
    return this.isKycApproved() &&this.isEmailVerified
  }
}