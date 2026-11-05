import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from "cache-manager";

@Injectable()
export class RedisService{
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache ){}

  async get<T>(key: string): Promise<T | null> {
    try {
      const ca:any =  await this.cacheManager.get(key);
      return ca;
    } catch (error) {
      return null;
    }
  }
  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttlSeconds);
    } catch (error) {
      console.error(`Cache set failed for key ${key}:`, error);
    }
  }
}
