import express, { type Request, type Response } from 'express';
import postsRouter from '@/routes/posts.routes.js';
import { rateLimiter } from '@/middleware/rateLimit.js';

const app = express();

app.use(express.json());
app.use('/posts', rateLimiter, postsRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('welcome');
});

export default app;
