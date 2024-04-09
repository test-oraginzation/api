import { redisStore } from 'cache-manager-redis-store';

export default {
  store: redisStore,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};
