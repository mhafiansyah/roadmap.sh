import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError, z } from 'zod';

export const validateRequest = (schema: ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          errors: z.prettifyError(error),
        });
      }
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }
  };
};
