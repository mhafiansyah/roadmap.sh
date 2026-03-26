import type { Request, Response } from 'express';

export interface IAuthRequest extends Request {
  userId?: number;
}

export type ValidatedResponse<T> = Response<any, { validated: T }>;
