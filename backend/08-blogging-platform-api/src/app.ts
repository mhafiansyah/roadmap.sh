import express, { type Request, type Response } from 'express';
import postsRouter from '@/routes/posts.routes.js';
import { rateLimiter } from '@/middleware/rateLimit.js';
import { redisConnect } from '@/services/redis.services.js';

const app = express();

app.use(express.json());
app.use('/posts', rateLimiter, postsRouter);

try {
  await redisConnect();
} catch (error) {
  console.error('[app] Init Redis Connection Failed :', error);
}

app.get('/', (req: Request, res: Response) => {
  res.send('welcome');
});

export default app;
