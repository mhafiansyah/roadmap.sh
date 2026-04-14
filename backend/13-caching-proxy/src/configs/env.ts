import { loadEnvFile } from 'node:process';

loadEnvFile();

export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
export const CACHE_TTL = Number(process.env.CACHE_TTL) || 60;
