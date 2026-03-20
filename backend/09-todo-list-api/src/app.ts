import express, { type Request, type Response } from 'express';
import authRoutes from '@/routes/auth.routes.js';
import todoRoutes from '@/routes/todos.routes.js';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome');
});

export default app;
