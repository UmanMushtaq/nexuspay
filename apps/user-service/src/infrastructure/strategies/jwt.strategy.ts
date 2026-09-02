import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { UserRepositoryImpl } from '../repositories/user.repositry';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Redis } from 'ioredis';
import * as crypto from 'crypto';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userRepository: UserRepositoryImpl,
      @InjectRedis() private readonly redis:Redis
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'your-secret-key-change-in-production',
            passReqToCallback:true,

        })
        
    }
    async validate(req:any, payload: any) {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (token){
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const isBlacklisted = await this.redis.exists(`blacklist:token:${tokenHash}`);
        if (isBlacklisted) {
          throw new UnauthorizedException('Token is blacklisted');
        }
      }
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}