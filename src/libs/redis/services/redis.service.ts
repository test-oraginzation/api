import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async cachePhotoNameData(userId: number, value: string) {
    try {
      await this.redis.set(`user-photo:${userId}`, value, 'EX', 60);
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
    const data = await this.redis.get(`user-photo:${userId}`);
    console.log(`Retrieved data for user ${userId}: ${data}`);
    return data;
  }

  async deletePhotoNameData(userId: number) {
    return this.redis.del(`user-photo:${userId}`);
  }

  async updateData(key: string, value: any): Promise<any> {
    return this.redis.set(key, value);
  }

  async checkConnection(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      console.log('Redis connected:', result === 'PONG');
      console.log(result);
      return result === 'PONG';
    } catch (error) {
      console.error('Redis connection error:', error);
      return false;
    }
  }
}
