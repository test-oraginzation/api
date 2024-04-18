import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async cacheUserPhotoNameData(userId: number, value: string) {
    try {
      await this.redis.set(`user-photo:${userId}`, value, 'EX', 120);
      console.log(`user ${userId} photo data cached`);
      return true;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Error caching data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cacheWishPhotoNameData(wishId: number, value: string) {
    try {
      await this.redis.set(`wish-photo:${wishId}`, value, 'EX', 120);
      console.log(`wish ${wishId} photo data cached`);
      return true;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Error caching data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cacheListPhotoNameData(listId: number, value: string) {
    try {
      await this.redis.set(`list-photo:${listId}`, value, 'EX', 120);
      console.log(`list ${listId} photo data cached`);
      return true;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Error caching data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserPhotoName(userId: number): Promise<string | null> {
    const data = await this.redis.get(`user-photo:${userId}`);
    console.log(`get user data from cache ${userId}: ${data}`);
    return data;
  }

  async getWishPhotoName(wishId: number): Promise<string | null> {
    const data = await this.redis.get(`wish-photo:${wishId}`);
    console.log(`get wish data from cache ${wishId}: ${data}`);
    return data;
  }

  async getListPhotoName(listId: number): Promise<string | null> {
    const data = await this.redis.get(`list-photo:${listId}`);
    console.log(`get list data from cache ${listId}: ${data}`);
    return data;
  }

  async deleteUserPhotoNameData(userId: number) {
    return this.redis.del(`user-photo:${userId}`);
  }

  async deleteWishPhotoNameData(userId: number) {
    return this.redis.del(`wish-photo:${userId}`);
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
