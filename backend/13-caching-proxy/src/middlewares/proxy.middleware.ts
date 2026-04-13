import type { RequestHandler } from 'express';
import * as cache from '@/services/redis.service.js';

export const cacheProxy =
  ({ origin }: { origin: string }): RequestHandler =>
  async (req, res, next) => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    const cacheKey = `cache:${req.originalUrl}`;

    // try to get cached data from redis
    try {
      const cachedResponse = await cache.client.get(cacheKey);

      if (cachedResponse) {
        const { body } = JSON.parse(cachedResponse);

        res.json({
          body,
          cached: true,
        });
        return;
      }
    } catch (error) {
      console.error('Failed to read from redis cache', error);
    }

    // fetch data if no cached data
    try {
      const targetUrl = new URL(req.originalUrl, origin);
      const response = await fetch(targetUrl);
      const rawBody = await response.text();
      const status = response.status;

      let parsedBody;
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        parsedBody = rawBody;
      }

      res.status(status);
      if (response.ok) {
        const cacheValue = JSON.stringify({
          body: parsedBody,
        });

        cache.client
          .set(cacheKey, cacheValue, {
            EX: 60,
          })
          .catch((error) => {
            console.error('Failed to write to redis cache', error);
          });
        res.json({ body: parsedBody, cached: false });
      }
    } catch (error) {
      next(error);
    }
  };
