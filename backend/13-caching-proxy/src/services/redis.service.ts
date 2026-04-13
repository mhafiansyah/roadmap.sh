import { REDIS_URL } from '@/configs/env.js';
import { createClient, type RedisClientType } from 'redis';

export const client: RedisClientType = createClient({ url: REDIS_URL });

client.on('error', (err) => {
  console.error('Redis client error', err);
});

export const connect = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};

export const disconnect = async () => {
  if (client.isOpen) {
    await client.quit();
  }
};
