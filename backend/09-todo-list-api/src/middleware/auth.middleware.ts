import { verifyToken } from '@/services/jwt.services.js';
import type { IAuthRequest } from '@/types/type.js';
import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

export const authenticate = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: no token provided' });
  }

  try {
    const decoded = verifyToken(token) as JwtPayload & { userId: number };

    if (!decoded || typeof decoded.userId !== 'number') {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid token payload' });
    }

    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
  }
};
