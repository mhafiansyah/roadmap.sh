import * as todo from '@/controller/todos.controller.js';
import { authenticate } from '@/middleware/auth.middleware.js';
import { validateRequest } from '@/middleware/validation.middleware.js';
import {
  createTodoSchema,
  getTodos,
  paramsId,
  updateTodoSchema,
} from '@/schema/todo.validation.js';
import { Router } from 'express';

const router = Router();

router
  .route('/')
  .get(authenticate, validateRequest(getTodos), todo.getAllTodos)
  .post(authenticate, validateRequest(createTodoSchema), todo.createTodo);

router
  .route('/:id')
  .get(authenticate, validateRequest(paramsId), todo.getTodo)
  .put(authenticate, validateRequest(updateTodoSchema), todo.updateTodo)
  .delete(authenticate, validateRequest(paramsId), todo.deleteTodo);

export default router;
