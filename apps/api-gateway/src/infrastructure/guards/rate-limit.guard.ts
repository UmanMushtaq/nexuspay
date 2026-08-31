import { Injectable } from "@nestjs/common";

import { CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 100;

@Injectable()
export class RateLimitGuard implements CanActivate{
    private readonly redis:Redis;

    constructor (private readonly jwtService: JwtService){
        this.redis = new Redis ({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD || 'undefined',
        });
    }
    
    async canActivate(context: ExecutionContext):Promise<boolean> {
        const request = context.switchToHttp().getRequest();
         const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
         await this.checkLimit(`ratelimit:ip:${ip}`);
         const authHeader = request.headers['authorization'];

         if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            try{
                const payload = await this.jwtService.verifyAsync(token,{
                    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
                })
                if (payload?.sub){
                    await this.checkLimit(`ratelimit:user:${payload.sub}`);
                }
            }
            catch{
                void 0
            }

           
        }
         return true;

    }
    private async checkLimit(key:string):Promise<void>{
        const count = await this.redis.incr(key);
        if(count ===1){
            await this.redis.expire(key,WINDOW_SECONDS);
        }
        if (count > MAX_REQUESTS){
            throw new HttpException('Too many requests',HttpStatus.TOO_MANY_REQUESTS);
        }
    }


}