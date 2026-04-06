import type { Response } from 'express';
import type { z } from 'zod';

export type ValidatedResponse<T extends z.ZodType, ResBody = any> = Response<
  ResBody,
  {
    validated: z.infer<T>;
  }
>;
