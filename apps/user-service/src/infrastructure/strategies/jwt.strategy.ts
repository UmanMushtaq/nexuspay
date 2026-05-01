import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { UserRepositoryImpl } from '../repositories/user.repositry';
import { ExtractJwt, Strategy } from 'passport-jwt';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userRepository: UserRepositoryImpl){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'your-secret-key-change-in-production',

        })
        
    }
    async validate(payload: any) {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}