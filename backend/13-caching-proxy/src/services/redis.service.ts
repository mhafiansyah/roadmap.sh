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

export const clearCache = async () => {
  try {
    let count = 0;

    for await (const key of client.scanIterator({
      MATCH: 'cache:*',
      COUNT: 100,
    })) {
      await client.del(key);
      count++;
    }

    console.log(`Successfully cleared ${count} keys`);
  } catch (error) {
    console.error('Failed to clear cache', error);
  }
};
