import { z } from 'zod';

export const Id = z.strictObject({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

export const paramsId = z.object({
  params: Id,
});

export const getTodos = z.object({
  query: z.strictObject({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(20).default(2),
    sortBy: z.enum(['id', 'title', 'description']).default('id'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});
export type TGetTodos = z.infer<typeof getTodos>;

export const createTodoSchema = z.object({
  body: z.strictObject({
    title: z.string({ error: 'Title is required' }),
    description: z.string().optional(),
  }),
});
export type TCreateTodo = z.infer<typeof createTodoSchema>;

export const updateTodoSchema = z.object({
  body: z.strictObject({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
  params: Id,
});
export type TUpdateTodo = z.infer<typeof updateTodoSchema>;
