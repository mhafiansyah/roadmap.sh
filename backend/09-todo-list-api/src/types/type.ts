import type { Request } from 'express';

export interface IAuthRequest extends Request {
  userId?: number;
}
