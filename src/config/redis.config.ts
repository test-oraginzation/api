import * as process from 'process';
import Redis from 'ioredis';
import { FactoryProvider } from '@nestjs/common';

export const RedisConfig: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: async () => {
    const redisInstance = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      password: process.env.REDIS_PASS,
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });
    return redisInstance;
  },
};
