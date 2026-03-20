import type { IAuthRequest } from '@/types/type.js';
import { type NextFunction, type Request, type Response } from 'express';
import z, { ZodError, type ZodObject } from 'zod';

export const validateRequest = (schema: ZodObject<any>) => {
  return (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          errors: z.prettifyError(err),
        });
      }

      return res.status(500).json({
        status: 'error',
        message: '[validation] Internal server error',
        err: err,
      });
    }
  };
};
