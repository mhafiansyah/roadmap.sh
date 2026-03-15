import express, { type Request, type Response } from 'express';
import postsRouter from '@/routes/posts.routes.js';

const app = express();

app.use(express.json());
app.use('/posts', postsRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('welcome');
});

export default app;
