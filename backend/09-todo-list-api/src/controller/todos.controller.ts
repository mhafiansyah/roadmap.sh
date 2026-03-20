import type { IAuthRequest } from '@/types/type.js';
import type { Request, Response } from 'express';
import * as todoService from '@/services/todos.services.js';

export const getAllTodos = async (req: IAuthRequest, res: Response) => {
  const { page = 1, limit = 2 } = req.query;
  const userId = req.userId!;

  try {
    const todos = await todoService.getAllTodos(
      userId,
      Number(page),
      Number(limit),
    );
    return res.status(200).json(todos);
  } catch (err) {
    return res.status(500).json({ message: 'failed to fetch all todos', err });
  }
};

export const getTodo = async (req: IAuthRequest, res: Response) => {
  const todoId = Number(req.params.id);
  const userId = req.userId!;

  try {
    const todo = await todoService.getTodo(todoId, userId);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    return res.status(200).json(todo);
  } catch (err) {
    return res.status(500).json({ message: 'failed to add todo', err });
  }
};

export const createTodo = async (req: IAuthRequest, res: Response) => {
  try {
    const todo = await todoService.createTodo({
      ...req.body,
      userId: req.userId!,
    });

    return res.status(201).json(todo);
  } catch (err) {
    return res.status(500).json({ message: 'failed to add todo', err });
  }
};

export const updateTodo = async (req: IAuthRequest, res: Response) => {
  const todoId = Number(req.params.id);
  const userId = req.userId!;
  const newData = req.body;

  try {
    const todo = await todoService.updateTodo(todoId, userId, newData);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    return res.status(200).json(todo);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update todo', err });
  }
};

export const deleteTodo = async (req: IAuthRequest, res: Response) => {
  const todoId = Number(req.params.id);
  const userId = req.userId!;

  try {
    const todo = await todoService.deleteTodo(todoId, userId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    return res.status(204).json(todo);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete todo', err });
  }
};
