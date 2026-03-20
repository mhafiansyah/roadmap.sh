import { z } from 'zod';

export const Id = z.strictObject({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

export const pagination = z.object({
  query: z.strictObject({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(20).default(5),
  }),
});

export const paramsId = z.object({
  params: Id,
});

export const createTodoSchema = z.object({
  body: z.strictObject({
    title: z.string({ error: 'Title is required' }),
    description: z.string().optional(),
  }),
});

export const updateTodoSchema = z.object({
  body: z.strictObject({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
  params: Id,
});
