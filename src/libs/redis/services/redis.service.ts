import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisServiceInterface } from '../typing/interfaces/redis.service.interface';
@Injectable()
export class RedisService implements RedisServiceInterface {
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

  async getUserPhotoName(userId: number) {
    const data = await this.redis.get(`user-photo:${userId}`);
    console.log(`get user data from cache ${userId}: ${data}`);
    return data;
  }

  async getWishPhotoName(wishId: number) {
    const data = await this.redis.get(`wish-photo:${wishId}`);
    console.log(`get wish data from cache ${wishId}: ${data}`);
    return data;
  }

  async getListPhotoName(listId: number) {
    const data = await this.redis.get(`list-photo:${listId}`);
    console.log(`get list data from cache ${listId}: ${data}`);
    return data;
  }

  async checkConnection() {
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
