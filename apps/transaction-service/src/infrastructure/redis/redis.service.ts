import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from "cache-manager";

@Injectable()
export class RedisService{
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache ){}

    async lockWallet(walletId:string, ttlSeconds:number = 30):Promise<boolean>{
        const lockKey = `wallet_lock:${walletId}`
        const locked = await this.cacheManager.set(
            lockKey,
            'locked',
            ttlSeconds
        );

        return !!locked;
    }

    async unlocakWallet(walletId:string):Promise<void>{
        const lockKey = `lock:wallet:${walletId}`;
    await this.cacheManager.del(lockKey);
    }
    async isWalletLocked(walletId: string): Promise<boolean> {
    const lockKey = `lock:wallet:${walletId}`;
    const value = await this.cacheManager.get(lockKey);
    return !!value;
  }
}