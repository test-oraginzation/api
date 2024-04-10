import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async cachePhotoNameData(userId: number, value: string) {
    return await this.cacheManager.set(`user-photo:${userId}`, value);
  }

  async getPhotoNameData(userId: number): Promise<string | null> {
    return await this.cacheManager.get(`user-photo:${userId}`);
  }

  async deleteData(key: string) {
    return await this.cacheManager.del(key);
  }

  async updateData(key: string, value: any): Promise<any> {
    return await this.cacheManager.set(key, value);
  }
}
