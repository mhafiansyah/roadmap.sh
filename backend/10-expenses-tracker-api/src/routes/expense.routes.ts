import { Router } from 'express';
import * as c from '@/controller/expense.controller.js';
import { validate } from '@/middleware/validation.middleware.js';
import * as v from '@/validation/expense.validation.js';

const router = Router();

router
  .route('/')
  .get(validate(v.filterExpenseSchema), c.getAllExpenses)
  .post(validate(v.createExpenseSchema), c.createExpense);

router
  .route('/:id')
  .get(validate(v.idSchema), c.getExpenseById)
  .put(validate(v.updateExpenseSchema), c.updateExpense)
  .delete(validate(v.idSchema), c.deleteExpense);

export default router;
