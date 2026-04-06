import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodType } from 'zod';

export const validate = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = (await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      })) as { body: any; params: any; query: any };

      res.locals.validated = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.issues,
        });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};
