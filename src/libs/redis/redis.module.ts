import { Module } from '@nestjs/common';
import { RedisService } from './services/redis.service';
import Redis from 'ioredis';
import { RedisConfig } from '../../config/redis.config';
@Module({
  imports: [],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis(RedisConfig);
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
