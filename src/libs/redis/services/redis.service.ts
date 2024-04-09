import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async cacheData(key: string, value: any) {
    return await this.cacheManager.set(key, value);
  }

  async getData(key: string): Promise<any> {
    return await this.cacheManager.get<any>(key);
  }

  async deleteData(key: string) {
    return await this.cacheManager.del(key);
  }

  async updateData(key: string, value: any): Promise<any> {
    return await this.cacheManager.set(key, value);
  }
}
