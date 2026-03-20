import * as todo from '@/controller/todos.controller.js';
import { authenticate } from '@/middleware/auth.middleware.js';
import { validateRequest } from '@/middleware/validation.middleware.js';
import {
  createTodoSchema,
  pagination,
  paramsId,
  updateTodoSchema,
} from '@/schema/todo.validation.js';
import { Router } from 'express';

const router = Router();

router.get('/', authenticate, validateRequest(pagination), todo.getAllTodos);
router.get('/:id', authenticate, validateRequest(paramsId), todo.getTodo);
router.post(
  '/',
  authenticate,
  validateRequest(createTodoSchema),
  todo.createTodo,
);
router.put(
  '/:id',
  authenticate,
  validateRequest(updateTodoSchema),
  todo.updateTodo,
);
router.delete('/:id', authenticate, validateRequest(paramsId), todo.deleteTodo);

export default router;
