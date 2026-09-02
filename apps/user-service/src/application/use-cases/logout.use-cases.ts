import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Redis } from "ioredis";
import * as crypto from 'crypto';



@Injectable()
export class LogoutUseCase{
    constructor(
        @InjectRedis() private readonly redis:Redis,
        private readonly jwtService: JwtService
    ){}

    async execute (token:string): Promise<void>{
        const tokenHash = await crypto.createHash('sha256').update(token).digest('hex');
        const decode:any = this.jwtService.decode(token);
        const nowSeconds = Math.floor(Date.now()/1000);
        const ttlSeconds = decode?.exp? decode.exp - nowSeconds:3600;
         if (ttlSeconds > 0) {
      await this.redis.set(`blacklist:token:${tokenHash}`, '1', 'EX', ttlSeconds);
    }

    }
} 