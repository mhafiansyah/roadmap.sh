import { JWT_SECRET } from '@/config/env.js';
import jwt from 'jsonwebtoken';

export const signToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '6h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
