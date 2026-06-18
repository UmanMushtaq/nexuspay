import { HttpStatus, Injectable } from "@nestjs/common";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repositry";
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from "ioredis";
import { DomainException } from "../../common/exceptions/domain.exception";
const CACHE_TTL_SECONDS = 300;



@Injectable()
export class GetUserProfileUseCase{

    constructor(private readonly userRepository:UserRepositoryImpl,
        @InjectRedis() private readonly redis:Redis
    ){}

    async execute (userId:string){
        const cacheKey = `user:profile:${userId}`;
        const cached = await this.redis.get(cacheKey)
        if (cached) {
      return JSON.parse(cached);
    }
       const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new DomainException('User not found', HttpStatus.NOT_FOUND);
    }

    const profile = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      kycStatus: user.kycStatus,
    };

    await this.redis.set(cacheKey,  JSON.stringify(profile), 'EX', CACHE_TTL_SECONDS);
    return profile;
  }

}