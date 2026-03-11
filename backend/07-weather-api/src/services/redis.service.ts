import { REDIS_URL } from '@/config/env.js';
import { createClient } from 'redis';

export const redisClient = createClient({ url: REDIS_URL }).on('error', (err) =>
  console.error('Redis Client Error', err),
);

export const redisConnect = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};
