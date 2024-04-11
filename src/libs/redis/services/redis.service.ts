import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async cachePhotoNameData(userId: number, value: string) {
    try {
      await this.cacheService.set(`user-photo:${userId}`, value);
      console.log('input value', value);
      console.log(`Saved data for user ${userId}`);
      return true;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Error caching data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPhotoNameData(userId: number): Promise<string | null> {
    const data = await this.cacheService.get<string>(`user-photo:${userId}`);
    console.log(`Retrieved data for user ${userId}: ${data}`);
    return data;
  }

  async deletePhotoNameData(userId: number) {
    return this.cacheService.del(`user-photo:${userId}`);
  }

  async updateData(key: string, value: any): Promise<any> {
    return this.cacheService.set(key, value);
  }
}
