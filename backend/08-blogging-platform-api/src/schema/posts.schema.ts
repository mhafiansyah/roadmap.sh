import { z } from 'zod';

export const Id = z.strictObject({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

export const parameterID = z.object({
  params: Id,
});

export const createPostSchema = z.object({
  body: z.strictObject({
    title: z.string(),
    content: z.string(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updatePostSchema = z.object({
  params: Id,
  body: z.strictObject({
    title: z.string().optional(),
    content: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
