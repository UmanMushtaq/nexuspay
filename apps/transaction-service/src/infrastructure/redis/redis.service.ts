import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from "cache-manager";
import { DomainException } from "../../common/exceptions/domain.exception";
import { WalletLockedException } from "../../common/exceptions/wallet-locked.exception";

@Injectable()
export class RedisService{
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache ){}

    async lockWallet(walletId:string, ttlSeconds:number = 30):Promise<boolean>{
        const lockKey = `wallet_lock:${walletId}`
        try {
            const locked = await this.cacheManager.set(
            lockKey,
            'locked',
            ttlSeconds
        );
        if (!locked) {
            throw new WalletLockedException(walletId)
        }

        return true;
        } catch (error) {
            if (error instanceof WalletLockedException) {
        throw error;
      }
      throw new WalletLockedException(walletId);
        }
        
    }

    async unlockWallet(walletId:string):Promise<void>{
        const lockKey = `wallet_lock:${walletId}`;
        try {
              await this.cacheManager.del(lockKey);
        } catch (error) {
           console.error(`Failed to unlock wallet ${walletId}:`, error);
        }
  
    }
    async isWalletLocked(walletId: string): Promise<boolean> {
    const lockKey = `wallet_lock:${walletId}`;
    try {
        const value = await this.cacheManager.get(lockKey);
    return !!value;
        
    } catch (error) {
        return false; // Assume not locked if there's an error checking
    }
    
  }
  async get<T>(key: string): Promise<T | null> {
    try {
      const ca:any =  await this.cacheManager.get(key);
      return ca;
    } catch (error) {
      return null;
    }
  }
  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttlSeconds);
    } catch (error) {
      console.error(`Cache set failed for key ${key}:`, error);
    }
  }
}