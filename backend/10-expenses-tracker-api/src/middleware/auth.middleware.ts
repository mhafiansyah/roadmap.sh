import { verifyToken } from '@/services/jwt.services.js';
import type { NextFunction, Request, Response } from 'express';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: no token provided or invalid' });
  }
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: no token provided or invalid' });
  }

  try {
    const decoded = await verifyToken(token, 'access');

    if (!decoded) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: no token provided or invalid' });
    }

    req.user = decoded as any;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: 'Unauthorized: no token provided or invalid' });
  }
};
