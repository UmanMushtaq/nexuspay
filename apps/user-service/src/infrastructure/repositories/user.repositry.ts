import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserOrmEntity } from "../persistence/entities/user.orm-entity";
import { Repository } from "typeorm";
import { KycOrmEntity } from "../persistence/entities/kyc.orm-entity";
import { User } from "../../domain/entities/user.entity";
import { Kyc } from "../../domain/entities/kyc.entity";

import { KycStatus } from "../../domain/entities/KycStatus.enum";
import { UserRole } from "../../domain/entities/UserRole.enum";
import { IdType } from "../../domain/entities/IdType.enum";


@Injectable()
export class UserRepositoryImpl implements UserRepository {

    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly userRepository: Repository<UserOrmEntity>,
        @InjectRepository(KycOrmEntity)
        private readonly kycRepository: Repository<KycOrmEntity>
    ){}

    async create(user: User): Promise<User> {
        const userOrm = this.userRepository.create({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      nationality: user.nationality,
      phone: user.phone,
      role: user.role,
      kycStatus: user.kycStatus,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
    });
        const saved = await this.userRepository.save(userOrm);
        return new User({
   id: saved.id,
      email: saved.email,
      passwordHash: saved.passwordHash,
      firstName: saved.firstName,
      lastName: saved.lastName,
      dateOfBirth: saved.dateOfBirth,
      nationality: saved.nationality,
      phone: saved.phone,
      role: saved.role as UserRole,           
      kycStatus: saved.kycStatus as KycStatus,
      isEmailVerified: saved.isEmailVerified,
      isPhoneVerified: saved.isPhoneVerified,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });

    }
    async findById(id: string): Promise<User | null> {
        const userOrm = await this.userRepository.findOne({ where: { id } });
        if (!userOrm) return null;
        return new User({
           id: userOrm.id,
      email: userOrm.email,
      passwordHash: userOrm.passwordHash,
      firstName: userOrm.firstName,
      lastName: userOrm.lastName,
      dateOfBirth: userOrm.dateOfBirth,
      nationality: userOrm.nationality,
      phone: userOrm.phone,
      role: userOrm.role as UserRole,           // Explicit cast
      kycStatus: userOrm.kycStatus as KycStatus,
      isEmailVerified: userOrm.isEmailVerified,
      isPhoneVerified: userOrm.isPhoneVerified,
      createdAt: userOrm.createdAt,
      updatedAt: userOrm.updatedAt,
        });
    }
    async findByEmail(email: string): Promise<User | null> {
        const userOrm = await this.userRepository.findOne({ where: { email } });
        if (!userOrm) return null;
        return new User({
               id: userOrm.id,
      email: userOrm.email,
      passwordHash: userOrm.passwordHash,
      firstName: userOrm.firstName,
      lastName: userOrm.lastName,
      dateOfBirth: userOrm.dateOfBirth,
      nationality: userOrm.nationality,
      phone: userOrm.phone,
      role: userOrm.role as UserRole,           // Explicit cast
      kycStatus: userOrm.kycStatus as KycStatus,
      isEmailVerified: userOrm.isEmailVerified,
      isPhoneVerified: userOrm.isPhoneVerified,
      createdAt: userOrm.createdAt,
      updatedAt: userOrm.updatedAt,
        });
    }
    async update(user: User): Promise<User> {
        await this.userRepository.save({
            ...user,
            kycStatus: user.kycStatus,
        });
        return user;
    }
    async saveKyc(kyc: Kyc): Promise<Kyc> {
        const kycOrm = this.kycRepository.create(kyc);
        const savedKyc = await this.kycRepository.save(kycOrm);
        return new Kyc({id: kycOrm.id,
    userId: kycOrm.userId,
    status: kycOrm.status as KycStatus,
    idType: kycOrm.idType as IdType,
    idNumber: kycOrm.idNumber,
    idExpiry: kycOrm.idExpiry,
    idPhotoUrl: kycOrm.idPhotoUrl,
    selfieUrl: kycOrm.selfieUrl,
    addressProofUrl: kycOrm.addressProofUrl,
    submittedAt: kycOrm.submittedAt,
    reviewedBy: kycOrm.reviewedBy,
    reviewedAt: kycOrm.reviewedAt,
    rejectionReason: kycOrm.rejectionReason,});
    }
async findKycByUserId(userId: string): Promise<Kyc | null> {
    const kycOrm = await this.kycRepository.findOne({ where: { userId } });
    if (!kycOrm) return null;
    return new Kyc({
        id: kycOrm.id,
    userId: kycOrm.userId,
    status: kycOrm.status as KycStatus,
    idType: kycOrm.idType as IdType,
    idNumber: kycOrm.idNumber,
    idExpiry: kycOrm.idExpiry,
    idPhotoUrl: kycOrm.idPhotoUrl,
    selfieUrl: kycOrm.selfieUrl,
    addressProofUrl: kycOrm.addressProofUrl,
    submittedAt: kycOrm.submittedAt,
    reviewedBy: kycOrm.reviewedBy,
    reviewedAt: kycOrm.reviewedAt,
    rejectionReason: kycOrm.rejectionReason,
    });
  }
async updateKycStatus(
    userId: string, 
  status: KycStatus,
    reviewedBy?: string
  ): Promise<void> {
    await this.kycRepository.update(
      { userId },
      {
        status,
        reviewedBy,
        reviewedAt: new Date()
      }
    );
  }


}