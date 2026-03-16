import { z } from 'zod';

export const Id = z.strictObject({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

export const parameterID = z.object({
  params: Id,
});

export const createPostSchema = z.object({
  body: z.strictObject({
    title: z
      .string({ error: 'Title is required' })
      .min(1, 'Title cannot be empty')
      .max(255),
    content: z
      .string({ error: 'Content is required' })
      .min(1, 'Content cannot be empty'),
    category: z.string().max(100).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updatePostSchema = z.object({
  params: Id,
  body: z.strictObject({
    title: z.string().min(1).max(255).optional(),
    content: z.string().min(1).optional(),
    category: z.string().max(100).optional(),
    tags: z.array(z.string()).optional(),
  }),
});
