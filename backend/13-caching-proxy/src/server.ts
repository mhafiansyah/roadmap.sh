import { logger } from '@/middlewares/logger.middleware.js';
import { cacheProxy } from '@/middlewares/proxy.middleware.js';
import express from 'express';

export const startServer = async (port: number, origin: string) => {
  const app = express();

  app.use(logger);
  app.use(cacheProxy({ origin }));
  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });

  console.log(`Proxy origin: ${origin}`);
};
