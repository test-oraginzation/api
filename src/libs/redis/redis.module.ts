import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './services/redis.service';
import redisConfig from '../../config/redis.config';

@Module({
  imports: [
    CacheModule.register({
      useFactory: () => ({
        store: redisConfig.store,
        host: redisConfig.host,
        port: redisConfig.port,
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
