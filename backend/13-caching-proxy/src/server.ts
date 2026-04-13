import { cacheProxy } from '@/middlewares/proxy.middleware.js';
import express from 'express';

export const startServer = async (port: number, origin: string) => {
  const app = express();

  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });

  app.use(cacheProxy({ origin }));

  console.log(`Proxy origin: ${origin}`);
};
