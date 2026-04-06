import express from 'express';
import authRoutes from '@/routes/auth.routes.js';
import expenseRoutes from '@/routes/expense.routes.js';
import { authenticate } from '@/middleware/auth.middleware.js';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/expense', authenticate, expenseRoutes);

export default app;
