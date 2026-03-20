import { z } from 'zod';

export const userRegisterSchema = z.object({
  body: z.strictObject({
    name: z.string({ error: 'Name is required' }),
    email: z.email({ error: 'Email is required' }),
    password: z.string({ error: 'Password is required' }),
  }),
});

export const userLoginSchema = z.object({
  body: z.strictObject({
    email: z.email({ error: 'Email is required' }),
    password: z.string({ error: 'Password is required' }),
  }),
});
