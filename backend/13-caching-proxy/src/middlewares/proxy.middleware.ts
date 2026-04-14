import type { RequestHandler, Response } from 'express';
import * as cache from '@/services/redis.service.js';
import { CACHE_TTL } from '@/configs/env.js';

const CACHEABLE_HEADERS = new Set([
  'cache-control',
  'content-encoding',
  'content-language',
  'content-type',
  'etag',
  'expires',
  'last-modified',
  'vary',
]);

const getCacheableHeaders = (headers: Headers): Record<string, string> => {
  const cachedHeaders: Record<string, string> = {};
  headers.forEach((value, key) => {
    if (CACHEABLE_HEADERS.has(key)) {
      cachedHeaders[key] = value;
    }
  });

  return cachedHeaders;
};

const applyHeaders = (res: Response, headers: Record<string, string>) => {
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
};

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
        const { body, headers, status } = JSON.parse(cachedResponse);

        applyHeaders(res, { ...headers, 'X-Cache': 'HIT' });
        res.status(status).json({
          body,
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
      const headers = getCacheableHeaders(response.headers);

      let parsedBody;
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        parsedBody = rawBody;
      }

      applyHeaders(res, { ...headers, 'X-Cache': 'MISS' });
      if (response.ok) {
        const cacheValue = JSON.stringify({
          body: parsedBody,
          headers,
          status: response.status,
        });

        cache.client
          .set(cacheKey, cacheValue, {
            EX: CACHE_TTL,
          })
          .catch((error) => {
            console.error('Failed to write to redis cache', error);
          });

        res.status(response.status).send({ body: parsedBody });
      }
    } catch (error) {
      next(error);
    }
  };
